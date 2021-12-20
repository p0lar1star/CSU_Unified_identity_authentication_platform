<?php
session_start();
include "./conn.php";
$json_string = $_POST['json_item'];
// 当第二个参数为 true 时，将返回 array 而非 object 
$user_information = json_decode($json_string, true);
$postusername = $user_information['username'];
$postoldpwd = $user_information['oldpwd'];
$postnewpwd = $user_information['newpwd'];
$postcaptcha = $user_information['captcha'];
$postcaptcha = strtoupper($postcaptcha); //取得用户输入的图片验证码并转换为大写
$correct_captcha = $_SESSION['captchacode']; //取得图片验证码中的四个随机数
class sendback
{
    public $success = true; // 是否成功
    public $error_message = ""; // 返回错误信息
    public $success_message = ""; // 返回成功信息
}

$sql = "SELECT username, password, admin FROM account WHERE username = '$postusername'";
$query = mysqli_query($conn, $sql); //执行sql语句查询
$row_num = mysqli_num_rows($query);
if ($row_num == 0) {
    $error = new sendback();
    $error->success = false;
    $error->error_message = "用户不存在！";
    $error_back = json_encode($error);
    echo $error_back;
    exit(0);
} else if ($row_num == 1) {
    // mysqli_fetch_array() 函数从结果集中取得一行作为关联数组，或数字数组，或二者兼有。
    $row = mysqli_fetch_array($query, MYSQLI_ASSOC);
}
if ($row_num == 1) {
    if ($postcaptcha == $correct_captcha) //判断图片验证码是否输入正确
    {
        $hashed_pwd = $row['password'];
        if (md5($postoldpwd) == $hashed_pwd) {
            // 修改密码操作
            $newpwd = md5($postnewpwd);
            $changepwd_sql = "UPDATE account SET password='$newpwd' WHERE username='$postusername'";
            mysqli_query($conn, $changepwd_sql);
            $sendback_message = new sendback();
            $sendback_message->success = true;
            $sendback_message->success_message = "修改密码成功！";
            $jsonback_message = json_encode($sendback_message);
            echo $jsonback_message;
            exit(0);
        } else {
            $sendback_message = new sendback();
            $sendback_message->success = false;
            $sendback_message->error_message = "密码错误！";
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
    $sendback_message->error_message = "用户不存在！";
    $jsonback_message = json_encode($sendback_message);
    echo $jsonback_message;
    exit(0);
}
?>