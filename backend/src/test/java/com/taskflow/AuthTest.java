package com.taskflow;

import com.taskflow.dto.LoginRequest;
import com.taskflow.entity.User;
import com.taskflow.repository.UserRepository;
import com.taskflow.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest
public class AuthTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthService authService;

    @Test
    void testUserLogin() {
        User user = userRepository.findByEmail("rahul@college.edu").orElse(null);
        System.out.println("USER FOUND: " + (user != null ? user.getEmail() : "null"));
        if (user != null) {
            System.out.println("STORED HASH: " + user.getPasswordHash());
            boolean matches = passwordEncoder.matches("password123", user.getPasswordHash());
            System.out.println("PASSWORD MATCHES: " + matches);
            try {
                authService.login(new LoginRequest("rahul@college.edu", "password123"));
                System.out.println("AUTH_SERVICE_LOGIN_SUCCESS");
            } catch (Exception e) {
                System.out.println("LOGIN_FAILED: " + e.getMessage());
                e.printStackTrace();
            }
        }
    }
}
