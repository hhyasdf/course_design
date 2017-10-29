#!/usr/bin/python

#coding:utf-8

from flask import Flask, Blueprint
from flask import render_template
from flask import request
from flask import send_file
from datetime import timedelta
import pymysql

from flask_login import (LoginManager, login_required, login_user,
                             logout_user, UserMixin, fresh_login_required, current_user)

db = pymysql.connect(host = 'localhost', 
                    port = 3306, 
                    db = 'course_design', 
                    user = 'root', passwd = 'hhjcyhhy',
                    use_unicode=True, 
                    charset="utf8"
                    )

usr_list = []

class User(UserMixin):

    def __init__(self, username = '', password = ''):
        UserMixin.__init__(self)
        self.username = username
        self.password = password
        self.work_condition = 1
        self.id = hash(username)

    def check_password(self):
        cursor = db.cursor()
        sql = "select password from users where username = '%s'" % (self.username)
        cursor.execute(sql)
        tmp_psswd = cursor.fetchone()
        cursor.close()
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
        return self.id


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
    # print(user_id)
    for usr_item in usr_list:
        if(usr_item.id == user_id):
            return usr_item
    return None


@auth.route('/login', methods=['GET', 'POST'])
def login():
    logout_user()
    return app.send_static_file('login.html')


@app.route('/')
@login_required
# @fresh_login_required
def index(name=None):
    cursor = db.cursor()
    cursor.execute("select * from %s;" % (current_user.username))
    device_list = cursor.fetchall()
    # print(device_list)
    cursor.close()
    # print("asdfasdfa")
    # if(request.method == "POST"):
    #     print("get a post")
    #     print(request.form["Username"])
    #     print(request.form["Password"])
    #     return "hello"
    # if(request.method == "GET"):
    #     print("get a GET")
    # print("index")
    # return app.send_static_file('login.html')
    # print(current_user.__dict__)
    return render_template('main.html', device_list = device_list, username = current_user.username)


@app.route('/main.html', methods=['POST'])
def login_main():
    user = User(request.form["Username"], request.form["Password"])
    # print("login")
    # print(request.form["Username"])
    # print(request.form["Password"])
    if(user.check_password()):
        login_user(user)
        for item in usr_list:
            if item.id == current_user.id :
                usr_list.remove(item)
        usr_list.append(user)

        cursor = db.cursor()
        cursor.execute("select * from %s;" % user.username)
        device_list = cursor.fetchall()
        cursor.close()
        # print(device_list)
        return render_template('main.html', device_list = device_list, username = request.form["Username"]  )
    else:
        return "username is not exist or wrong password"


@auth.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
    for item in usr_list:
        if item.id == current_user.id :
            usr_list.remove(item)

    logout_user()
    return "logout page"


# @app.route('/static/main.html')
# @login_required
# @fresh_login_required
# def mainpage():
#     cursor = db.cursor()
#     cursor.execute("select * from device;")
#     device_list = cursor.fetchall()
#     # print(device_list)
#     return render_template('main.html', device_list = device_list)


@app.route('/main.html')
@login_required
@fresh_login_required
def mainpage_d():
    cursor = db.cursor()
    cursor.execute("select * from %s;" % (current_user.username))
    device_list = cursor.fetchall()
    # print(device_list)
    cursor.close()
    return render_template('main.html', device_list = device_list, username = current_user.username)


@app.route('/static/results.html', methods = ['POST'])
@login_required
@fresh_login_required
def results():

    return render_template('results.html')


@app.route('/change_db', methods=['POST'])
@login_required
@fresh_login_required
def change_db():
    cursor = db.cursor()
    if(request.form["action"] == "delete"):
        sql = "delete from %s where 用电设备名称 = '%s'" % (current_user.username, request.form["device_name"])
        cursor.execute(sql)
        db.commit()
        cursor.close()
    elif(request.form["action"] == "save"):
        # print(request.form)
        sql = '''replace into %s (
            用电设备名称,
            数量, 
            最大机械轴功率,
            电动机额定功率,
            电动机额定效率,

            电动机利用系数,
            航行状态机械负荷系数,
            航行状态电动机负荷系数,
            航行状态同时使用系数,

            航行状态负荷类别,
            进出港状态机械负荷系数,
            进出港状态电动机负荷系数,
            进出港状态同时使用系数,

            进出港状态负荷类别,
            作业状态机械负荷系数,
            作业状态电动机负荷系数,
            作业状态同时使用系数,

            作业状态负荷类别,
            停泊状态机械负荷系数,
            停泊状态电动机负荷系数,
            停泊状态同时使用系数,

            停泊状态负荷类别)

            values("%s",%d,%f,%f,%f,%f,%f,%f,%f,"%s",%f,
            %f,%f,"%s",%f,%f,%f,"%s",%f,%f,%f,"%s");''' % (
                current_user.username,
                request.form["device_name"],
                int(request.form["param1"]),
                float(request.form["param2"]),
                float(request.form["param3"]),
                float(request.form["param4"]),
                float(request.form["param5"]),
                float(request.form["param6"]),
                float(request.form["param7"]),
                float(request.form["param8"]),
                request.form["param9"],
                float(request.form["param10"]),
                float(request.form["param11"]),
                float(request.form["param12"]),
                request.form["param13"],
                float(request.form["param14"]),
                float(request.form["param15"]),
                float(request.form["param16"]),
                request.form["param17"],
                float(request.form["param18"]),
                float(request.form["param19"]),
                float(request.form["param20"]),
                request.form["param21"]
            )
        cursor.execute(sql)
        db.commit()
        cursor.close()

    return 'a string'
    


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



