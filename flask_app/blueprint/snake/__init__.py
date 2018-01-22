from flask import Blueprint
from flask import render_template

snake = Blueprint('snake', __name__)


@snake.route('/', methods=['GET'])
def index():
    return render_template('snake/index.html')
