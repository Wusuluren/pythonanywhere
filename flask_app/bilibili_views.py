#!/user/bin/env python
from flask import render_template
from flask import make_response, send_file
from flask import request
from flask_app import app,webapp

@app.route('/bilibili', methods=['GET'])
def bilibili():
    return render_template('bilibili/index.html')

@app.route('/bilibili/download', methods=['GET'])
def dowanload():
    filename = request.args.get("file")
    response = make_response(send_file("./static/bilibili/%s" % filename))
    response.headers["Content-Disposition"] = "attachment; filename=%s;" % filename
    return response
