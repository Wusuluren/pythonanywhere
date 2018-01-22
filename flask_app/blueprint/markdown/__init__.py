from flask import Blueprint
from flask import render_template

markdown = Blueprint('markdown', __name__)


@markdown.route('/', methods=['GET'])
def index():
    return render_template('markdown/index.html')
