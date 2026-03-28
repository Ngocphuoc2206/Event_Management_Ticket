package com.envenHub.backend.dto.request;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    String phone;
    String fullName;
}
