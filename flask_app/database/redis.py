import redis


class Redis(object):
    def __init__(self, logger, host, port, name=''):
        self.logger = logger
        self.host = host
        self.port = port
        self.name = name
        self.db = None
        self.open()

    def open(self, name=''):
        if name != '':
            self.name = name
        self.db = redis.Redis(host=self.host, port=self.port)

    def get(self, key):
        return self.db.get(key)

    def hget(self, key):
        return self.db.hget(self.name, key)

    def _hget(self, name, key):
        return self.db.hget(name, key)

    def set(self, key, value):
        self.db.set(key, value)
    
    def hset(self, key, value):
        self.db.hset(self.name, key, value)
        
    def _hset(self, name, key, value):
        self.db.hset(name, key, value)
