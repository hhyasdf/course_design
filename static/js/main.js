var engine_num = 1;
var work_condition = 1; // 记录工况的全局变量
var device_select = []; // 记录选择的设备

document.getElementById("add_engine").addEventListener("click", function(){
    engine_num = engine_num + 1;
    var engine_row = document.getElementById("engine-row");
    var target = document.getElementById("engine1");
    var clone_node = target.cloneNode(true);
    clone_node.id='engine' + engine_num;
    engine_row.appendChild(clone_node);
})

document.getElementById("minus_engine").addEventListener("click", function(){
    if(engine_num == 1) return;
    var engine_row = document.getElementById("engine-row");
    var target = document.getElementById("engine" + engine_num);
    engine_num = engine_num - 1;
    engine_row.removeChild(target);
})

params_page = document.getElementById("params_page")
device_page = document.getElementById("device_page")
// results_page = document.getElementById("results_page")

device_container = document.getElementById("device_container");
params_container = document.getElementById("params_container");
// results_container = document.getElementById("results_container");

work_condition1 = document.getElementById("work_condition1");
work_condition2 = document.getElementById("work_condition2");
work_condition3 = document.getElementById("work_condition3");
work_condition4 = document.getElementById("work_condition4");

work_condition1_choose = document.getElementById("work_condition1_choose");
work_condition2_choose = document.getElementById("work_condition2_choose");
work_condition3_choose = document.getElementById("work_condition3_choose");
work_condition4_choose = document.getElementById("work_condition4_choose");

params_page.addEventListener("click", function(){
    params_page.setAttribute("class", "active");
    params_container.style.display = "block";
    device_page.setAttribute("class", "");
    device_container.style.display = "none";
    results_page.setAttribute("class", "");
    results_container.style.display = "none";
})

device_page.addEventListener("click", function(){
    params_page.setAttribute("class", "");
    params_container.style.display = "none"
    device_page.setAttribute("class", "active");
    device_container.style.display = "block";
    results_page.setAttribute("class", "");
    results_container.style.display = "none";
})

// results_page.addEventListener("click", function(){
//     params_page.setAttribute("class", "");
//     params_container.style.display = "none"
//     device_page.setAttribute("class", "");
//     device_container.style.display = "none"
//     results_page.setAttribute("class", "active");
//     results_container.style.display = "block";
// })

work_condition1.addEventListener("click", function(){
    work_condition = 1;
    work_condition1_choose.style.display = "";
    work_condition2_choose.style.display = "none";
    work_condition3_choose.style.display = "none";
    work_condition4_choose.style.display = "none";
})

work_condition2.addEventListener("click", function(){
    work_condition = 2;
    work_condition1_choose.style.display = "none";
    work_condition2_choose.style.display = "";
    work_condition3_choose.style.display = "none";
    work_condition4_choose.style.display = "none";
})

work_condition3.addEventListener("click", function(){
    work_condition = 3;
    work_condition1_choose.style.display = "none";
    work_condition2_choose.style.display = "none";
    work_condition3_choose.style.display = "";
    work_condition4_choose.style.display = "none";
})

work_condition4.addEventListener("click", function(){
    work_condition = 4;
    work_condition1_choose.style.display = "none";
    work_condition2_choose.style.display = "none";
    work_condition3_choose.style.display = "none";
    work_condition4_choose.style.display = "";
})


var all_add_cal_device = document.getElementsByClassName("device-add-cal-button");
var all_save_device = document.getElementsByClassName("device-save-button");
var all_delete_device = document.getElementsByClassName("device-delete-button");


function sendPost(url, data) {      // data为kv对象
    sender = new XMLHttpRequest();
    sender.open('post', url);
    sender.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    sender.send(data);
    // if (sender.readyState == 4 || sender.status != 200) {
    //     console.err("send post error");
    // }
    // alert(sender.responseText);
}


//加入计算按钮
for (var i=0; i<all_add_cal_device.length; i++) {
    all_add_cal_device[i].addEventListener("click", function(e){
        var target = e.target;
        device_cal_button = document.getElementById(target.id + "_button");
        if(target.className.indexOf("add_cal") > 0){
            device_select.push(target.id);
            target.classList.remove("add_cal");
            target.classList.add("rm_cal");
            target.classList.remove("btn-success");
            target.classList.add("btn-warning");
            target.innerHTML = "取消选中";
            device_cal_button.classList.remove("btn-default");
            device_cal_button.classList.add("btn-success");
        }
        else{
            for(var i=0; i<device_select.length; i++) {
                if(device_select[i] == target.id) {
                  device_select.splice(i, 1);
                  break;
                }
            }
            target.classList.remove("rm_cal");
            target.classList.add("add_cal");
            target.classList.remove("btn-warning");
            target.classList.add("btn-success");
            target.innerHTML = "加入计算";
            device_cal_button.classList.remove("btn-success");
            device_cal_button.classList.add("btn-default");
        }
    })
}


