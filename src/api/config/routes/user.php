<?php

use Listerr\Controller\UserController;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

$app->post('/csrf', function (Request $request, Response $response, $args) {
    (new UserController($request, $response, $args))->CSRFToken();
    return $response;
});

$app->post('/user/register', function (Request $request, Response $response, $args) {
    (new UserController($request, $response, $args))->register();
    return $response;
});

$app->post('/user/login', function (Request $request, Response $response, $args) {
    (new UserController($request, $response, $args))->login();
    return $response;
});

$app->post('/user/logout', function (Request $request, Response $response, $args) {
    (new UserController($request, $response, $args))->logout();
    return $response;
});

$app->get('/user/profil', function (Request $request, Response $response, $args) {
    (new UserController($request, $response, $args))->logout($request->getHeaderLine('Authorization'));
    return $response;
});

// $app->get('/hello/{name}', function (Request $request, Response $response, $args) {
//     (new HomeController($request, $response, $args))->hello();
//     return $response;
// })->setName('hello_world')->setArguments(['name'=>'string']);

