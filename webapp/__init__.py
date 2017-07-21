from flask import Flask
from flask_wtf.csrf import CSRFProtect
from webapp.mysql import MysqlUser
import webapp.config as config
import logging

class WebApp(object):
    def __init__(self):
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

webapp.mysql = MysqlUser(webapp.logger,
    config.MYSQL_HOST,
    config.MYSQL_USERNAME,
    config.MYSQL_PASSWD,
    config.MYSQL_DB_MONITOR)
webapp.mysql.open()
create_table_sql = "create table if not exists %s \
(id int unsigned auto_increment, \
username varchar(16) not null, \
passwd varchar(16) not null, \
primary key (id) \
) default charset=utf8;" % config.MYSQL_TABLE_MONITOR_USER
webapp.mysql.execute(create_table_sql)

from webapp import views
from webapp import monitor_views
from webapp import github_records
# from webapp import chat_room_views
from webapp import mysql
