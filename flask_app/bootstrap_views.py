#!/user/bin/env python
from flask import render_template
from flask_app import app,webapp

@app.route('/bootstrap', methods=['GET'])
def bootstrap():
    return render_template('bootstrap/index.html')
