<?php

function get_time($db, $user)
{

   $sql = $db -> find_by_sql(" SELECT * FROM practisetime ORDER BY id DESC LIMIT 1");
   $fetch = $sql -> fetch();

   $time = $fetch['hour'].':'. $fetch['minute'].':'.$fetch['second'];
   $date = date('d-m-y h:i');

   $st = $db -> find_by_fields('countdown', array('loginkey' => $user));
   $n = '';

   if ($st ->rowCount() > 0)
   {
   	  $ft1 = $st->fetch();
   	  $t = $ft1['countdown'];
   	  $n = $t;
   	
   } else {

   	   $sav = $db ->save_record('countdown',
   	   array('loginkey' => $user, 'countdown' => $time, 'date' => $date));
   	   //$n = preg_replace('/:/', ' : ',$time);
   	   $t = explode(':', $time);
   	   $h = ($t[0] < 10 ) ? '0'.$t[0] : $t[0];
   	   $m = ($t[1] < 10 ) ? '0'.$t[1] : $t[1];
   	   $s = ($t[2] < 10 ) ? '0'.$t[2] : $t[2];
   	   $n = $h.' : '. $m. ' : '. $s;
   }
   return $n;
   //return '0'.$fetch['hour'] .' : '. $fetch['minute']. ' : '. '0'.$fetch['second'];
}

function get_status($db, $user)
{

	$sql = $db -> find_by_fields("studentlog", array('loginkey' => $user));
    $ft = $sql->fetch();
    return $ft['count'];
}

function get_answer($db, $id )
{
	$sql = $db -> find_by_fields("question", array('id' => $id ));
	$ft = $sql->fetch();
	return $ft['answer'];
}

function get_photo($dir, $db, $matric )
{
	$query = $db -> find_by_fields('studentrecord',
	array('loginkey' => $matric ));
	$ft = $query->fetch();
	return (empty($ft['photo']) ? $dir.'/avatar.png' : $dir.'/'.$ft['photo'] );
}


  function nav_map($db, $user, $_id)
  {
  	$sql = $db -> find_by_fields('tmp_answer',
  	array('username' => $user, '&question' => $_id));
  	if ($sql->rowCount() > 0)
  	{
  		return 'true';
  	} else {
  		return 'false';
  	}
  }
