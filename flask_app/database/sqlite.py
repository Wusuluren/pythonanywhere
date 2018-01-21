import sqlite3


class Sqlite(object):
    def __init__(self, logger, dbname):
        self.logger = logger
        self.dbname = dbname
        self.conn = None
        self.cursor = None

    def open(self):
        self.conn = sqlite3.connect(self.dbname, check_same_thread=False)
        self.cursor = self.conn.cursor()

    def exists(self, new_table):
        tables = self.conn.execute("select name from sqlite_master where name='%s'" % new_table )
        for table in tables:
            if len(table) > 0 and table[0] == new_table:
                return True
        return False

    def execute(self, sql):
        self.logger.debug(sql)
        self.cursor.execute(sql)
        self.conn.commit()

    def query(self, sql):
        results = ()
        try:
            self.logger.debug(sql)
            self.cursor.execute(sql)
            results = self.cursor.fetchall()
        except Exception as e:
            self.logger.error('query error: %s' % str(e))
        return results

    def insert(self, sql):
        try:
            self.logger.debug(sql)
            self.cursor.execute(sql)
            self.conn.commit()
            return True
        except Exception as e:
            self.conn.rollback()
            self.logger.error('insert error: %s' % str(e))
            return False

    def close(self):
        self.conn.close()
