from flask import render_template
from flask import request
from flask import redirect, url_for

from app import app

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html', username='nano')

@app.route('/resume', methods=['GET'])
def resume():
    return render_template('resume.html')