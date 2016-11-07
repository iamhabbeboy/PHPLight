<?php session_start();
ob_start();
//error_reporting(0);
require 'db/Model.php';
require 'app/Render.php';
//$db = new Model();
$render = new Render();

if(isset($_GET['p']))
{
	$page = $_GET['p'];
	$title = '';
    $render -> render_page($page, $title);

} else {

    $render -> render_page('default', '');

}

/*print "<center style='color: #FFF'>
<small class='smaller'> Page loads @ $result seconds</small></center>";
*/
