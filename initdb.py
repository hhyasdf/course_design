#!/usr/bin/python3

#coding:utf-8
import pymysql
import xlrd

if __name__ == '__main__':
    
    mysqlusername = input("mysql username: ")
    mysqlpassword = input("mysql password: ")
    dbname = input("database name: ")
    username = input("the table you want to create (username of the user who use this table): ")
    db = pymysql.connect(host = 'localhost', 
                    port = 3306, 
                    db = dbname, 
                    user = mysqlusername, passwd = mysqlpassword,
                    use_unicode=True, 
                    charset="utf8"
                    )
    data = xlrd.open_workbook('doc/init_data.xlsx')
    data_sheet = data.sheet_by_index(0)

    nrows = data_sheet.nrows
    ncols = data_sheet.ncols

    control = db.cursor();

        # 电动机额定所需功率 float(20,3) DEFAULT NULL,
        # 所需总功率 float(20,3) DEFAULT NULL,
        # 航行状态所需有功功率 float(20,3) DEFAULT NULL,
        # 进出港状态所需有功功率 float(20,3) DEFAULT NULL,
        # 作业状态所需有功功率 float(20,3) DEFAULT NULL,
        # 停泊状态所需有功功率 float(20,3) DEFAULT NULL,

    create_users_table = '''create table if not exists users(
        username varchar(40) not null,
        password varchar(100) not null,
        unique (username)
    )'''

    create_table_sql = '''create table if not exists %s (
        用电设备名称 varchar(40) NOT NULL,
        数量 int UNSIGNED NOT NULL,
        最大机械轴功率 float(20,3) NOT NULL,
        电动机额定功率 float(20,3) NOT NULL,
        电动机额定效率 float(3,2) NOT NULL,

        电动机利用系数 float(3,2) NOT NULL,
        航行状态机械负荷系数 float(3,2) NOT NULL,
        航行状态电动机负荷系数 float(3,2) NOT NULL,
        航行状态同时使用系数 float(3,2) NOT NULL,

        航行状态负荷类别 text NOT NULL,
        进出港状态机械负荷系数 float(3,2) NOT NULL,
        进出港状态电动机负荷系数 float(3,2) NOT NULL,
        进出港状态同时使用系数 float(3,2) NOT NULL,

        进出港状态负荷类别 text NOT NULL,
        作业状态机械负荷系数 float(3,2) NOT NULL,
        作业状态电动机负荷系数 float(3,2) NOT NULL,
        作业状态同时使用系数 float(3,2) NOT NULL,

        作业状态负荷类别 text NOT NULL,
        停泊状态机械负荷系数 float(3,2) NOT NULL,
        停泊状态电动机负荷系数 float(3,2) NOT NULL,
        停泊状态同时使用系数 float(3,2) NOT NULL,

        停泊状态负荷类别 text NOT NULL,
        UNIQUE (用电设备名称)
    ) character set = utf8;''' % (username)

    control.execute(create_users_table)
    control.execute(create_table_sql)


            # 电动机额定所需功率,
            # 所需总功率,
            # 航行状态所需有功功率,
            # 进出港状态所需有功功率,
            # 作业状态所需有功功率,
            # 停泊状态所需有功功率,



    for i in range(nrows):
        if(i != 0):
            # print(data_sheet.row_values(i))
            device_info = data_sheet.row_values(i)
            device_info.insert(0, username)
            sql = '''insert into %s(
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
            values("%s",%d,%f,%f,%f,%f,%f,%f,%f,"%s",%f,%f,%f,"%s",%f,%f,%f,"%s",%f,%f,%f,"%s");''' % tuple(device_info)

            control.execute(sql)

    db.commit()
    control.close()
    db.close()
