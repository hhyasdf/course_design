#!/usr/bin/python

#coding:utf-8

from flask import Flask, Blueprint
from flask import render_template
from flask import request
from flask import send_file
from datetime import timedelta

from flask_login import (LoginManager, login_required, login_user,
                             logout_user, UserMixin, fresh_login_required)

import pymysql

db = pymysql.connect(host = 'localhost', 
                    port = 3306, 
                    db = 'course_design', 
                    user = 'root', passwd = 'hhjcyhhy'
                    )


class User(UserMixin):

    def __init__(self, username = '', password = ''):
        UserMixin.__init__(self)
        self.username = username
        self.password = password
        self.work_condition = 1;

    def check_password(self):
        cursor = db.cursor()
        sql = "select password from users where username = '%s'" % (self.username)
        cursor.execute(sql)
        tmp_psswd = cursor.fetchone()
        if(tmp_psswd != None):
            real_passwd = tmp_psswd[0]
        else:
            real_passwd = None
        # print(real_passwd)
        # print(sql)
        if(self.password == real_passwd):
            return True
        else:
            return False

    def is_authenticated(self):
        return True
 
    def is_actice(self):
        return True
 
    def is_anonymous(self):
        return False
 
    def get_id(self):
        return "1"


app = Flask(__name__)
app.debug = True
app.secret_key = 's3cr3t'

auth = Blueprint('auth', __name__)

login_manager = LoginManager()
login_manager.session_protection = 'strong'
login_manager.login_view = 'auth.login'
login_manager.logout_view = 'auth.logout'
login_manager.init_app(app)
login_manager.remember_cookie_duration = timedelta(days=1)
login_manager.refresh_view = "auth.login"


@login_manager.user_loader
def load_user(user_id):
    user = User()
    return user


@auth.route('/login', methods=['GET', 'POST'])
def login():
    logout_user()
    return app.send_static_file('login.html')


@app.route('/')
def index(name=None):
    # print("asdfasdfa")
    # if(request.method == "POST"):
    #     print("get a post")
    #     print(request.form["Username"])
    #     print(request.form["Password"])
    #     return "hello"
    # if(request.method == "GET"):
    #     print("get a GET")
    print("index")
    return app.send_static_file('login.html')


@app.route('/login.html', methods=['POST'])
def login():
    user = User(request.form["Username"], request.form["Password"])
    login_user(user)
    if(user.check_password()):
    # print("login")
    # print(request.form["Username"])
    # print(request.form["Password"])
        return app.send_static_file('main.html')
    else:
        return "username is not exist or wrong password"


@auth.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
    logout_user()
    return "logout page"


@app.route('/static/main.html')
@login_required
@fresh_login_required
def params():
    return app.send_static_file('main.html')


@app.route('/init_data.xlsx')
@login_required
@fresh_login_required
def send():
    return send_file("doc/init_data.xlsx")

# @app.route('/static/calculator_device.html')
# @login_required
# @fresh_login_required
# def device():
#     print("device")
#     return app.send_static_file('calculator_device.html')


# @app.route('/static/calculator_results.html')
# @login_required
# @fresh_login_required
# def results():
#     return app.send_static_file('calculator_results.html')



if __name__ == '__main__':
    app.register_blueprint(auth, url_prefix='/auth')
    app.run(host='0.0.0.0')



