import pymysql
import logging

class User(object):
    def __init__(slef, name, passwd):
        self.name = name
        self.passwd = passwd

class MysqlUser(object):
    def __init__(self, logger, host, user, passwd, dbname):
        self.host = host
        self.user = user
        self.passwd = passwd
        self.dbname = dbname
        self.logger = logger or logging.getLogger()

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
        except:
            self.logger.error('query error')
        return results

    def insert(self, sql):
        try:
            self.logger.debug(sql)
            self.cursor.execute(sql)
            self.db.commit()
            return True
        except:
            self.db.rollback()
            self.logger.error('insert error')
            return False

    def close(self):
        self.db.close()
