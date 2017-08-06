#!/user/bin/env python
from flask import render_template
from flask_app import app
import os

@app.route('/blog', methods=['GET'])
def blog():
    return render_template('blog/index.html')

@app.route('/blog/<article>', methods=['GET'])
def article(article):
    file = "flask_app/templates/blog/%s.html" % article
    if os.path.exists(os.path.abspath(file)) == False:
        return "file not found"
    return render_template("blog/%s.html" % article)