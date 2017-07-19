from flask import render_template
from flask import request
from flask import redirect, url_for

from webapp import app, webapp
import webapp.config as config

monitor_all_msg = ''
monitor_new_msg = ''
accountLoginStatus = {}

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

@app.route('/monitor/check', methods=['GET', 'POST'])
def monitor_check():
    global accountLoginStatus
    account = request.form.get('account', '')
    passwd = request.form.get('password', '')
    action_type = request.form.get('action_type', '')
    err_msg=''

    if account == '':
        err_msg = '请输入账户'
    elif passwd == '':
        err_msg = '请输入密码'
    elif action_type != 'sign_in' and action_type != 'sign_up':
        err_msg = '未知的请求类型'
    else:
        pass
    if err_msg!= '':
        return render_template('monitor/index.html', extra_msg=err_msg)

    if action_type == 'sign_up':
        results = webapp.mysql.query("select username from %s where username='%s';" % (config.MYSQL_TABLE_MONITOR_USER, account))
        if len(results) > 0:
            err_msg = '用户已经存在'
            return render_template('monitor/index.html', extra_msg=err_msg)
        insert_sql = "insert into %s (username, passwd) values ('%s', '%s')" % (config.MYSQL_TABLE_MONITOR_USER, account, passwd)
        if webapp.mysql.insert(insert_sql) == False:
            err_msg = '创建用户失败，请重新尝试'
            return render_template('monitor/index.html', extra_msg=err_msg)
        else:
            info_msg = '创建用户成功，请登录'
            return render_template('monitor/index.html', extra_msg=info_msg)
    elif action_type == 'sign_in':
        results = webapp.mysql.query("select username from %s where username='%s';" % (config.MYSQL_TABLE_MONITOR_USER, account))
        if len(results) == 0:
            err_msg = '用户不存在'
            return render_template('monitor/index.html', extra_msg=err_msg)
        accountLoginStatus[account] = True
        return redirect('/monitor/logs')
    else:
        pass

@app.route('/monitor/update', methods=['POST'])
def update_log():
    global monitor_all_msg, monitor_new_msg, accountLoginStatus
    account = request.form.get('account', '')
    if accountLoginStatus.get(account, False) == False:
        return
    monitor_new_msg = request.form.get('msg', '')
    monitor_all_msg += monitor_new_msg

@app.route('/monitor/logs', methods=['GET'])
def logs():
    global monitor_all_msg, monitor_new_msg, accountLoginStatus
    # account = request.form.get('account', '')
    # if accountLoginStatus.get(account, False) == False:
    #     err_msg = '请登录后操作'
    #     return render_template('monitor/index.html', extra_msg=err_msg)
    return render_template('monitor/logs.html', all_msg=monitor_all_msg, new_msg=monitor_new_msg)
