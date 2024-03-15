<?php

namespace Listerr\Controller;

use Slim\Psr7\Response;

final class HomeController extends BaseController
{
    public function index(): Response
    {
        $this->response->getBody()->write("Bienvenue sur Listerr");
        return $this->response;
    }
}
