<?php

require_once("./config/config.php");

spl_autoload_register(function($class) {                            // $class = new Controllers\HomeController
    require_once lcfirst(str_replace('\\','/', $class)) . '.php';   // require_once controllers/HomeController.php
});

session_start();

$router = new Listerr\Service\Router();
$router->routing();
