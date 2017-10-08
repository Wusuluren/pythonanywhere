#!/usr/bin/virtualenv python

import requests
from bs4 import BeautifulSoup as bs
from flask import render_template
from flask_app import app

@app.route('/github_records', methods=["GET"])
def github_records():
    resp = requests.get('https://github.com/Wusuluren/punch_in/blob/master/records.md')
    soup = bs(resp.text, 'html.parser')
    records = soup.find(id='readme')
    return render_template('github_records/index.html', records=records)