#!/usr/bin/virtualenv python
import redis
import logging

class Redis(object):
    def __init__(self, logger, host, port, name=''):
        self.logger = logger or logging.getLogger()
        self.host = host
        self.port = port
        self.name = name

    def open(self, name=''):
        if name != '':
            self.name = name
        if self.name == '':
            return False
        self.redis = redis.Redis(host=self.host, port=self.port)
        return True

    def get(self, key):
        return self.redis.get(key)

    def hget(self, key):
        return self.redis.hget(self.name, key)

    def _hget(self, name, key):
        return self.redis.hget(name, key)

    def set(self, key, value):
        self.redis.set(key, value)
    
    def hset(self, key, value):
        self.redis.hset(self.name, key, value)
        
    def _hset(self, name, key, value):
        self.redis.hset(name, key, value)
