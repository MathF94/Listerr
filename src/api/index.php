<?php

/*
 * listerr - gestionnaire de listes et tâches
 * Copyright (C) 2025 Mathieu Fagot
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

require_once("./config/config.php");
require_once("./vendor/autoload.php");

spl_autoload_register(function($class) {                            // $class = new Controllers\HomeController
    require_once lcfirst(str_replace('\\','/', $class)) . '.php';   // require_once controllers/HomeController.php
});

session_start();

$router = new Services\Router();
$router->routing();
