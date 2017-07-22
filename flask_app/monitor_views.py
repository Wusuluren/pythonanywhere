from flask import render_template
from flask import request
from flask import redirect, url_for
from datetime import datetime

from  flask_app import app, webapp
import flask_app.config as config

@app.route('/monitor/')
@app.route('/monitor/index')
def monitor_index():
    return render_template('monitor/index.html')

@app.route('/monitor/sign_in', methods=['GET', 'POST'])
def monitor_sign_in():
    return render_template('monitor/sign_in.html')

@app.route('/monitor/sign_up', methods=['GET', 'POST'])
def monitor_sign_up():
    return render_template('monitor/sign_up.html')

def is_user_exist(username):
        results = webapp.mysql_monitor.query("select username from %s where username='%s';" % (config.MYSQL_TABLE_MONITOR_USER, username))
        return True if len(results) > 0 else False

@app.route('/monitor/check', methods=['GET', 'POST'])
def monitor_check():
    username = request.form.get('username', '')
    passwd = request.form.get('password', '')
    action_type = request.form.get('action_type', '')
    err_msg=''

    if username == '':
        err_msg = '请输入用户'
        return render_template('monitor/index.html', extra_msg=err_msg)
    if passwd == '':
        err_msg = '请输入密码'
        return render_template('monitor/index.html', extra_msg=err_msg)
    if action_type != 'sign_in' and action_type != 'sign_up':
        err_msg = '未知的请求类型'
        return render_template('monitor/index.html', extra_msg=err_msg)

    if action_type == 'sign_up':
        if is_user_exist(username):
            err_msg = '用户已经存在'
            return render_template('monitor/index.html', extra_msg=err_msg)
        insert_sql = "insert into %s (username, passwd) values ('%s', '%s')" % (config.MYSQL_TABLE_MONITOR_USER, username, passwd)
        if webapp.mysql_monitor.insert(insert_sql) == False:
            err_msg = '创建用户失败，请重新尝试'
            return render_template('monitor/index.html', extra_msg=err_msg)
        else:
            info_msg = '创建用户成功，请登录'
            return render_template('monitor/index.html', extra_msg=info_msg)
    elif action_type == 'sign_in':
        if not is_user_exist(username):
            err_msg = '用户不存在'
            return render_template('monitor/index.html', extra_msg=err_msg)
        webapp.redis_monitor_user.hset(username, True)
        return redirect('/monitor/%s/logs' % username)
    else:
       return '500' 

@app.route('/monitor/<username>/update', methods=['POST'])
def update_log(username):
    if not is_user_exist(username):
        return 'username is not exist\n'
    date = request.form.get('date', datetime.now())
    msg = request.form.get('msg', '')
    webapp.logger.debug('%s,%s,%s' % (username, str(date), msg))
    webapp.mysql_monitor.insert("insert into %s (username,date,msg) values ('%s','%s','%s')" % (config.MYSQL_TABLE_MONITOR_LOG, username, str(date), msg) )
    webapp.redis_monitor_log.hset(username, msg)
    return 'update done\n'

@app.route('/monitor/<username>/logs', methods=['GET'])
def logs(username):
    status = webapp.redis_monitor_user.hget(username)
    if status != b'True':
        err_msg = '请先登录'
        print(status)
        return render_template('monitor/index.html', extra_msg=err_msg)
    result = webapp.mysql_monitor.query("select date, msg from %s where username='%s'" % (config.MYSQL_TABLE_MONITOR_LOG, username))
    # logs = []
    all_msg=''
    if len(result) > 0:
        for r in result:
            # logs.append(r)
            all_msg += r[0]+'\n'+r[1]+'\n'
    new_msg = webapp.redis_monitor_log.hget(username)
    return render_template('monitor/logs.html', username=username, all_msg=all_msg, new_msg=new_msg)
