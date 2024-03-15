<?php

use Listerr\Controller\HomeController;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

$app->get('/', function (Request $request, Response $response, $args) {
    $home = (new HomeController($request, $response, $args));
    return $home->index();
});

// $app->get('/hello/{name}', function (Request $request, Response $response, $args) {
    //     (new HomeController($request, $response, $args))->hello();
    //     return $response;
    // getBody() = récupère le corps de la réponse
    // write() = setter pour écrire dans le corps (soit string, integer, array, object...)
    // })->setName('hello_world')->setArguments(['name'=>'string']);

