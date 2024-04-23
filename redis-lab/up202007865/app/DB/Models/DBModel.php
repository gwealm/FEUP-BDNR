<?php

namespace DB\Models;

use Predis\ClientInterface;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;

class Key {
    private string $path;

    const SEPARATOR = ':';

    public function __construct(string $path = null) {
        $this->path = $path;
    }

    public function join(Key $key): Key {
        return new Key($this->path. self::SEPARATOR. $key->path);
    }

    public function add(string $path): Key {
        return new Key($this->path . self::SEPARATOR . $path);
    }

    public function __toString(): string {
        return $this->path;
    }


}

abstract class DBModel {

    private string $id;

    protected function __construct(string $id = null) {
        $this->id = $id;
    }

    public function getId(): string {
        return $this->id;
    }

    public static function key(string $id): Key { 
        return static::keyPrefix()->add($id);
    }

    public static function keyPrefix(): Key  {
        return new Key(strtolower(end(explode("\\", get_called_class()))));
    }

    public static abstract function getFromDB(ClientInterface $client, string $id): static;

    protected abstract function _save(ClientInterface $client);
    public function save(ClientInterface $client) {
        # TODO: verify caller context

        $this->_save($client);
    }

}