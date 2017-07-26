#!/user/bin/env python
from flask import render_template
from flask_app import app

@app.route('/markdown', methods=['GET'])
def markdown():
   return render_template('markdown/index.html')