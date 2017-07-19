from flask import render_template
from flask import request
from flask import redirect, url_for

from webapp import app

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html', username='nano')
