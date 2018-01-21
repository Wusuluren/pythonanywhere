from flask import render_template, redirect, url_for, request
from flask_app import app


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/path', methods=['GET', 'POST'])
def parse_path():
    path = request.form.get('path')
    print('path: %s' % path)
    return redirect(url_for('%s.index' % path))
