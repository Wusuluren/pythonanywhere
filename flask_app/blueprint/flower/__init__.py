from flask import Blueprint
from flask import render_template

flower = Blueprint('flower', __name__)


@flower.route('/', methods=['GET'])
def index():
    return render_template('flower/index.html')
