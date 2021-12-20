<?php
session_start();
include"./conn.php";
$json_string = $_POST['json_item'];
$user_information = json_decode($json_string, true);
$postaction = $user_information['action'];
class sendback
{
    public $success_message = "";
    public $success = true; // 是否成功
    public $error_message = ""; // 返回错误信息
}
// 添加用户
if($postaction == "adduser") {
    $postusername = $user_information['username'];
    $postemail = $user_information['email'];
    $postpassword = $user_information['password'];
    $hashedpwd = md5($postpassword);
    $adduser_sql = "INSERT INTO account (username, password, admin, email) VALUES ('$postusername', '$hashedpwd', 0, '$postemail')";
    $result = mysqli_query($conn, $adduser_sql);
    if(!$result){
        $sendback_message = new sendback();
        $sendback_message->success = false;
        $sendback_message->error_message = "添加用户失败！";
        $jsonback_message = json_encode($sendback_message);
        echo $jsonback_message;
        exit(0);
    }else{
        $sendback_message = new sendback();
        $sendback_message->success = true;
        $sendback_message->success_message = "添加用户成功！";
        $jsonback_message = json_encode($sendback_message);
        echo $jsonback_message;
        exit(0);
    }
}else if($postaction == "getusers"){
    $getusers_sql = "SELECT * FROM account";
    $result = array();
    // 执行查询
    $query = mysqli_query($conn, $getusers_sql);
    // 用户数量，结果行数
    while($row = mysqli_fetch_array($query)){
        $result[] = array("id"=>$row['id'],"username"=>$row['username'],"password"=>$row['password'],"admin"=>$row['admin'],"email"=>$row['email']);
    }
    echo json_encode($result);
    exit(0);
}else if($postaction == "deleteuser"){
    $postid = $user_information['id'];
    $deluser_sql = "DELETE FROM account WHERE id='$postid'";
    mysqli_query($conn, $deluser_sql);
    $sendback_message = new sendback();
    $sendback_message->success = true;
    $sendback_message->success_message = "删除用户成功！";
    $jsonback_message = json_encode($sendback_message);
    echo $jsonback_message;
    exit(0);
}
?>