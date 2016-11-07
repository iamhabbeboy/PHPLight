<?php
require 'setup.php';
/**
 *  this class renders the page view
 */
class Render {

    private $page_exist = '';
    private $page_hold = array();
    public $template_dir = 'layout/', $view_dir = 'public/', $app_dir = 'db/', $js_dir = 'javascript/', $css_dir = 'styles/css/';

    function __construct() {

    }

    function request_page($p) {

        if (preg_match('/[a-zA-Z0-9]+$/', $p)) {
            $dir = $this -> view_dir . $p . '.php';
            $return = '';

            if (file_exists($dir)) {

                $return = 'true';
            } else {
                $return = 'false';
            }
            return $return;
        }
    }

    function render_page($page, $title) {

        if ($this -> request_page($page) == 'true') {

            $this -> get_page($page, $title);

        } else {

            trigger_error('Exceptional Error occured !');
        }
    }

    function load_class($filename) {

        if (file_exists($filename.'.php')) {

            require $filename .'.php';
        } else {

            trigger_error('Error Occured, Class not found in app dir');
        }   
    }

    /**
     *  load libs such as
     *   stylesheet & javascript
     *
     */
    static function load_lib() {

        $args = func_get_args();
        $ext = $args[0];
        $filename = $args[1];

        if (count($args) == 1 || count($args) > 2) {

            trigger_error("Unable to load libs");

        } else if ($ext == 'js') {

            $dir = BASE_URL . '/javascript/' . $filename;
            print "<script type='text/javascript' src='" . $dir . ".js'></script>";

        } else if ($ext == 'css') {
            $dir = BASE_URL . '/styles/' . $filename;
            print "<link rel='stylesheet' href='" . $dir . ".css' />";
        }
    }

    static function load_multiple_lib() {

        $args = func_get_args();
        $save_list = '';
        $js = BASE_URL . '/javascript/';
        $css = BASE_URL . '/styles/';

        if (count($args) > 2 || count($args) > 2) {

            trigger_error('Unable to process parameters, Only 1 or 2 parameters are required !');
        } else {

            foreach ($args as $key => $value) {

                foreach ($value as $k => $v) {

                    foreach ($v as $ki => $vi) {

                        if ($k === 'js') {

                            $save_list .= "<script src=\"" . $js . $vi . ".js\"></script>";

                        } else if ($k === 'css') {

                            $save_list .= "<link rel=\"stylesheet\" href=\"" . $css . $vi . ".css\"/>";

                        }
                        $save_list .= $k;

                    }
                }
            }

            print "<font color='#FFF'>$save_list</font>";
        }
    }
    
    static function load_lib_multiple() {
        
         $args = func_get_args();
        $save_list = '';
        $js = BASE_URL . '/javascript/';
        $css = BASE_URL . '/styles/';
         $save_list = '';
        
        foreach($args as $key => $value) {
            
            if(preg_match('/css/', $value)) {
                
                $save_list .= "<link rel=\"stylesheet\" href=\"" . $css . $value . "\"/>";
               
            } else if(preg_match('/js/', $value)) {
                
                $save_list .= "<script src=\"" . $js . $value . "\"></script>";
                
            }
        }
        print $save_list;
        
    }

    private function get_page($page, $title) {

        require $this -> template_dir . 'header.php';
        require $this -> view_dir . $page . '.php';
        require $this -> template_dir . '/footer.php';
    }
    

}
