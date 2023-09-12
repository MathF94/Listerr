<?php 

namespace Controllers;
namespace Services;

session_start();

require("config/config.php");

spl_autoload_register(function($class) {                            // $class = new Controllers\HomeController
    require_once lcfirst(str_replace('\\','/', $class)) . '.php';   // require_once controllers/HomeController.php
});

$router = new Router();
$router->routing();