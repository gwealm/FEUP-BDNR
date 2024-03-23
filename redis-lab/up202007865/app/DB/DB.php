<?php

namespace DB;

use DB\Models\DBModel;

\Predis\Autoloader::register();

class DB {
    protected static \Predis\ClientInterface $client;

    public static function raw(): \Predis\ClientInterface {
        return self::$client;
    }

    static function init() {
        self::$client = new \Predis\Client();
    }

    public static function save(DBModel $dbObject) {
        $dbObject->save(self::$client);
    }

    public static function get(string $class, string $key): ?DBModel {
        return $class::getFromDB(self::$client, $key);
    }
}
DB::init();