<?php

namespace Lib;

class Password {
    public static function hash(string $candidate) {
        return password_hash($candidate, PASSWORD_DEFAULT);
    }

    public static function verify(string $candidate, string $hash) {
        return password_verify($candidate, $hash);
    }
}