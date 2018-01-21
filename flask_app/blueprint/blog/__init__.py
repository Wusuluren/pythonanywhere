from flask import Blueprint
from flask import render_template
import os


blog = Blueprint('blog', __name__, template_folder='templates')


@blog.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@blog.route('/<article>', methods=['GET'])
def article(article):
    file = "flask_app/templates/blog/%s.html" % article
    if os.path.exists(os.path.abspath(file)) == False:
        return "file not found"
    return render_template("blog/%s.html" % article)