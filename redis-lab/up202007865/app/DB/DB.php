<?php

namespace DB;

use DB\Models\DBModel;
use DB\Models\Key;

\Predis\Autoloader::register();

class DB {

    /**
     * @var DBModel[]
     */
    private array $models;

    private \Predis\ClientInterface $client;

    private static ?DB $instance = null;

    public function raw(): \Predis\ClientInterface {
        return $this->client;
    }

    public static function instance(): DB {
        if (static::$instance === null) {
            static::$instance = new static();
        }   

        return static::$instance;
    }

    private function __construct() {
        $this->models = [];

        $this->client = new \Predis\Client();
    }

    public function save(DBModel $dbObject) {

        $dbObject->save($this->client);
        
        // In case we updated the model, this will update the model saved on the DB models list.
        $this->models[(string) $dbObject->key($dbObject->getId())] = $dbObject;
    }

    public function get(string $key): ?DBModel {
        return $this->models[$key] ?? null;
    }
}