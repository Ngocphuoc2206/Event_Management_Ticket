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
    INVALID_PASSWORD(1011, "Password must be at least 8 characters"),
    EVENT_NOT_FOUND(1012, "Event not found"),
    INVALID_PAGINATION(1013, "Invalid pagination parameter"),
    INVALID_SORT_FIELD(1014, "Invalid sort field"),
    INVALID_EVENT_STATE(1015, "Invalid event state"),
    EVENT_CANNOT_BE_UPDATED(1016, "Event cannot be update!"),
    INVALID_FILE(1021, "File is empty or invalid"),
    INVALID_FILE_TYPE(1022, "Only JPG, PNG, WEBP files are allowed"),
    FILE_TOO_LARGE(1023, "File size exceeds the allowed limit"),
    FILE_UPLOAD_FAILED(1024, "File upload failed"),
    INTERNAL_ERROR (9999, "Internal Error!"),
    ;
    private final int code;

    private final String message;
    ErrorCode(int code, String message){
        this.code = code;
        this.message = message;
    }
}
