package com.envenHub.backend.controller;

import com.envenHub.backend.dto.RegisterRequest;
import com.envenHub.backend.model.User;
import com.envenHub.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {

        User user = new User(req.getFullName(), req.getEmail(), req.getPhone(), req.getPassword());

        User saved = authService.register(user);

        return ResponseEntity.ok(saved);
    }
}
