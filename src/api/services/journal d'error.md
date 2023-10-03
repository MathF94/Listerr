$ip = '';

                    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
                        $ip = $_SERVER['HTTP_CLIENT_IP'];
                    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
                        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
                    } elseif (!empty($_SERVER['REMOTE_ADDR'])) {
                        $ip = $_SERVER['REMOTE_ADDR'];
                    }
                    error_log(date('d-m-Y H:i:s') . " Erreur: Tentative Faille CSRF détectée. IP: ". $ip . PHP_EOL, 3, "errors.log");

