#!/usr/bin/virtualenv python
import os

CSRF_ENABLED = True
CSRF_SECRET_KEY = 'pythonanywhere'

env = os.getenv('PYTHONANYWHERE','')
if env == 'test':
    MYSQL_USERNAME='root'
    MYSQL_HOST='localhost'
    MYSQL_PASSWD='toor'

    BILIBILI_FILE_DIR='./flask_app'
else:
    MYSQL_USERNAME='post'
    MYSQL_HOST='post.mysql.pythonanywhere-services.com'
    MYSQL_PASSWD='postiskirara'

    BILIBILI_FILE_DIR='/home/post/mysite/flask_app'

MYSQL_DB_MONITOR='post$monitor'
MYSQL_TABLE_MONITOR_USER='user'
MYSQL_TABLE_MONITOR_LOG='log'

REDIS_HOST='localhost'
REDIS_PORT=6379
REDIS_TABLE_MONITOR_USER='monitor_user'
REDIS_TABLE_MONITOR_LOG='monitor_log'

SQLITE_DB='sqlite'
SQLITE_TABLE_ARTICLE='blog_article'
SQLITE_TABLE_DOWNLOAD='bilibili_download'
