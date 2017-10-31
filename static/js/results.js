var work_condition = document.getElementById("workcondition_start").innerHTML; // 记录工况的全局变量
document.getElementById("container_workcondition" + work_condition).style.display = "";


var work_condition1 = document.getElementById("work_condition1");
var work_condition2 = document.getElementById("work_condition2");
var work_condition3 = document.getElementById("work_condition3");
var work_condition4 = document.getElementById("work_condition4");

var work_condition1_choose = document.getElementById("work_condition1_choose");
var work_condition2_choose = document.getElementById("work_condition2_choose");
var work_condition3_choose = document.getElementById("work_condition3_choose");
var work_condition4_choose = document.getElementById("work_condition4_choose");

var work_condition1_fram = document.getElementById("container_workcondition1");
var work_condition2_fram = document.getElementById("container_workcondition2");
var work_condition3_fram = document.getElementById("container_workcondition3");
var work_condition4_fram = document.getElementById("container_workcondition4");

work_condition1_choose.style.display = "none";
work_condition2_choose.style.display = "none";
work_condition3_choose.style.display = "none";
work_condition4_choose.style.display = "none";

document.getElementById("work_condition" + work_condition + "_choose").style.display = "";

work_condition1.addEventListener("click", function(){
    work_condition = 1;
    work_condition1_choose.style.display = "";
    work_condition1_fram.style.display = "";
    work_condition2_choose.style.display = "none";
    work_condition2_fram.style.display = "none";
    work_condition3_choose.style.display = "none";
    work_condition3_fram.style.display = "none";
    work_condition4_choose.style.display = "none";
    work_condition4_fram.style.display = "none";
})

work_condition2.addEventListener("click", function(){
    work_condition = 2;
    work_condition1_choose.style.display = "none";
    work_condition1_fram.style.display = "none";
    work_condition2_choose.style.display = "";
    work_condition2_fram.style.display = ""
    work_condition3_choose.style.display = "none";
    work_condition3_fram.style.display = "none";
    work_condition4_choose.style.display = "none";
    work_condition4_fram.style.display = "none";
})

work_condition3.addEventListener("click", function(){
    work_condition = 3;
    work_condition1_choose.style.display = "none";
    work_condition1_fram.style.display = "none";
    work_condition2_choose.style.display = "none";
    work_condition2_fram.style.display = "none"
    work_condition3_choose.style.display = "";
    work_condition3_fram.style.display = "";
    work_condition4_choose.style.display = "none";
    work_condition4_fram.style.display = "none";
})

work_condition4.addEventListener("click", function(){
    work_condition = 4;
    work_condition1_choose.style.display = "none";
    work_condition1_fram.style.display = "none";
    work_condition2_choose.style.display = "none";
    work_condition2_fram.style.display = "none"
    work_condition3_choose.style.display = "none";
    work_condition3_fram.style.display = "none";
    work_condition4_choose.style.display = "";
    work_condition4_fram.style.display = "";
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


document.getElementById("print_all_results").addEventListener("click", function(){
    post("/results.xlsx", {});
})


document.getElementById("logout").addEventListener("click", function(){
    post("/logout", {});
})