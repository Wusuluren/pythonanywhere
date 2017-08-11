#!/usr/bin/virtualenv python
import sqlite3
import logging

class Sqlite(object):
    def __init__(self, logger, dbname):
        self.logger = logger or logging.getLogger()
        self.dbname = dbname

    def open(self):
        self.conn = sqlite3.connect(self.dbname, check_same_thread=False)

    def exists(self, new_table):
        tables = self.conn.execute("select name from sqlite_master where name='%s'" % new_table )
        for table in tables:
            if len(table) > 0 and table[0] == new_table:
                return True
        return False

    def execute(self, sql):
        self.logger.debug(sql)
        self.conn.execute(sql)
        self.conn.commit()

    def query(self, sql):
        results = ()
        try:
            self.logger.debug(sql)
            self.conn.execute(sql)
            results = self.conn.fetchall()
        except Exception as e:
            self.logger.error('query error:', e)
        return results

    def insert(self, sql):
        try:
            self.logger.debug(sql)
            self.conn.execute(sql)
            self.conn.commit()
            return True
        except Exception as e:
            self.conn.rollback()
            self.logger.error('insert error:', e)
            return False

    def close(self):
        self.conn.close()
