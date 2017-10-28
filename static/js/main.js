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


var all_device = document.getElementsByClassName("device_button");

for (var i=0; i<all_device.length; i++) {
    all_device[i].addEventListener("click", function(e){
        var target = e.target;
        device_cal_button = document.getElementById(target.id + "_button");
        if(target.className.indexOf("add_cal") > 0){
            device_select.push(target.id);
            target.classList.remove("add_cal");
            target.classList.add("rm_cal");
            target.classList.remove("btn-success");
            target.classList.add("btn-danger");
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
            target.classList.remove("btn-danger");
            target.classList.add("btn-success");
            target.innerHTML = "加入计算";
            device_cal_button.classList.remove("btn-success");
            device_cal_button.classList.add("btn-default");
        }
    })
}