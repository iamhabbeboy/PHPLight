<?php

/**
 *
 *  Date: 12/30/2015
 *  Written by: Abiodun Solomon < iamhabbeboy >
 *  ReadMe will help use this object
 */
class Model {
    public $pdo;
    private $path;
    public function __construct() {
        try {
            $this -> pdo = new PDO('mysql:host=localhost;dbname=cloud', 'root', '');
           // print "connected !";
            $this -> pdo -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {

            trigger_error(' Unable to connect to Database !');

        }
    }

    public function find_by_sql($sql) {
        //$p = $this->pdo;
        $query = $this-> pdo -> query($sql);
        return $query;
    }

    public function find_by_id($table, $arg) {
        $keys = '';
        $vals = array();
        foreach ($arg as $key => $values) {

            $keys .= $key . ' = ? ';
            array_push($vals, $values);
        }

        $query = $this -> pdo -> prepare("SELECT * FROM " . $table . " WHERE " . $keys );
        $query -> execute($vals);
        return $query;
    }

    public function find_by_fields($table, $params) {
        $keys = '';
        $vals = '';
        $order = '';
        $save_to_array = array();
            foreach ($params as $k1 => $v1) {

                if (preg_match('/&/', $k1)) {

                    $k1 = 'AND ' . substr($k1, 1, strlen($k1)). ' = ?';
                } else if (preg_match('/\|/', $k1)) {

                    $k1 = 'OR ' . substr($k1, 1, strlen($k1)). ' = ? ';

                }else {

                    $k1 = $k1.' = ? ';
                }
                 $keys .= $k1 . ' ';
               $vals .= $v1.', ';
                array_push($save_to_array, $v1);
               $r = substr($vals, 0, strlen($vals) - 2);
            }
          $sql = "SELECT * FROM " . $table . " WHERE ". $keys ;
         $query = $this->pdo->prepare($sql);
         $query->execute($save_to_array);
         return $query;
    }


     /*public function find_by_fields($table, $params) {

        $keys = '';
        $vals = '';
        $save_to_array = array();

        //foreach ($params as $key => $values) {

            foreach ($params as $k1 => $v1) {

                if (preg_match('/&/', $k1)) {

                    $k1 = 'AND ' . substr($k1, 1, strlen($k1)). ' = ?';
                } else if (preg_match('/\|/', $k1)) {

                    $k1 = 'OR ' . substr($k1, 1, strlen($k1)). ' = ? ';
                } else {

                    $k1 = $k1.' = ? ';
                }
                 $keys .= $k1 . ' ';
               $vals .= $v1.', ';
                array_push($save_to_array, $v1);
               $r = substr($vals, 0, strlen($vals) - 2);
            }
        //}
          $sql = "SELECT * FROM " . $table . " WHERE ". $keys;
         $query = $this->pdo->prepare($sql);
         $query->execute($save_to_array);
         return $query;
    }
    */


    public function update_by_fields($table, $params) {

        $keys = '';
        $vals = '';
        $save_to_array = array();
         $k4 = '';
          $k2 = '';
          $save = '';
        //foreach ($params as $key => $values) {

            foreach ($params as $k1 => $v1) {

                if(preg_match('/->/', $k1)) {

                    $k2 .= ' WHERE '.substr($k1, 2, strlen($k1)).' = ? ';

               }else if(preg_match('/\|/', $k1)) {

                     $k2 .= ' OR '.substr($k1, 1, strlen($k1)).' = ?  ';

                  } else if(preg_match('/,/', $k1)) {

                    $k2 .= ','.substr($k1, 1, strlen($k1)).' = ?  ';

                }else{

                    $k4 .= $k1. '= ?, ';
                }

                 $save = substr($k4, 0, strlen($k4) -2 ).' '. substr($k2, 0, strlen($k2) -1);
                $keys .= $k1;
               $vals .= $v1.', ';
               array_push($save_to_array, $v1);
               $r = substr($vals, 0, strlen($vals) - 2);
            }

          $sql = "UPDATE " . $table . " SET ". $save;
         $query = $this->pdo->prepare($sql);
         $query->execute($save_to_array);
         return $query;

    }


    public function destroy_record($table, $fields) {

         $keys = '';
        $vals = '';
        $save_to_array = array();

     //   foreach ($params as $key => $values) {

            foreach ($fields as $k1 => $v1) {

                if (preg_match('/&/', $k1)) {

                    $k1 = 'AND ' . substr($k1, 1, strlen($k1)). ' = ?';
                } else if (preg_match('/\|/', $k1)) {

                    $k1 = 'OR ' . substr($k1, 1, strlen($k1)). ' = ? ';
                } else {

                    $k1 = $k1.' = ? ';
                }
                 $keys .= $k1 . ' ';
               $vals .= $v1.', ';
                array_push($save_to_array, $v1);
               $r = substr($vals, 0, strlen($vals) - 2);
        }

          $sql = "DELETE FROM " . $table . " WHERE ". $keys;
         $query = $this->pdo->prepare($sql);
         $query->execute($save_to_array);
         return $query;

    }


    public function save_record($table, $fields) {
        $newFields = count($fields);


        if ($newFields >= 0) {

            $string = '';
            $question = array();
            $val = array();
            foreach ($fields as $key => $value) {

                $string .=$key.', ';
                array_push($question, $key);
                array_push($val, $value);
            }

            $fb = array($fields);
            $tbFields = substr($string, 0, strlen($string) -2);
            //$tbValues = substr($values, 0, strlen($values) -2);
            $questionField = self::convert2Question($question);


            try {

                $query = $this -> pdo ->prepare("INSERT INTO ".$table."(".$tbFields.") VALUES(".$questionField.")");
                $query->execute($val);

                return $query->rowCount();

            } catch(\PDOException $e) {

                echo 'Error '.$e->getMessage();
            }
        }
    }

     private function convert2Question($string) {

        $stringLen = count($string);

        if($stringLen > 0) {

            $joinStr = '';
            for($i=0; $i< $stringLen; $i+=1 ) {

                $joinStr .='?,';
            }

            return substr($joinStr, 0, strlen($joinStr) -1);
        }

    }

}
