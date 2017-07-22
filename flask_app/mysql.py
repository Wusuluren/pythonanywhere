#!/usr/bin/virtualenv python
import pymysql
import logging

class Mysql(object):
    def __init__(self, logger, host, user, passwd, dbname):
        self.logger = logger or logging.getLogger()
        self.host = host
        self.user = user
        self.passwd = passwd
        self.dbname = dbname

    def open(self):
        self.db = pymysql.connect(self.host, self.user, self.passwd, self.dbname)
        self.cursor = self.db.cursor()

    def execute(self, sql):
        self.logger.debug(sql)
        self.cursor.execute(sql)

    def change_db(self, dbname):
        self.dbname = dbname
        self.cursor.execute('use %s' % self.dbname)

    def query(self, sql):
        results = ()
        try:
            self.logger.debug(sql)
            self.cursor.execute(sql)
            results = self.cursor.fetchall()
        except Exception as e:
            self.logger.error('query error:', e)
        return results

    def insert(self, sql):
        try:
            self.logger.debug(sql)
            self.cursor.execute(sql)
            self.db.commit()
            return True
        except Exception as e:
            self.db.rollback()
            self.logger.error('insert error:', e)
            return False

    def close(self):
        self.db.close()
