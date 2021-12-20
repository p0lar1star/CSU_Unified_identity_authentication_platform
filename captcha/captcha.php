<?php
session_start();
//生成图片验证码
$pattern = 'ABCDEFGHIJKLOMNOPQRSTUVWXYZ';
for ($i = 0; $i < 4; $i++) {
    // mt_rand() 使用 Mersenne Twister 算法返回随机整数，包括边界。
    $code .= $pattern{mt_rand(0, 25)};
}
$_SESSION['captchacode'] = $code; //将随机数保存到session
$im = imagecreatetruecolor(60, 20); //创建一张宽60高20像素的图片
$bg = imagecolorallocate($im, 222, 222, 222); //设置图片的背景颜色
imagefill($im, 0, 0, $bg); //载入背景颜色
$ft = imagecolorallocate($im, 23, 122, 234); //设置字体颜色
$xian = imagecolorallocate($im, 83, 186, 103); //线条的颜色

$dian = imagecolorallocate($im, 205, 229, 92); //噪点的颜色
//imagefill($im,0,0,$dian);
imageline($im, 10, 5, 50, rand(0, 20), $xian); //绘制一根线条

for ($i = 0; $i < 100; $i++) //使用for循环来绘制多个噪点
{
    imagesetpixel($im, rand(10, 50), rand(5, 40), $dian);
}
imagestring($im, 6, 10, 0, $code, $ft);
//输出图片
header("Content-type:image/jpeg");
ob_clean();
imagejpeg($im);
?>