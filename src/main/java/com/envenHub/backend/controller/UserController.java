package com.envenHub.backend.controller;

import com.envenHub.backend.common.ApiResponse;
import com.envenHub.backend.dto.request.LoginRequest;
import com.envenHub.backend.dto.request.RegisterRequest;
import com.envenHub.backend.dto.response.UserResponse;
import com.envenHub.backend.entity.User;
import com.envenHub.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ApiResponse<User> register(@RequestBody RegisterRequest request) {
        User user = userService.register(request);
        ApiResponse<User> apiResponse = new ApiResponse<>();
        apiResponse.setResults(user);
        return apiResponse;
    }

    @PostMapping("/login")
    public ApiResponse<UserResponse> login(@RequestBody LoginRequest request) {
        UserResponse user = userService.login(request);
        ApiResponse<UserResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResults(user);
        return apiResponse;
    }
}
