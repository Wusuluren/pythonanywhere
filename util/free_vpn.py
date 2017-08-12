#!/usr/bin/env python3

import re
from urllib import request
import os
import sys

def vpn_on(host):
    headers = {"Referer":"http://www.wykxsw.com/share.html"}
    req=request.Request('http://www.wykxsw.com/goto/share/free.php', headers=headers, method='GET')
    page=request.urlopen(req).read().decode('utf-8')
    ipaddr = re.findall('服务器：([0-9.]+)<br>', page)
    username = re.findall('用户：([a-zA-Z0-9]+)<br>', page)
    passwd = re.findall('密码：([a-zA-Z0-9]+)<br>', page)
    print(ipaddr, username, passwd)
    index = 0
    if host == 'A':
        index = 0
    elif host == 'B':
        index = 1
    os.system('echo postiskirara | sudo -S pptpsetup --create testvpn --server %s --username %s --password %s --encrypt --start' % (ipaddr[index], username[index], passwd[index]))
    os.system('echo postiskirara | sudo -S route add default gw 10.0.100.2')

def vpn_off():
    os.system('pon testvpn')
    os.system('echo postiskirara | sudo -S poff')

def main():
    if len(sys.argv) < 2:
        return 
    operation = sys.argv[1]
    if operation == 'on':
        host = 'A'
        if len(sys.argv) >= 3:
            host = sys.argv[2]
        vpn_on(host)
    elif operation == 'off':
        vpn_off()

if __name__ == '__main__':
    main()
