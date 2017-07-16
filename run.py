#!venv/bin/python3
from flask_app import app

app.flask.debug = True
app.flask.run(host='0.0.0.0', port=8000)
