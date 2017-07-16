#!venv/bin/python3
from flask import Flask
from flask_wtf.csrf import CSRFProtect

class App(object):
    def __init__(self):
        pass

app = App()

app.flask = Flask(__name__)
# app.config.from_object('config')
# csrf = CSRFProtect(app)
app.flask.config['SECRET_KEY'] = 'pythonanywhere'

from app import views
from app import monitor_views
# from app import chat_room_views
from app import mysql
