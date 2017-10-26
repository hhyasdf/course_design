#!/usr/bin/python

from flask import Flask
from flask import render_template
from flask import request

app = Flask(__name__)
app.debug = True

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
    return app.send_static_file('login.html')

@app.route('/calculator_params.html', methods=['POST'])
def login():
    print("login")
    print(request.form["Username"])
    print(request.form["Password"])

    return app.send_static_file('calculator_params.html')

@app.route('/calculator_device.html')
def device():
    return app.send_static_file('calculator_device.html')

@app.route('/calculator_results.html')
def results():
    return app.send_static_file('alculator_results.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0')




