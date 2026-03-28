package com.envenHub.backend.controller;

import com.envenHub.backend.common.ApiResponse;
import com.envenHub.backend.dto.request.UpdateStatusRequest;
import com.envenHub.backend.dto.response.UserResponse;
import com.envenHub.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private UserService userService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public ApiResponse<List<UserResponse>> getAllUsers() {
        List<UserResponse> user = userService.getAllUsers();

        ApiResponse<List<UserResponse>> apiResponse = new ApiResponse<>();
        apiResponse.setResults(user);

        return apiResponse;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users/{id}")
    public ApiResponse<UserResponse> getUserById(@PathVariable String id) {
        UserResponse user = userService.getUserById(id);

        ApiResponse<UserResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResults(user);

        return apiResponse;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/users/{id}/status")
    public ApiResponse<UserResponse> updateUserStatus(
            @PathVariable String id,
            @RequestBody UpdateStatusRequest request
    ) {
        UserResponse user = userService.updateUserStatus(id, request);

        ApiResponse<UserResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResults(user);

        return apiResponse;
    }
}
