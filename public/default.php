<?php
require_once('db/Model.php');
 $db = new Model();

  echo "<h2>This is our homepage </h2>";

   $sql = $db -> find_by_sql("SELECT * FROM uploads");
   $sql = $db -> find_by_fields("uploads", array('id' => 1 , '&size' => 31));

   //$sql1 = $db -> find_by_fields("users", array('id' => 1 , '|size' => 31));
   $sql1 = $db -> find_by_fields("users", array('id' => 1));
   $rows = $sql->fetch();


   $query1 = $db -> find_by_sql("SELECT * FROM uploads, users WHERE uploads.username = users.email");

   $sq = $query1->fetchAll();

   foreach ($sq as $key => $value) {
     # code...
     echo "<p>".$value['username']."</p>";
   }
    //echo $query1->rowcount();
 ?>
