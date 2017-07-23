#!/user/bin/env python
from flask import render_template
from flask_app import app

@app.route('/games/snake', methods=['GET'])
def games_snake():
   return render_template('games/snake.html')