function find(str,cha,num){
    var counter = 0;
    for(var i = 0; i < str.length ; i++){
        if(str[i] == cha) {
            counter ++;
        }
        if(counter == num) {
            return i;
        }
    }
}


//保存设备按钮
for (var i=0; i<all_save_device.length; i++) {
    all_save_device[i].addEventListener("click", function(e){
        var target = e.target;
        po = find(target.id, '_', 2);
        var target_name = target.id.slice(0, po);
        device_name = document.getElementById(target_name + "_用电设备名称").value;
        document.getElementById(target_name + "_cal_button").innerHTML = device_name;
        
        param1 = document.getElementById(target_name + "_数量").value;
        if(param1 == '' || param1 == null) param1 = 0;
        param2 = document.getElementById(target_name + "_最大机械轴功率").value;
        if(param2 == '' || param2 == null) param2 = 0;
        param3 = document.getElementById(target_name + "_电动机额定功率").value;
        if(param3 == '' || param3 == null) param3 = 0;
        param4 = document.getElementById(target_name + "_电动机额定效率").value;
        if(param4 == '' || param4 == null) param4 = 0;
        param5 = document.getElementById(target_name + "_电动机利用系数").value;
        if(param5 == '' || param5 == null) param5 = 0;
        param6 = document.getElementById(target_name + "_航行状态机械负荷系数").value;
        if(param6 == '' || param6 == null) param6 = 0;
        param7 = document.getElementById(target_name + "_航行状态电动机负荷系数").value;
        if(param7 == '' || param7 == null) param7 = 0;
        param8 = document.getElementById(target_name + "_航行状态同时使用系数").value;
        if(param8 == '' || param8 == null) param8 = 0;
        param9 = document.getElementById(target_name + "_航行状态负荷类别").value;
        if(param9 == '' || param9 == null) param9 = 'NULL';
        param10 = document.getElementById(target_name + "_进出港状态机械负荷系数").value;
        if(param10 == '' || param10 == null) param10 = 0;
        param11 = document.getElementById(target_name + "_进出港状态电动机负荷系数").value;
        if(param11 == '' || param11 == null) param11 = 0;
        param12 = document.getElementById(target_name + "_进出港状态同时使用系数").value;
        if(param12 == '' || param12 == null) param12 = 0;
        param13 = document.getElementById(target_name + "_进出港状态负荷类别").value;
        if(param13 == '' || param13 == null) param13 = 'NULL';
        param14 = document.getElementById(target_name + "_作业状态机械负荷系数").value;
        if(param14 == '' || param14 == null) param14 = 0;
        param15 = document.getElementById(target_name + "_作业状态电动机负荷系数").value;
        if(param15 == '' || param15 == null) param15 = 0;
        param16 = document.getElementById(target_name + "_作业状态同时使用系数").value;
        if(param16 == '' || param16 == null) param16 = 0;
        param17 = document.getElementById(target_name + "_作业状态负荷类别").value;
        if(param17 == '' || param17 == null) param17 = 'NULL';
        param18 = document.getElementById(target_name + "_停泊状态机械负荷系数").value;
        if(param18 == '' || param18 == null) param18 = 0;
        param19 = document.getElementById(target_name + "_停泊状态电动机负荷系数").value;
        if(param19 == '' || param19 == null) param19 = 0;
        param20 = document.getElementById(target_name + "_停泊状态同时使用系数").value;
        if(param20 == '' || param20 == null) param20 = 0;
        param21 = document.getElementById(target_name + "_停泊状态负荷类别").value;
        if(param21 == '' || param21 == null) param21 = 'NULL';



        sendPost("/change_db", "action=save&device_name=" + device_name + 
                                 "&param1=" + param1 +
                                 "&param2=" + param2 +
                                 "&param3=" + param3 +
                                 "&param4=" + param4 +
                                 "&param5=" + param5 +
                                 "&param6=" + param6 +
                                 "&param7=" + param7 +
                                 "&param8=" + param8 +
                                 "&param9=" + param9 +
                                 "&param10=" + param10 +
                                 "&param11=" + param11 +
                                 "&param12=" + param12 +
                                 "&param13=" + param13 +
                                 "&param14=" + param14 +
                                 "&param15=" + param15 +
                                 "&param16=" + param16 +
                                 "&param17=" + param17 +
                                 "&param18=" + param18 +
                                 "&param19=" + param19 +
                                 "&param20=" + param20 +
                                 "&param21=" + param21
        )
    })
}

//删除设备按钮
device_list = document.getElementById("device_list");

for (var i=0; i<all_delete_device.length; i++) {
    all_delete_device[i].addEventListener("click", function(e){
        var target = e.target;
        // console.log(target.id);
        device_cal_button = document.getElementById(target.id + "_button");
        device_list.removeChild(device_cal_button);

        po = target.id.indexOf('_');
        // alert(target.id.slice(0, po));
        sendPost("/change_db", "action=delete&device_name=" + target.id.slice(0, po));
    })
}

// sendPost("/main.html", "Username=guest&Password=asdfasdf");