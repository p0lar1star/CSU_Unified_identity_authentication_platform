<?php
    // 连接数据库
    $conn = @mysqli_connect("localhost","root","") or die("数据库连接出错！");
    // bool mysqli_select_db(mysqli link,string dbname);
    // link为连接MySQL服务器后返回的连接标识。
    // dbname为指定要选择的数据库名称。
    $selected = mysqli_select_db($conn, "csuusers");
?>