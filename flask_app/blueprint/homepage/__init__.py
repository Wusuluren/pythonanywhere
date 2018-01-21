from flask import Blueprint
from flask import render_template, redirect, url_for


homepage = Blueprint('homepage', __name__, template_folder='templates')


@homepage.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@homepage.route('/<path:path>', methods=['POST'])
def parse_path(path):
    print(path)
    return redirect(url_for(path))
