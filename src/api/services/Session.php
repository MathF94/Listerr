<?php

namespace Services;

/**
 * Class Session
 * @package Services
 */
class Session
{
    const SESSION_STARTED = TRUE;
    const SESSION_NOT_STARTED = FALSE;

    // The state of the session
    public static $sessionState = self::SESSION_NOT_STARTED;    
    /**
     * (Re)starts the session.
     *
     * @return bool TRUE if the session has been initialized, else FALSE.
     **/
    public static function startSession()
    {
        if (self::$sessionState === self::SESSION_NOT_STARTED) {
            self::$sessionState = session_start();
            return true;
        }
        return false;
    }
    /**
     * Check if the session is active.
     * 
     * @return bool TRUE is session has been activated, else FALSE.
     **/
    public static function isActive()
    {
        return self::$sessionState == self::SESSION_STARTED;
    }

    /**
     * Check if the session is connected.
     *
     * 
     **/

    public static function isConnected()
    {
        return !empty($_SESSION);
    }

    /**
     * Destroys the current session.
     *
     * @return bool TRUE is session has been deleted, else FALSE.
     **/

    public static function destroy()
    {
        if (self::$sessionState == self::SESSION_STARTED) {
            self::$sessionState = !session_destroy();
            unset($_SESSION);

            return !self::$sessionState;
        }
        return false;
    }
}