package com.envenHub.backend.controller;

import com.envenHub.backend.common.ApiResponse;
import com.envenHub.backend.dto.request.UpdateStatusRequest;
import com.envenHub.backend.dto.response.PagedResponse;
import com.envenHub.backend.dto.response.UserResponse;
import com.envenHub.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private UserService userService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public ApiResponse<PagedResponse<UserResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<UserResponse> users = userService.getAllUsers(page, size);

        return ApiResponse.<PagedResponse<UserResponse>>builder()
                .results(users)
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users/{id}")
    public ApiResponse<UserResponse> getUserById(@PathVariable String id) {
        UserResponse user = userService.getUserById(id);

        return ApiResponse.<UserResponse>builder()
                .results(user)
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/users/{id}/status")
    public ApiResponse<UserResponse> updateUserStatus(
            @PathVariable String id,
            @RequestBody UpdateStatusRequest request
    ) {
        UserResponse user = userService.updateUserStatus(id, request);

        return ApiResponse.<UserResponse>builder()
                .results(user)
                .build();
    }
}
