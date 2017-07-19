#!venv/bin/python3
from flask_wtf import Form
from wtforms import TextField, IntegerField, SelectField, DateField, SubmitField
from wtforms.validators import Required

class LoginForm(Form):
    username = TextField('username', validators=[Required()])
    password = TextField('password', validators=[Required()])
    age = IntegerField('age', validators=[Required()])
    gender = SelectField('gender', validators=[Required()])
    birthday = DateField('birthday', validators=[Required()])
    submit = SubmitField('submit')