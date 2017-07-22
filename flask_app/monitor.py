#!/usr/bin/virtualenv python
import flask_app.config as config
from flask_app.mysql import Mysql
from flask_app.redis import  Redis

# class User(object):
#     def __init__(self, name, passwd):
#         self.name = name
#         self.passwd = passwd

class MonitorUser(Mysql):
    pass

def monitor_init_mysql(webapp):
    mysql_monitor = MonitorUser(webapp.logger,
        config.MYSQL_HOST,
        config.MYSQL_USERNAME,
        config.MYSQL_PASSWD,
        config.MYSQL_DB_MONITOR)
    mysql_monitor.open()
    create_monitor_user_table_sql = "create table if not exists %s \
        (id int unsigned auto_increment, \
        username varchar(16) not null, \
        passwd varchar(16) not null, \
        primary key (id) \
        ) default charset=utf8;" % config.MYSQL_TABLE_MONITOR_USER
    mysql_monitor.execute(create_monitor_user_table_sql)
    create_monitor_log_table_sql = "create table if not exists %s \
        (id int unsigned auto_increment, \
        username varchar(16) not null, \
        date text not null, \
        msg text not null, \
        primary key (id) \
        ) default charset=utf8;" % config.MYSQL_TABLE_MONITOR_LOG
    mysql_monitor.execute(create_monitor_log_table_sql)
    
    webapp.mysql_monitor = mysql_monitor

class RedisMonitor(Redis):
    pass

def monitor_init_redis(webapp):
    redis_monitor_user = RedisMonitor(webapp.logger,
        config.REDIS_HOST,
        config.REDIS_PORT,
        config.REDIS_TABLE_MONITOR_USER)
    redis_monitor_user.open()
    redis_monitor_log = RedisMonitor(webapp.logger,
        config.REDIS_HOST,
        config.REDIS_PORT,
        config.REDIS_TABLE_MONITOR_LOG)
    redis_monitor_log.open()


    webapp.redis_monitor_user = redis_monitor_user
    webapp.redis_monitor_log = redis_monitor_log