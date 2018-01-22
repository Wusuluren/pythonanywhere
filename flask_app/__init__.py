from flask import Flask
# from flask_wtf.csrf import CSRFProtect
import logging
import flask_app.database as database


class WebApp(object):
    def __init__(self, app):
        self.app = app


app = Flask(__name__)
# app.config.from_object('config')
# csrf = CSRFProtect(app)
app.config['SECRET_KEY'] = 'pythonanywhere'

webapp = WebApp(app)
webapp.logger = logging.getLogger('app')
webapp.logger.setLevel(logging.DEBUG)
log_file = logging.FileHandler('/tmp/app.log')
log_console = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s [%(levelname)s] %(message)s')
log_file.setFormatter(formatter)
log_console.setFormatter(formatter)
webapp.logger.addHandler(log_file)
webapp.logger.addHandler(log_console)

# database.monitor_init_mysql(webapp)
# database.monitor_init_redis(webapp)
# database.blog_init_sqlite(webapp)

from flask_app.blueprint.home import home
app.register_blueprint(home)

from flask_app.blueprint.mlmnist import mlmnist
app.register_blueprint(mlmnist, url_prefix='/mlmnist')

from flask_app.blueprint.snake import snake
app.register_blueprint(snake, url_prefix='/snake')

from flask_app.blueprint.markdown import markdown
app.register_blueprint(markdown, url_prefix='/markdown')

from flask_app.blueprint.flower import flower
app.register_blueprint(flower, url_prefix='/flower')
