#!/usr/bin/python

#coding:utf-8

from flask import Flask, Blueprint
from flask import render_template
from flask import request
from flask import send_file
from datetime import timedelta
import pymysql
import xlwt

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


@app.route('/results.html', methods = ['POST'])
@login_required
@fresh_login_required
def results():

    workconditon = int(request.form["work_condition"])
    device_list = request.form["device_select"]
    engine_list = request.form["engine_list"]
    k01 = float(request.form["k01"])
    k02 = float(request.form["k02"])
    # for item in device_list:
    #     print(item)
    # print(device_list)
    # print(request.form)
    device_name_list = []
    device_info = []

    last_po = 0
    for po in range(len(device_list)):
        if(device_list[po] == ','):
            device_name_list.append(device_list[last_po: po])
            last_po = po + 1

        elif(po == (len(device_list) - 1)):
            device_name_list.append(device_list[last_po: po + 1])

    engine_info = {}

    # print(engine_list)

    last_po = 0
    for po in range(len(engine_list)):
        if(engine_list[po] == ','):
            engine_item_info = (engine_list[last_po: po])
            # print(engine_item_info)
            for i in range(len(engine_item_info)):
                if(engine_item_info[i] == '&'):
                    value = int(engine_item_info[0: i])
                    key = float(engine_item_info[i+1: len(engine_item_info)])
                    # print(value)
                    # print(key)
                    if(key in engine_info):
                        engine_info[key] += value
                        break
                    else:
                        engine_info[key] = value
                        break
            last_po = po + 1

        elif(po == (len(engine_list) - 1)):
            engine_item_info = (engine_list[last_po: po + 1])
            for i in range(len(engine_item_info)):
                if(engine_item_info[i] == '&'):
                    value = int(engine_item_info[0: i])
                    key = float(engine_item_info[i+1: len(engine_item_info)])
                    # print(value)
                    # print(key)
                    if(key in engine_info):
                        engine_info[key] += value
                        break
                    else:
                        # print(key)
                        engine_info[key] = value
                        break
            
    # print(engine_info)            

    I_total_workcondition1 = 0.0
    I_total_workcondition2 = 0.0
    I_total_workcondition3 = 0.0
    I_total_workcondition4 = 0.0
    II_total_workcondition1 = 0.0
    II_total_workcondition2 = 0.0
    II_total_workcondition3 = 0.0
    II_total_workcondition4 = 0.0
    III_total_workcondition1 = 0.0
    III_total_workcondition2 = 0.0
    III_total_workcondition3 = 0.0
    III_total_workcondition4 = 0.0

    need_total = 0.0

    need_engine_num_workcondition1 = 0
    need_engine_num_workcondition2 = 0
    need_engine_num_workcondition3 = 0
    need_engine_num_workcondition4 = 0
    
    backup_engine_num_workcondition1 = 0
    backup_engine_num_workcondition2 = 0
    backup_engine_num_workcondition3 = 0
    backup_engine_num_workcondition4 = 0

    engine_eff_workcondition1 = 0.0
    engine_eff_workcondition2 = 0.0
    engine_eff_workcondition3 = 0.0
    engine_eff_workcondition4 = 0.0

    # print(device_name_list)
    cursor = db.cursor()    
    for name in device_name_list:

        cursor.execute("select * from %s where 用电设备名称='%s'" % (current_user.username, name))
        device_info_item = list(cursor.fetchone())

        if(device_info_item[4] != 0):
            device_info_item.insert(5, float(device_info_item[3]) / float(device_info_item[4])) # 电动机额定所需功率
        else:
            device_info_item.insert(5, 0)
        device_info_item.insert(6, float(device_info_item[1]) * float(device_info_item[5])) # 所需总功率,
        device_info_item.insert(11, float(device_info_item[6]) * float(device_info_item[10]) * float(device_info_item[9]))
        device_info_item.insert(16, float(device_info_item[6]) * float(device_info_item[15]) * float(device_info_item[14]))
        device_info_item.insert(21, float(device_info_item[6]) * float(device_info_item[20]) * float(device_info_item[19]))
        device_info_item.insert(26, float(device_info_item[6]) * float(device_info_item[25]) * float(device_info_item[24]))

        need_total += device_info_item[6]

        if(device_info_item[12] != 'NULL'):

            if(device_info_item[12] == 'Ⅰ'):
                I_total_workcondition1 += device_info_item[11]
            elif(device_info_item[12] == 'Ⅱ'):
                II_total_workcondition1 += device_info_item[11]
            elif(device_info_item[12] == 'Ⅲ'):
                III_total_workcondition1 += device_info_item[11]
                
        if(device_info_item[17] != 'NULL'):

            if(device_info_item[17] == 'Ⅰ'):
                I_total_workcondition2 += device_info_item[16]
            elif(device_info_item[17] == 'Ⅱ'):
                II_total_workcondition2 += device_info_item[16]
            elif(device_info_item[17] == 'Ⅲ'):
                III_total_workcondition2 += device_info_item[16]

        if(device_info_item[22] != 'NULL'):

            if(device_info_item[22] == 'Ⅰ'):
                I_total_workcondition3 += device_info_item[21]
            elif(device_info_item[22] == 'Ⅱ'):
                II_total_workcondition3 += device_info_item[21]
            elif(device_info_item[22] == 'Ⅲ'):
                III_total_workcondition3 += device_info_item[21]

        if(device_info_item[27] != 'NULL'):

            if(device_info_item[27] == 'Ⅰ'):
                I_total_workcondition4 += device_info_item[26]
            elif(device_info_item[27] == 'Ⅱ'):
                II_total_workcondition4 += device_info_item[26]
            elif(device_info_item[27] == 'Ⅲ'):
                III_total_workcondition4 += device_info_item[26]

        device_info.append(device_info_item)
        # print(device_info_item)
            
    return render_template('results.html', 
                            username = current_user.username, 
                            start_workcondition = workconditon,
                            I_total_workcondition1 = I_total_workcondition1,
                            II_total_workcondition1 = II_total_workcondition1,
                            III_total_workcondition1 = III_total_workcondition1,
                            I_total_workcondition2 = I_total_workcondition2,
                            II_total_workcondition2 = II_total_workcondition2,
                            III_total_workcondition2 = III_total_workcondition2,
                            I_total_workcondition3 = I_total_workcondition3,
                            II_total_workcondition3 = II_total_workcondition3,
                            III_total_workcondition3 = III_total_workcondition3,
                            I_total_workcondition4 = I_total_workcondition4,
                            II_total_workcondition4 = II_total_workcondition4,
                            III_total_workcondition4 = III_total_workcondition4,
                            k01 = k01,
                            k02 = k02,
                            need_total = need_total,

                            )


@app.route('/change_db', methods=['POST'])
@login_required
@fresh_login_required
def change_db():
    cursor = db.cursor()
    if(request.form["action"] == "delete"):
        sql = "delete ignore from %s where 用电设备名称 = '%s'" % (current_user.username, request.form["device_name"])
        cursor.execute(sql)
        db.commit()
        cursor.close()
    elif(request.form["action"] == "save"):
        # print(request.form)
        # print(request.form["old_device_name"])
        cursor.execute("delete ignore from %s where 用电设备名称 = '%s'" % (current_user.username, request.form["old_device_name"]))

        sql = '''insert into %s (
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
    app.run(host='0.0.0.0', threaded = True)



