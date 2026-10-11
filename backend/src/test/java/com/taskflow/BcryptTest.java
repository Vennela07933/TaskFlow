package com.taskflow;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class BcryptTest {

    @Test
    void printHash() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println("HASH_PASSWORD_123: " + encoder.encode("password123"));
        System.out.println("HASH_PASSWORD_AT_123: " + encoder.encode("Password@123"));
    }
}
