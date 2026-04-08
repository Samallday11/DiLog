package com.dilog.backend.controller;

import com.dilog.backend.dto.auth.AuthRequest;
import com.dilog.backend.dto.auth.AuthResponse;
import com.dilog.backend.dto.auth.RegisterRequest;
import com.dilog.backend.dto.auth.UserResponse;
import com.dilog.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody AuthRequest request) {
        return authService.login(request);
    }

    @GetMapping("/users/{userId}")
    public UserResponse getUser(@PathVariable Long userId) {
        return authService.getUser(userId);
    }
}
