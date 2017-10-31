#!/usr/bin/python3

#coding:utf-8
import pymysql

if __name__ == '__main__':
    
    username = input("username to create: ")
    password = input("password: ")
    db = pymysql.connect(host = 'localhost', 
                    port = 3306, 
                    db = 'course_design', 
                    user = 'root', passwd = 'hhjcyhhy',
                    use_unicode=True, 
                    charset="utf8"
                    )

    cursor = db.cursor()

    create_user_sql = '''insert ignore into users (
        username, password
        ) values ('%s', '%s') on duplicate key update username=%s''' % (username, password, password)

    cursor.execute(create_user_sql)
    db.commit()
    cursor.close()
    db.close()
