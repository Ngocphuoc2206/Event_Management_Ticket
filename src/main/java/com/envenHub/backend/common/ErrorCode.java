package com.envenHub.backend.common;

import lombok.Getter;

@Getter
public enum ErrorCode {
    SUCCESS(1000, "Success"),
    UNAUTHORIZED(1001, "Unauthorized"),
    NOT_FOUND(1002, "Not found!"),
    VALIDATION_ERROR(1003, "Validation Error"),
    EMAIL_ALREADY(1004, "Email already used"),
    EMAIL_NOT_FOUND(1005, "Email not found!"),
    PHONE_NUMBER_USED(1006, "Phone number has used"),
    INCORRECT_PASSWORD (1007, "Incorrect password!"),
    INVALID_REFRESH_TOKEN (1008, "Invalid Refresh Token"),
    USER_NOT_FOUND (1009, "User not found"),
    USER_NOT_AUTHENTICATED(1010, "User not authenticated"),
    INVALID_PASSWORD(1008, "Password must be at least 8 characters"),
    INVALID_REFRESH_TOKEN (1009, "Invalid Refresh Token"),
    USER_NOT_FOUND (1010, "User not found"),
    EVENT_NOT_FOUND(1011, "Event not found"),
    INTERNAL_ERROR (9999, "Internal Error!"),
    INVALID_PAGINATION(1012, "Invalid pagination parameter"),
    INVALID_SORT_FIELD(1013, "Invalid sort field")
    ;
    private final int code;

    private final String message;
    ErrorCode(int code, String message){
        this.code = code;
        this.message = message;
    }
}
