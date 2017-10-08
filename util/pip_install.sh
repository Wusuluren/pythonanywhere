#!/usr/bin/env bash

pip_cmd='pip'
test -n $(which pip3) && pip_cmd='pip3'

${pip_cmd} install flask
${pip_cmd} install flask-wtrf
${pip_cmd} install flask-WTF
${pip_cmd} install flask-jinja2
${pip_cmd} install flask-jinja
${pip_cmd} install WTForms
${pip_cmd} install pymysql
#${pip_cmd} install cssselect
#${pip_cmd} install lxml
${pip_cmd} install requests
${pip_cmd} install beautifulsoup4
${pip_cmd} install redis
