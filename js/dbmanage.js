var mask = document.getElementById("mask");
var userlist, users;
var httpRequest;

// 判断用户输入的字符串是否为空
function isEmpty(str) {
    if (str.length == 0 || str.trim() == "") {
        return true;
    }
    return false;
}

// 正则表达式验证邮箱,邮箱格式正确返回true，否则返回false
function checkemail() {
    var reg = new RegExp(
        "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); //正则表达式
    var obj = document.getElementById("email"); //要验证的对象
    if (!reg.test(obj.value)) { //正则验证不通过，格式不对
        return false;
    }
    return true;
}

// 提示消息
function act(cls) {
    if (cls.success == true) {
        alert(cls.success_message);
    } else {
        alert(cls.error_message);
    }
}

// 添加用户
function addUser() {
    var login_name, username;
    var url;
    var submit_username = document.getElementById("username").value;
    var submit_password = document.getElementById("password").value;
    var submit_email = document.getElementById("email").value;

    var json_item = {
        username: submit_username,
        password: submit_password,
        email: submit_email,
        action: "adduser"
    }
    var json_string = JSON.stringify(json_item);
    if (!isEmpty(submit_email) && !isEmpty(submit_password) && !isEmpty(submit_username) && checkemail()) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            var rtn;
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                result = JSON.parse(xmlhttp.responseText);
                act(result);
                closePopup();
                window.location.reload();
            }
        }
        xmlhttp.open("POST", "../dbmanage/dbmanage.php", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send("json_item=" + json_string);
    } else {
        alert("信息不完整或邮箱格式不正确！");
    }
}

// 得到用户
function getUsers() {
    httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = showUsers;
    var json_item = {
        action: "getusers"
    }
    var json_string = JSON.stringify(json_item);
    httpRequest.open('POST', "../dbmanage/dbmanage.php", true);
    httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    httpRequest.send("json_item=" + json_string);
}

// 显示用户
function showUsers() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            userlist = JSON.parse(httpRequest.responseText);
            for (var i = 0; i < userlist.length; i++) {
                var userline = document.createElement("tr");
                var user_id = userlist[i].id;
                var username = userlist[i].username;
                var password = userlist[i].password;
                var admin = userlist[i].admin;
                var email = userlist[i].email;
                var userlineHTML = "<td>" + user_id + "</td><td>" + username +
                    "</td><td>" + password + "</td><td>" + admin + "</td><td>" + email +
                    "</td><td><input type='button' value='删除' style='width:60%' onclick='deleteUser(this)'/></td>";
                userline.innerHTML = userlineHTML;
                document.getElementById("usertable").appendChild(userline);
            }
        } else {
            alert(httpRequest.responseText);
        }
    }
}

// 删除用户
function deleteUser(obj) {
    var user_id
    var url;
    if (confirm("是否删除当前行数据？") == false) {
        return false;
    }
    user_id = obj.parentNode.parentNode.firstChild.innerText;
    var json_item = {
        id: user_id,
        action: "deleteuser"
    }
    var json_string = JSON.stringify(json_item);
    httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = deleteUserResult;
    httpRequest.open('POST', '../dbmanage/dbmanage.php', true);
    httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    httpRequest.send("json_item=" + json_string);
}

// 删除用户的结果
function deleteUserResult() {
    var rtn, userTable;
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            // console.log(httpRequest.responseText)
            result = JSON.parse(httpRequest.responseText);
            act(result);
            window.location.reload();
        }
    }
}

// 点击添加新用户，显示该窗口
function showUserInputPopup() {
    mask.style.display = "block";
}

// 隐藏添加新用户的窗口
function closePopup() {
    mask.style.display = "none";
}