<?php

namespace Services;

Class Includes
{
    public function changeDomain()
    {
        if (in_array('http://localhost', [$_SERVER['HTTP_HOST'], $_SERVER['HTTP_REFERER'], $_SERVER['HTTP_ORIGIN']], true)) {
            return $domain = "http://localhost/listerr/src/app/src";
        } else {
            return $domain = "https://listerr.tea-tux.fr";
        }
    }
}