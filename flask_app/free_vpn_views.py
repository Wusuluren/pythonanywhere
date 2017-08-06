#!/user/bin/env python
from flask import render_template
from flask_app import app
import requests
from bs4 import BeautifulSoup as bs
import re

def get_vpn():
    cookies = {}
    headers = {
        "Referer":"http://www.wykxsw.com/share.html"
    }
    resp = requests.get('http://www.wykxsw.com/goto/share/free.php',  headers=headers, cookies=cookies, allow_redirects=False)
    soup = bs(resp.text, 'html.parser')
    raw = str(soup.select('p'))
    ipaddr = re.findall('服务器：([0-9.]+)<br/>', raw)
    username = re.findall('用户：([a-zA-Z0-9]+)<br/>', raw)
    passwd = re.findall('密码：([a-zA-Z0-9]+)<br/>', raw)
    return zip(ipaddr, username, passwd)

@app.route('/free_vpn', methods=['GET'])
def free_vpn():
    accounts = get_vpn()
    return render_template('free_vpn/index.html', accounts=accounts)