<?php
// 它可以把用户提交的数据以全局变量形式保存在一个session中并且会生成一个唯一的session_id
session_start();
include "./conn.php"; //连接数据库
$json_string = $_POST['json_item'];
$user_information = json_decode($json_string, true);
$postUsername = $user_information['username']; //取得用户名
$postPassword = $user_information['password']; //取得用户密码
$postLogin = $user_information['login'];
$sql = "SELECT username, password, admin FROM account WHERE username = '$postUsername'";
$query = mysqli_query($conn, $sql); //执行sql语句查询
$row_num = mysqli_num_rows($query);
class sendback
{
    public $location = ""; // 指定跳转的位置
    public $success = true; // 是否成功
    public $error_message = ""; // 返回错误信息
}
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
if ($postLogin == true && $row_num == 1) {
    $hashed_pwd = $row['password'];
    if (md5($postPassword) == $hashed_pwd) {
        $privilege = $row['admin'];
        if ($privilege == 0) {
            $sendback_message = new sendback();
            $sendback_message->location = "../success/loginsuccess-0.html";
            $jsonback_message = json_encode($sendback_message);
            echo $jsonback_message;
            exit(0);
        } else if ($privilege == 1) {
            $sendback_message = new sendback();
            $sendback_message->location = "../success/loginsuccess-1.html";
            $jsonback_message = json_encode($sendback_message);
            echo $jsonback_message;
            exit(0);
        }
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
    $sendback_message->error_message = "用户不存在！";
    $jsonback_message = json_encode($sendback_message);
    echo $jsonback_message;
    exit(0);
}
?>