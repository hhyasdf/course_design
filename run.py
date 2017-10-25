#!/usr/bin/python

from flask import Flask
from flask import render_template
from flask import request

app = Flask(__name__)
app.debug = True

@app.route('/', methods=['POST', 'GET'])
# def index(name=None):
#     print("asdfasdfa")
#     if(request.method == "POST"):
#         print("get a post")
#         print(request.form["Username"])
#         print(request.form["Password"])
#         return "hello"
#     if(request.method == "GET"):
#         print("get a GET")
#     return app.send_static_file('login.html')

@app.route('/calculator.html', methods=['POST'])
def login():
    print("login")
    return "adsfasdfasdfasd"

if __name__ == '__main__':
    app.run(host='0.0.0.0')




