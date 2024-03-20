<?php 
    class Session {

        public function __construct() {
            session_start([
                'cookie_httponly' => '1',
                'cookie_samesite' => 'Lax',
                'cookie_secure' => '1',
            ]);
            if (!isset($_SESSION['csrf'])) {

                $_SESSION['csrf'] = bin2hex(openssl_random_pseudo_bytes(32));
            }
        }

        public function set(string $key, mixed $value): void {
            $_SESSION[$key] = $value;
        }

        public function unset(string $key): void {
            unset($_SESSION[$key]);
        }

        public function &get($key): mixed {
            return $_SESSION[$key];
        }

        public function isAuthenticated(): bool {
            return $this->get('user') !== null;
        }
    }
?>