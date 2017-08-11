#!/usr/bin/virtualenv python
import os

CSRF_ENABLED = True
CSRF_SECRET_KEY = 'pythonanywhere'

env = os.getenv('PYTHONANYWHERE','')
if env == 'test':
    MYSQL_USERNAME='root'
    MYSQL_HOST='localhost'
    MYSQL_PASSWD='toor'
else:
    MYSQL_USERNAME='post'
    MYSQL_HOST='post.mysql.pythonanywhere-services.com'
    MYSQL_PASSWD='postiskirara'
MYSQL_DB_MONITOR='post$monitor'
MYSQL_TABLE_MONITOR_USER='user'
MYSQL_TABLE_MONITOR_LOG='log'

REDIS_HOST='localhost'
REDIS_PORT=6379
REDIS_TABLE_MONITOR_USER='monitor_user'
REDIS_TABLE_MONITOR_LOG='monitor_log'

SQLITE_DB_BLOG='blog'
SQLITE_TABLE_ARTICLE='article'

LOG_DEBUG = 0
LOG_INFO=1
LOG_WARN=2
LOG_ERROR=3
LOG_FATAL=4
