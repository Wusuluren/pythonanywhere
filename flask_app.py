#!venv/bin/python3
from app import app
from app.mysql import MysqlUser
import app.config as config
import logging

app.logger = logging.getLogger('app')
app.logger.setLevel(logging.DEBUG)
log_file = logging.FileHandler('/tmp/app.log')
log_console = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s [%(levelname)s] %(message)s')
log_file.setFormatter(formatter)
log_console.setFormatter(formatter)
app.logger.addHandler(log_file)
app.logger.addHandler(log_console)

app.mysql = MysqlUser(app.logger,
    config.MYSQL_HOST,
    config.MYSQL_USERNAME,
    config.MYSQL_PASSWD,
    config.MYSQL_DB_MONITOR)
app.mysql.open()
create_table_sql = "create table if not exists %s \
(id int unsigned auto_increment, \
username varchar(16) not null, \
passwd varchar(16) not null, \
primary key (id) \
) default charset=utf8;" % config.MYSQL_TABLE_MONITOR_USER
app.mysql.execute(create_table_sql)
