var engine_num = 1;
var work_condition = 1; // 记录工况的全局变量
var device_select = []; // 记录选择的设备
var username = document.getElementById("username").innerHTML
var created_new = false;
var created_account = 0;

document.getElementById("add_engine").addEventListener("click", function(){
    engine_num = engine_num + 1;
    var engine_row = document.getElementById("engine-row");
    var target = document.getElementById("engine1");
    var target_num = document.getElementById("engine1_num");
    var target_power = document.getElementById("engine1_power");

    var clone_node = target.cloneNode(true);

    target.id = "engine" + engine_num;
    target_num.id = "engine" + engine_num + "_num";
    target_power.id = "engine" + engine_num + "_power";
    
    engine_row.appendChild(clone_node);
})

document.getElementById("minus_engine").addEventListener("click", function(){
    if(engine_num == 1) return;
    var engine_row = document.getElementById("engine-row");
    var target = document.getElementById("engine" + engine_num);
    engine_num = engine_num - 1;
    engine_row.removeChild(target);
})

var params_page = document.getElementById("params_page")
var device_page = document.getElementById("device_page")
// results_page = document.getElementById("results_page")

var device_container = document.getElementById("device_container");
var params_container = document.getElementById("params_container");
// results_container = document.getElementById("results_container");

var work_condition1 = document.getElementById("work_condition1");
var work_condition2 = document.getElementById("work_condition2");
var work_condition3 = document.getElementById("work_condition3");
var work_condition4 = document.getElementById("work_condition4");

