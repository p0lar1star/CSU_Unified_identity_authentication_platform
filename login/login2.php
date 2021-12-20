<?php
session_start();
include "./conn.php"; //连接数据库
$json_string = $_POST['json_item'];
$user_information = json_decode($json_string, true);
$postemail = $user_information['email']; //取得用户名
$postcaptcha = $user_information['captcha']; //取得用户输入的图片验证码
$postdynamicCode = $user_information['dynamicCode'];
$postLogin = $user_information['login']; //取得是否是登录
$postcaptcha = strtoupper($postcaptcha); //取得用户输入的图片验证码并转换为大写
$correct_captcha = $_SESSION['captchacode']; //取得图片验证码中的四个随机数
class sendback
{
    public $location = ""; // 指定跳转的位置
    public $success = true; // 是否成功
    public $error_message = ""; // 返回错误信息
}

if(isset($_SESSION['dynamicCode'])) {
    $correct_dynamicStr = $_SESSION['dynamicCode'];
} else {
    $error = new sendback();
    $error->success = false;
    $error->error_message = "你还没有获取动态码！";
    $error_back = json_encode($error);
    echo $error_back;
    exit(0);
}

$sql = "SELECT username, password, admin FROM account WHERE email = '$postemail'";
$query = mysqli_query($conn, $sql); //执行sql语句查询
$row_num = mysqli_num_rows($query);
if ($row_num == 0) {
    $error = new sendback();
    $error->success = false;
    $error->error_message = "邮箱不存在！";
    $error_back = json_encode($error);
    echo $error_back;
    exit(0);
} else if ($row_num == 1) {
    // mysqli_fetch_array() 函数从结果集中取得一行作为关联数组，或数字数组，或二者兼有。
    $row = mysqli_fetch_array($query, MYSQLI_ASSOC);
}
if ($postLogin == true && $row_num == 1) {
    if ($postcaptcha == $correct_captcha) //判断图片验证码是否输入正确
    {
        $postdynamicCode .= $postemail;
        if ($postdynamicCode == $_SESSION['dynamicCode']) { //判断动态验证码是否输入正确
            // 验证权限，是否为管理员
            $privilege = $row['admin'];
            if ($privilege == 1) {
                $sendback_message = new sendback();
                $sendback_message->location = "../success/loginsuccess-1.html";
                $jsonback_message = json_encode($sendback_message);
                echo $jsonback_message;
                exit(0);
            } else if ($privilege == 0) {
                $sendback_message = new sendback();
                $sendback_message->location = "../success/loginsuccess-0.html";
                $jsonback_message = json_encode($sendback_message);
                echo $jsonback_message;
                exit(0);
            }
        } else {
            $sendback_message = new sendback();
            $sendback_message->success = false;
            $sendback_message->error_message = "动态验证码错误！";
            $jsonback_message = json_encode($sendback_message);
            echo $jsonback_message;
            exit(0);
        }
    } else {
        $sendback_message = new sendback();
        $sendback_message->success = false;
        $sendback_message->error_message = "图片验证码错误！";
        $jsonback_message = json_encode($sendback_message);
        echo $jsonback_message;
        exit(0);
    }
} else {
    $sendback_message = new sendback();
    $sendback_message->success = false;
    $sendback_message->error_message = "邮箱不存在！";
    $jsonback_message = json_encode($sendback_message);
    echo $jsonback_message;
    exit(0);
}
?>