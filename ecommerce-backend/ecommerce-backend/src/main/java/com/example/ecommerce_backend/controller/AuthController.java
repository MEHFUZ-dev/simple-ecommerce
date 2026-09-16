package com.example.ecommerce_backend.controller;

import com.example.ecommerce_backend.dto.LoginRequest;
import com.example.ecommerce_backend.dto.LoginResponse;
import com.example.ecommerce_backend.dto.RegisterRequest;
import com.example.ecommerce_backend.entity.User;
import com.example.ecommerce_backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestBody RegisterRequest request) {

        User user = authService.register(request);

        return ResponseEntity.ok(
                "User registered successfully: " + user.getUsername()
        );
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }

    @GetMapping("/profile")
    public ResponseEntity<User> profile(Authentication authentication) {

        String username = authentication.getName();

        User user = authService.getUserByUsername(username);

        return ResponseEntity.ok(user);
    }

}