var work_condition1_choose = document.getElementById("work_condition1_choose");
var work_condition2_choose = document.getElementById("work_condition2_choose");
var work_condition3_choose = document.getElementById("work_condition3_choose");
var work_condition4_choose = document.getElementById("work_condition4_choose");

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
    var sender = new XMLHttpRequest();
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
        var device_cal_button = document.getElementById(target.id + "_button");
        target_name = document.getElementById(device_cal_button.id + "_content").innerHTML;
        if(target.className.indexOf("add_cal") > 0){
            for(var i=0; i<device_select.length; i++) {
                if(device_select[i] == target_name) {
                  device_select.splice(i, 1);
                  break;
                }
            }
            device_select.push(target_name);
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
                if(device_select[i] == target_name) {
                  device_select.splice(i, 1);
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
        var device_name = document.getElementById(target_name + "_用电设备名称").value;
        var old_device_name = document.getElementById(target_name + "_cal_button_content").innerHTML;
        
        if(old_device_name != device_name){
            for (var item in device_recorder) {
                // console.log(item);
                if(device_recorder[item] == device_name){
                    alert("不能保存与已有设备相同的设备名称！！！保存失败");
                    return 0;
                }
            }
            for(var i in device_recorder){
                if(device_recorder[i] == old_device_name){
                    device_recorder.splice(i, 1);
                    break
                }
            }
            device_recorder.push(device_name);
        }
        
        
        document.getElementById(target_name + "_cal_button_content").innerHTML = device_name;

        add_cal_button = document.getElementById(target_name + "_cal");

        if(add_cal_button.className.indexOf("add_cal") <= 0){
            for(var i=0; i<device_select.length; i++) {
                if(device_select[i] == old_device_name) {
                  device_select.splice(i, 1);
                  break;
                }
            }
            device_select.push(device_name);
        }
        
        var param1 = document.getElementById(target_name + "_数量").value;
        if(param1 == '' || param1 == null) param1 = 0;
        var param2 = document.getElementById(target_name + "_最大机械轴功率").value;
        if(param2 == '' || param2 == null) param2 = 0;
        var param3 = document.getElementById(target_name + "_电动机额定功率").value;
        if(param3 == '' || param3 == null) param3 = 0;
        var param4 = document.getElementById(target_name + "_电动机额定效率").value;
        if(param4 == '' || param4 == null) param4 = 1;
        var param5 = document.getElementById(target_name + "_电动机利用系数").value;
        if(param5 == '' || param5 == null) param5 = 1;
        var param6 = document.getElementById(target_name + "_航行状态机械负荷系数").value;
        if(param6 == '' || param6 == null) param6 = 1;
        var param7 = document.getElementById(target_name + "_航行状态电动机负荷系数").value;
        if(param7 == '' || param7 == null) param7 = 1;
        var param8 = document.getElementById(target_name + "_航行状态同时使用系数").value;
        if(param8 == '' || param8 == null) param8 = 1;
        var param9 = document.getElementById(target_name + "_航行状态负荷类别").value;
        if(param9 == '' || param9 == null) param9 = 'NULL';
        var param10 = document.getElementById(target_name + "_进出港状态机械负荷系数").value;
        if(param10 == '' || param10 == null) param10 = 1;
        var param11 = document.getElementById(target_name + "_进出港状态电动机负荷系数").value;
        if(param11 == '' || param11 == null) param11 = 1;
        var param12 = document.getElementById(target_name + "_进出港状态同时使用系数").value;
        if(param12 == '' || param12 == null) param12 = 1;
        var param13 = document.getElementById(target_name + "_进出港状态负荷类别").value;
        if(param13 == '' || param13 == null) param13 = 'NULL';
        var param14 = document.getElementById(target_name + "_作业状态机械负荷系数").value;
        if(param14 == '' || param14 == null) param14 = 1;
        var param15 = document.getElementById(target_name + "_作业状态电动机负荷系数").value;
        if(param15 == '' || param15 == null) param15 = 1;
        var param16 = document.getElementById(target_name + "_作业状态同时使用系数").value;
        if(param16 == '' || param16 == null) param16 = 1;
        var param17 = document.getElementById(target_name + "_作业状态负荷类别").value;
        if(param17 == '' || param17 == null) param17 = 'NULL';
        var param18 = document.getElementById(target_name + "_停泊状态机械负荷系数").value;
        if(param18 == '' || param18 == null) param18 = 1;
        var param19 = document.getElementById(target_name + "_停泊状态电动机负荷系数").value;
        if(param19 == '' || param19 == null) param19 = 1;
        var param20 = document.getElementById(target_name + "_停泊状态同时使用系数").value;
        if(param20 == '' || param20 == null) param20 = 1;
        var param21 = document.getElementById(target_name + "_停泊状态负荷类别").value;
        if(param21 == '' || param21 == null) param21 = 'NULL';



        sendPost("/change_db", "action=save&old_device_name=" + old_device_name + 
                                 "&device_name=" + device_name + 
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
var device_list = document.getElementById("device_list");

for (var i=0; i<all_delete_device.length; i++) {
    all_delete_device[i].addEventListener("click", function(e){
        var target = e.target;
        // console.log(target.id);
        var device_cal_button = document.getElementById(target.id + "_button");

        var po = find(target.id, '_', 2);
        var device_name = document.getElementById(target.id.slice(0, po) + "_cal_button_content").innerHTML;
        // alert(target.id.slice(0, po));
        sendPost("/change_db", "action=delete&device_name=" + device_name);
        
        for(var i=0; i<device_select.length; i++) {
            if(device_select[i] == device_name) {
              device_select.splice(i, 1);
            }
        }

        for (var i in device_recorder){
            if(device_recorder[i] == device_name){
                device_recorder.splice(i, 1);
                break;
            }
        }

        device_list.removeChild(device_cal_button);
    })
}

// sendPost("/main.html", "Username=guest&Password=asdfasdf");

function insertChar(str, cha, t_cha, num){
    var po = find(str, t_cha, num);
    var front = str.slice(0, po);
    var after = str.slice(po, str.length);
    return front + cha + after;
}



document.getElementById("create_a_device").addEventListener("click", function(e){
    if(created_new) return null; 
    created_account ++;
    created_new = true;
    e.target.disabled = "disabled";
    var old_button = document.getElementById("created_new_delete_button");
    var old_modal= document.getElementById("created_new_modal");
    var old_button_in = document.getElementById("created_new_cal_button");
    var old_button_in_p = document.getElementById("created_new_cal_button_content");

    var clone_button = old_button.cloneNode(true);
    var clone_modal = old_modal.cloneNode(true);

    old_button.style.display = '';
    old_button.id = insertChar(old_button.id, created_account, '_', 2);
    old_button_in.dataset.target = insertChar(old_button_in.dataset.target, created_account, '_', 2);
    old_button_in.id = insertChar(old_button_in.id, created_account, '_', 2);
    old_button_in_p.id = insertChar(old_button_in_p.id, created_account, '_', 2);

    old_modal.id = insertChar(old_modal.id, created_account, '_', 2);
    
    var target_name = "created_new";

    var input1 = document.getElementById(target_name + "_用电设备名称");
    var input2 = document.getElementById(target_name + "_数量");
    var input3 = document.getElementById(target_name + "_最大机械轴功率");
    var input4 = document.getElementById(target_name + "_电动机额定功率");
    var input5 = document.getElementById(target_name + "_电动机额定效率");
    var input6 = document.getElementById(target_name + "_电动机利用系数");
    var input7 = document.getElementById(target_name + "_航行状态机械负荷系数");
    var input8 = document.getElementById(target_name + "_航行状态电动机负荷系数");
    var input9 = document.getElementById(target_name + "_航行状态同时使用系数");
    var input10 = document.getElementById(target_name + "_航行状态负荷类别");
    var input11 = document.getElementById(target_name + "_进出港状态机械负荷系数");
    var input12 = document.getElementById(target_name + "_进出港状态电动机负荷系数");
    var input13 = document.getElementById(target_name + "_进出港状态同时使用系数");
    var input14 = document.getElementById(target_name + "_进出港状态负荷类别");
    var input15 = document.getElementById(target_name + "_作业状态机械负荷系数");
    var input16 = document.getElementById(target_name + "_作业状态电动机负荷系数");
    var input17 = document.getElementById(target_name + "_作业状态同时使用系数");
    var input18 = document.getElementById(target_name + "_作业状态负荷类别");
    var input19 = document.getElementById(target_name + "_停泊状态机械负荷系数");
    var input20 = document.getElementById(target_name + "_停泊状态电动机负荷系数");
    var input21 = document.getElementById(target_name + "_停泊状态同时使用系数");
    var input22 = document.getElementById(target_name + "_停泊状态负荷类别");

    input1.id = insertChar(input1.id, created_account, '_', 2);
    input2.id = insertChar(input2.id, created_account, '_', 2);
    input3.id = insertChar(input3.id, created_account, '_', 2);
    input4.id = insertChar(input4.id, created_account, '_', 2);
    input5.id = insertChar(input5.id, created_account, '_', 2);
    input6.id = insertChar(input6.id, created_account, '_', 2);
    input7.id = insertChar(input7.id, created_account, '_', 2);
    input8.id = insertChar(input8.id, created_account, '_', 2);
    input9.id = insertChar(input9.id, created_account, '_', 2);
    input10.id = insertChar(input10.id, created_account, '_', 2);
    input11.id = insertChar(input11.id, created_account, '_', 2);
    input12.id = insertChar(input12.id, created_account, '_', 2);
    input13.id = insertChar(input13.id, created_account, '_', 2);
    input14.id = insertChar(input14.id, created_account, '_', 2);
    input15.id = insertChar(input15.id, created_account, '_', 2);
    input16.id = insertChar(input16.id, created_account, '_', 2);
    input17.id = insertChar(input17.id, created_account, '_', 2);
    input18.id = insertChar(input18.id, created_account, '_', 2);
    input19.id = insertChar(input19.id, created_account, '_', 2);
    input20.id = insertChar(input20.id, created_account, '_', 2);
    input21.id = insertChar(input21.id, created_account, '_', 2);
    input22.id = insertChar(input22.id, created_account, '_', 2);

    var created_all_cal = document.getElementById("created_new_cal");
    var created_all_save = document.getElementById("created_new_save");
    var created_all_delete = document.getElementById("created_new_delete");

    created_all_cal.id = insertChar(created_all_cal.id, created_account, '_', 2);
    created_all_save.id = insertChar(created_all_save.id, created_account, '_', 2);
    created_all_delete.id = insertChar(created_all_delete.id, created_account, '_', 2);

    var device_list = document.getElementById("device_list");
    device_list.appendChild(clone_button);
    device_list.appendChild(clone_modal);


    created_all_cal.addEventListener("click", function(e){
        var target = e.target;
        var device_cal_button = document.getElementById(target.id + "_button");
        target_name = document.getElementById(device_cal_button.id + "_content").innerHTML;
        if(target.className.indexOf("add_cal") > 0){
            for(var i=0; i<device_select.length; i++) {
                if(device_select[i] == target_name) {
                  device_select.splice(i, 1);
                  break;
                }
            }
            device_select.push(target_name);
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
                if(device_select[i] == target_name) {
                  device_select.splice(i, 1);
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


    created_all_save.addEventListener("click", function(e){
        var target = e.target;
        po = find(target.id, '_', 2);
        var target_name = target.id.slice(0, po);

        var start_n = 0;
        for (var i in target_name){
            if(target_name[i] == 'w'){
                start_n = i
                break;
            }
        }
        var temp = target_name.substring(start_n, target_name.length);
        var my_create_count = parseInt(temp.slice(1, temp.length));

        var device_name = document.getElementById(target_name + "_用电设备名称").value;
        var old_device_name = document.getElementById(target_name + "_cal_button_content").innerHTML;
        
        if((created_new == true && my_create_count == created_account) || old_device_name != device_name){
            for (var item in device_recorder) {
                // console.log(item);
                if(device_recorder[item] == device_name){
                    alert("不能保存与已有设备相同的设备名称！！！保存失败");
                    return 0;
                }
            }
        }
        
        document.getElementById(target_name + "_cal_button_content").innerHTML = device_name;

        add_cal_button = document.getElementById(target_name + "_cal");

        if(add_cal_button.className.indexOf("add_cal") <= 0){
            for(var i=0; i<device_select.length; i++) {
                if(device_select[i] == old_device_name) {
                  device_select.splice(i, 1);
                  break;
                }
            }
            device_select.push(device_name);
        }

        if(created_account == my_create_count && created_new == true){
            device_recorder.push(device_name);
        }

        if(my_create_count == created_account) {
            // alert(my_create_count);
            created_new = false;
            document.getElementById("create_a_device").disabled = "";
        }

        if(old_device_name != device_name) {
            for(var i in device_recorder) {
                if(device_recorder[i] == old_device_name){
                    device_recorder.splice(i, 1);
                    break;
                }
            }
            device_recorder.push(device_name);
        }

        var param1 = document.getElementById(target_name + "_数量").value;
        if(param1 == '' || param1 == null) param1 = 0;
        var param2 = document.getElementById(target_name + "_最大机械轴功率").value;
        if(param2 == '' || param2 == null) param2 = 0;
        var param3 = document.getElementById(target_name + "_电动机额定功率").value;
        if(param3 == '' || param3 == null) param3 = 0;
        var param4 = document.getElementById(target_name + "_电动机额定效率").value;
        if(param4 == '' || param4 == null) param4 = 1;
        var param5 = document.getElementById(target_name + "_电动机利用系数").value;
        if(param5 == '' || param5 == null) param5 = 1;
        var param6 = document.getElementById(target_name + "_航行状态机械负荷系数").value;
        if(param6 == '' || param6 == null) param6 = 1;
        var param7 = document.getElementById(target_name + "_航行状态电动机负荷系数").value;
        if(param7 == '' || param7 == null) param7 = 1;
        var param8 = document.getElementById(target_name + "_航行状态同时使用系数").value;
        if(param8 == '' || param8 == null) param8 = 1;
        var param9 = document.getElementById(target_name + "_航行状态负荷类别").value;
        if(param9 == '' || param9 == null) param9 = 'NULL';
        var param10 = document.getElementById(target_name + "_进出港状态机械负荷系数").value;
        if(param10 == '' || param10 == null) param10 = 1;
        var param11 = document.getElementById(target_name + "_进出港状态电动机负荷系数").value;
        if(param11 == '' || param11 == null) param11 = 1;
        var param12 = document.getElementById(target_name + "_进出港状态同时使用系数").value;
        if(param12 == '' || param12 == null) param12 = 1;
        var param13 = document.getElementById(target_name + "_进出港状态负荷类别").value;
        if(param13 == '' || param13 == null) param13 = 'NULL';
        var param14 = document.getElementById(target_name + "_作业状态机械负荷系数").value;
        if(param14 == '' || param14 == null) param14 = 1;
        var param15 = document.getElementById(target_name + "_作业状态电动机负荷系数").value;
        if(param15 == '' || param15 == null) param15 = 1;
        var param16 = document.getElementById(target_name + "_作业状态同时使用系数").value;
        if(param16 == '' || param16 == null) param16 = 1;
        var param17 = document.getElementById(target_name + "_作业状态负荷类别").value;
        if(param17 == '' || param17 == null) param17 = 'NULL';
        var param18 = document.getElementById(target_name + "_停泊状态机械负荷系数").value;
        if(param18 == '' || param18 == null) param18 = 1;
        var param19 = document.getElementById(target_name + "_停泊状态电动机负荷系数").value;
        if(param19 == '' || param19 == null) param19 = 1;
        var param20 = document.getElementById(target_name + "_停泊状态同时使用系数").value;
        if(param20 == '' || param20 == null) param20 = 1;
        var param21 = document.getElementById(target_name + "_停泊状态负荷类别").value;
        if(param21 == '' || param21 == null) param21 = 'NULL';



        sendPost("/change_db", "action=save&old_device_name=" + old_device_name + 
                                 "&device_name=" + device_name + 
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

        add_cal_button.disabled = "";
    })

    created_all_delete.addEventListener("click", function(e){
        var target = e.target;
        // console.log(target.id);
        var device_cal_button = document.getElementById(target.id + "_button");

        var po = find(target.id, '_', 2);
        
        var start_n = 0;
        for (var i in target.id){
            if(target.id[i] == 'w'){
                start_n = i
            }
        }
        var temp = target.id.slice(start_n, po);
        var my_create_count = parseInt(temp.slice(1, temp.length));

        var device_name = document.getElementById(target.id.slice(0, po) + "_cal_button_content").innerHTML;
        
        if(!(created_new == true && my_create_count == created_account)){
            sendPost("/change_db", "action=delete&device_name=" + device_name);
        }

        for(var i=0; i<device_select.length; i++) {
            if(device_select[i] == device_name) {
              device_select.splice(i, 1);
            }
        }

        if(!(created_new == true && my_create_count == created_account)) {
            for (var i in device_recorder){
                if(device_recorder[i] == device_name){
                    device_recorder.splice(i, 1);
                    break;
                }
            }
        }

        if(my_create_count == created_account){
            created_new = false;
            document.getElementById("create_a_device").disabled = "";
        }
        
        device_list.removeChild(device_cal_button);
    })
})


function post(URL, PARAMS) {
    var temp = document.createElement("form");
    temp.action = URL;
    temp.method = "post";
    temp.style.display = "none";
    temp.enctype = "application/json";
    // temp.target = "_blank"
    for (var x in PARAMS) {
      var opt = document.createElement("textarea");
      opt.name = x;
      opt.value = PARAMS[x];
      temp.appendChild(opt);
    }
    document.body.appendChild(temp);
    temp.submit();
}


document.getElementById("start_calculator").addEventListener("click", function(){
    
    var engine_list = [];
    for (var i = 1; i <= engine_num; i++) {
        var num = document.getElementById("engine" + i + "_num").value;
        if(num == '' || num == null){
            num = '3';
        }
        var power = document.getElementById("engine" + i + "_power").value;
        if(power == '' || num == null){
            power = '90';
        }
        engine_list.push(num + "&" + power);
    }
    
    var k01 = document.getElementById("k01").value;
    var k02 = document.getElementById("k02").value;

    if(k01 == '' || k01 == null){
        k01 = 0.9;
    }
    if(k02 == '' || k02 == null){
        k02 = 0.6;
    }

    post("/results.html", {
        "work_condition": work_condition,
        "device_select": device_select,
        "engine_list": engine_list,
        "k01": parseFloat(k01),
        "k02": parseFloat(k02)
    });
})