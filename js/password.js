// 判断用户输入的字符串是否为空
function isEmpty(str) {
    if (str.length == 0 || str.trim() == "") {
        return true;
    }
    return false;
}

// 修改密码
function changepassword() {
    var submit_username = document.getElementById("username").value;
    var submit_oldpwd = document.getElementById("oldpwd").value;
    var submit_newpwd = document.getElementById("newpwd").value;
    var submit_confirm_newpwd = document.getElementById("confirm_newpwd").value;
    var submit_captcha = document.getElementById("captcha").value;

    // 合法性及有效性校验
    if (isEmpty(submit_username)) {
        alert("用户名不能为空！");
        reloadCaptcha();
        return;
    }
    if (isEmpty(submit_oldpwd)) {
        alert("原密码不能为空！");
        reloadCaptcha();
        return;
    }
    if (isEmpty(submit_newpwd)) {
        alert("新密码不能为空！");
        reloadCaptcha();
        return;
    }
    if (isEmpty(submit_confirm_newpwd)) {
        alert("必须再次输入新密码！");
        reloadCaptcha();
        return;
    }
    if (submit_confirm_newpwd != submit_newpwd) {
        alert("新密码前后输入不一致！");
        reloadCaptcha();
        return;
    }
    if (isEmpty(submit_captcha)) {
        alert("验证码不能为空！");
        reloadCaptcha();
        return;
    }

    var json_item = {
        username: submit_username,
        oldpwd: submit_oldpwd,
        newpwd: submit_newpwd,
        captcha: submit_captcha
    }
    // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串
    var json_string = JSON.stringify(json_item);
    console.log(json_string);
    var xmlhttp;
    if (window.XMLHttpRequest) {
        var xmlhttp = new XMLHttpRequest();
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var result = JSON.parse(xmlhttp.responseText);
            // var result = xmlhttp.responseText;
            // console.log(result);
            // return;
            act(result);
        }
    }
    xmlhttp.open("POST", "../password/changepassword.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("json_item=" + json_string);
}

// 重新加载验证码
function reloadCaptcha() {
    document.getElementById("captchaImg").src = "../captcha/captcha.php"
}

// 弹窗提示后端返回的信息
function act(cls) {
    if (cls.success == true) {
        alert(cls.success_message);
    } else {
        alert(cls.error_message);
        reloadCaptcha();
    }
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

// 生成动态验证码
function dynamicCode() {
    var submit_email = document.getElementById("email").value;
    var submit_captcha = document.getElementById("captcha").value;
    // var submit_newpwd = document.getElementById("newpwd").value;
    // var submit_confirm_newpwd = document.getElementById("confirm_newpwd").value;
    if (isEmpty(submit_email) || isEmpty(submit_captcha)) {
        alert("邮箱和图片验证码不能为空！");
        return;
    } else {
        if (checkemail() == false) {
            alert("邮箱格式不正确！");
            return;
        }
        var json_item = {
            email: submit_email,
            captcha: submit_captcha
        }
        // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串
        var json_string = JSON.stringify(json_item);
        var xmlhttp;
        if (window.XMLHttpRequest) {
            var xmlhttp = new XMLHttpRequest();
        }
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var result = JSON.parse(xmlhttp.responseText);
                // var result = xmlhttp.responseText;
                // console.log(result);
                // return;
                act(result);
            }
        }
        xmlhttp.open("POST", "../password/forgetpwd-mail.php", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send("json_item=" + json_string);
    }
    return;
}

// 重置密码
function forgetpassword() {
    var submit_email = document.getElementById("email").value;
    var submit_captcha = document.getElementById("captcha").value;
    var submit_dynamicCode = document.getElementById("dynamicCaptcha").value;
    var submit_newpwd = document.getElementById("newpwd").value;
    var submit_confirm_newpwd = document.getElementById("confirm_newpwd").value;
    
    // 合法性及有效性校验
    if (isEmpty(submit_email)) {
        alert("邮箱不能为空！");
        reloadCaptcha();
        return;
    }
    if (isEmpty(submit_newpwd)) {
        alert("新密码不能为空！");
        reloadCaptcha();
        return;
    }
    if (isEmpty(submit_confirm_newpwd)) {
        alert("必须再次输入新密码！");
        reloadCaptcha();
        return;
    }
    if (submit_confirm_newpwd != submit_newpwd) {
        alert("新密码前后输入不一致！");
        reloadCaptcha();
        return;
    }
    if (isEmpty(submit_captcha)) {
        alert("图片验证码不能为空！");
        reloadCaptcha();
        return;
    }
    if (isEmpty(submit_dynamicCode)) {
        alert("动态验证码不能为空！");
        reloadCaptcha();
        return;
    }
    if (checkemail() == false) {
        alert("邮箱格式不正确！");
        reloadCaptcha();
        return;
    }
    var json_item = {
        email: submit_email,
        captcha: submit_captcha,
        dynamicCode: submit_dynamicCode,
        newpwd: submit_newpwd
    }
    // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串
    var json_string = JSON.stringify(json_item);
    var xmlhttp;
    if (window.XMLHttpRequest) {
        var xmlhttp = new XMLHttpRequest();
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var result = JSON.parse(xmlhttp.responseText);
            // var result = xmlhttp.responseText;
            // console.log(result);
            // return;
            act(result);
        }
    }
    xmlhttp.open("POST", "../password/forgetpwd-change.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("json_item=" + json_string);
}
