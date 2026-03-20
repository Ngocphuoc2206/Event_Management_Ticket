package com.envenHub.backend.dto.request;

import lombok.Data;

@Data
public class RegisterRequest {
    private String fullName;
    private String phone;
    private String password;
    private String email;
}
