from flask import render_template
from flask_app import app
from flask_app.forms import LoginForm

@app.route('/chat_room_login', methods=["GET", "POST"])
def chat_room_login():
    form = LoginForm()
    if form.validate_on_submit():
        print('hehe')
        # flash('hehe')
        # return redirect('index.html')
    return render_template('chat_room/login.html', form=form)
