// 判断用户输入的字符串是否为空
function isEmpty(str) {
    if (str.length == 0 || str.trim() == "") {
        return true;
    }
    return false;
}

// 根据后端传来的数据进行下一步动作
function responseact1(cls) {
    if (cls.success == true) {
        window.location.href = cls.location;
    } else if (cls.success == false) {
        if (document.getElementById("captchaDiv_code")) {
            reloadCaptcha();
        }
        alert(cls.error_message);
    }
}

// 根据后端传来的数据进行下一步动作
function responseact2(cls) {
    if (cls.success == true) {
        alert(cls.success_message);
    } else if (cls.success == false) {
        reloadCaptcha();
        alert(cls.error_message);
    }
}


// 在用户名密码登录界面处理用户登录请求，使用ajax完成前后端交互，传输的数据格式为JSON
function loginfunction1() {
    var submit_username = document.getElementById("username").value;
    var submit_password = document.getElementById("password").value;
    if (isEmpty(submit_username) || isEmpty(submit_password)) {
        alert("用户名和密码不能为空！");
        return;
    }
    var json_item = {
        username: submit_username,
        password: submit_password,
        login: true
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
            responseact1(result);
        }
    }
    xmlhttp.open("POST", "./login/login1.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("json_item=" + json_string);
}

// 绑定元素事件响应的JS，一定要等到相应元素加载后或文档全部加载完成后再执行，否则无法找到元素不可绑定事件
// 正则表达式验证邮箱,邮箱格式正确返回true，否则返回false
function checkemail() {
    var reg = new RegExp(
        "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); //正则表达式
    var obj = document.getElementById("username"); //要验证的对象
    if (!reg.test(obj.value)) { //正则验证不通过，格式不对
        return false;
    }
    return true;
}

// 在动态码登录页面处理登录请求
function loginfunction2() {
    var submit_email = document.getElementById("username").value;
    var submit_captcha = document.getElementById("captcha").value;
    var submit_dynamicCode = document.getElementById("dynamicCode").value;
    if (isEmpty(submit_email) || isEmpty(submit_captcha) || isEmpty(submit_dynamicCode)) {
        alert("邮箱名或验证码不能为空！");
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
        login: true
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
            responseact1(result);
        }
    }
    xmlhttp.open("POST", "../login/login2.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("json_item=" + json_string);
}

// 重新加载验证码
function reloadCaptcha() {
    document.getElementById("captchaImg").src = "./captcha/captcha.php"
}

// 生成动态验证码
function dynamicCodefunction() {
    var submit_email = document.getElementById("username").value;
    var submit_captcha = document.getElementById("captcha").value;
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
                responseact2(result);
            }
        }
        xmlhttp.open("POST", "./captcha/mail.php", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send("json_item=" + json_string);
    }
    return;
}

// 点击“账号登录”时，使用GET请求将页面换成index.html
function loadXMLDoc1() {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
        xmlhttp = new XMLHttpRequest();
    }
    xmlhttp.onreadystatechange = function() {
        // 当 readyState 等于 4 且状态为 200 时，表示响应已就绪
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.documentElement.innerHTML = xmlhttp.responseText;
        }
    }
    xmlhttp.open("GET", "./index.html", true);
    xmlhttp.send();
}

// 点击“动态码登录”时，使用GET请求将页面换成index2.html
function loadXMLDoc2() {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
        xmlhttp = new XMLHttpRequest();
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.documentElement.innerHTML = xmlhttp.responseText;
        }
    }
    xmlhttp.open("GET", "./index2.html", true);
    xmlhttp.send();
}

// 忘记密码
function jmptoforgetpassword() {
    alert("忘记密码！");
    window.location = "../forget.html"
}

// 修改密码
function jmptochangepassword() {
    alert("修改密码！");
    window.location="../change.html"
}
