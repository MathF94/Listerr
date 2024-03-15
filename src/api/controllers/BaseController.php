<?php

namespace Listerr\Controller;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

abstract class BaseController
{
    protected Request $request;
    protected Response $response;
    protected Array $args;

    public function __construct(Request $request, Response $response, Array $args)
    {
        $this->request = $request;
        $this->response = $response;
        $this->args = $args;
    }
}
