<?php
session_start();
include "./conn.php"; //连接数据库
// 验证用户已提交的表单数据
$json_string = $_POST['json_item'];
$user_information = json_decode($json_string, true);
$postemail = $user_information['email']; //取得用户名
$postcaptcha = $user_information['captcha']; //取得用户输入的图片验证码
$postcaptcha = strtoupper($postcaptcha); //取得用户输入的图片验证码并转换为大写
$correct_captcha = $_SESSION['captchacode']; //取得图片验证码中的四个随机数
class message
{
    public $success = true;
    public $error_message = "";
    public $success_message = "";
}
if ($postcaptcha != $correct_captcha) //判断图片验证码是否输入正确
{
    $error = new message();
    $error->success = false;
    $error->error_message = "图片验证码错误！";
    $error_back = json_encode($error);
    echo $error_back;
    exit(0);
}
$sql = "SELECT id, username, password, admin FROM account WHERE email = '$postemail'";
$query = mysqli_query($conn, $sql); //执行sql语句查询
$row_num = mysqli_num_rows($query);
if ($row_num == 0) {
    $error = new message();
    $error->success = false;
    $error->error_message = "邮箱不存在！";
    $error_back = json_encode($error);
    echo $error_back;
    exit(0);
}
// 生成动态验证码
$dynamicStr = "";
$dynamic_Code = "";
$dynamic_Code .= mt_rand(100000, 999999);
$dynamicStr = $dynamic_Code;
$dynamicStr .= $postemail; // 999999abcdefghijk123@163.com
$_SESSION['dynamicCode'] = $dynamicStr; //将动态验证码保存到session
$dynamicCode = substr($_SESSION['dynamicCode'], 0, 6);
// 调用邮件api
$emailtext = "Your Verification Code is ";
$emailtext .= $dynamicCode;
$url = "https://api.dzzui.com/api/mail?Host=smtp.qq.com&Username=1411508780@qq.com&Password=boxbdbtvaqgggfjb&Port=465&SMTPSecure=ssl&addAddress=";
$url .= $postemail;
$url .= "&title=Your%20Verification%20Code&text=";
$url .= $emailtext;
function geturl($url)
{
    $headerArray = array("Content-type:application/json;", "Accept:application/json");
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headerArray);
    $output = curl_exec($ch);
    curl_close($ch);
    return $output;
}
$output_text = geturl($url);
if ($output_text == "邮件发送成功") {
    $success = new message();
    $success->success = true;
    $success->success_message = "动态码发送成功！请及时查收";
    $success_back = json_encode($success);
    echo $success_back;
    exit(0);
} else {
    $error = new message();
    $error->success = false;
    $error->error_message = "动态码发送失败！";
    $error_back = json_encode($error);
    echo $error_back;
    exit(0);
}
?>