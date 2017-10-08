#!/user/bin/env python
from flask import render_template
from flask import make_response, send_file
from flask import request
from flask_app import app,webapp
import flask_app.config as config

@app.route('/bilibili', methods=['GET'])
def bilibili():
    return render_template('bilibili/index.html')

@app.route('/bilibili/download', methods=['GET'])
def dowanload():
    filename = request.args.get("file")
    response = make_response(send_file("./static/bilibili/%s" % filename))
    response.headers["Content-Disposition"] = "attachment; filename=%s;" % filename

    count = 0
    db = webapp.sqlite_bilibili
    results = db.query('select count from %s where filename="%s"' % (config.SQLITE_TABLE_DOWNLOAD, filename))
    if len(results) > 0:
        count = int(results[0][0])
        print(count)
        count += 1
        db.execute('update %s set count=%d where filename="%s"' % (config.SQLITE_TABLE_DOWNLOAD, count, filename))
    else:
        print(count)
        count += 1
        db.execute('insert into %s (filename,count) values ("%s",%d)' % (config.SQLITE_TABLE_DOWNLOAD, filename, count))

    return response
