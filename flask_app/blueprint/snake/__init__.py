from flask import Blueprint
from flask import render_template

snake = Blueprint('snake', __name__,
                    template_folder='templates',
                    static_folder='static')


@snake.route('/', methods=['GET'])
def index():
    print('snake')
    return render_template('index.html')
