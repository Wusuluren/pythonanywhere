from flask import Flask
# from flask_wtf.csrf import CSRFProtect
import logging
import flask_app.monitor as monitor

class WebApp(object):
    pass

app = Flask(__name__)
# app.config.from_object('config')
# csrf = CSRFProtect(app)
app.config['SECRET_KEY'] = 'pythonanywhere'

webapp = WebApp()

webapp.app = app

webapp.logger = logging.getLogger('app')
webapp.logger.setLevel(logging.DEBUG)
log_file = logging.FileHandler('/tmp/app.log')
log_console = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s [%(levelname)s] %(message)s')
log_file.setFormatter(formatter)
log_console.setFormatter(formatter)
webapp.logger.addHandler(log_file)
webapp.logger.addHandler(log_console)

monitor.monitor_init_mysql(webapp)
monitor.monitor_init_redis(webapp)

from flask_app import views
from flask_app import monitor_views
from flask_app import github_records
from flask_app import mysql
