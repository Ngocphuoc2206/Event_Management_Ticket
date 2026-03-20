package com.envenHub.backend.common;

import lombok.Getter;

@Getter
public enum ErrorCode {
    SUCCESS(1000, "Success"),
    UNAUTHORIZED(1001, "Unauthorized"),
    NOT_FOUND(1002, "Not found!"),
    VALIDATION_ERROR(1003, "Validation Error"),
    EMAIL_ALREADY(1004, "Email already used"),
    PHONE_NUMBER_USED(1005, "Phone number has used"),
    INTERNAL_ERROR (9999, "Internal Error!")
    ;
    private final int code;
    private final String message;
    ErrorCode(int code, String message){
        this.code = code;
        this.message = message;
    }
}
