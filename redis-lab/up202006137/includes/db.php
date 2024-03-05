<?php

require __DIR__ . '/../vendor/autoload.php';

Predis\Autoloader::register();

class Database {
    private \Predis\Client $client;

    public function __construct() {
        $this->client = new Predis\Client();
    }

    public function get_client() {
        return $this->client;
    }
}

?>
