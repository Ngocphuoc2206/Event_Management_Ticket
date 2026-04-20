package com.envenHub.backend.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    private String fullName;
    private String phone;

    @Size(min = 8, message = "INVALID_PASSWORD")
    private String password;
    private String email;
}
