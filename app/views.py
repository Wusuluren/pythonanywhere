#!venv/bin/python3
from flask import render_template
from flask import request
from flask import redirect, url_for

from app import app

@app.flask.route('/')
@app.flask.route('/index')
def index():
    return render_template('index.html', username='nano')
