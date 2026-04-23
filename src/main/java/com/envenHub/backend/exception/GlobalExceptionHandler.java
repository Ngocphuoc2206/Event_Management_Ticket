package com.envenHub.backend.exception;

import com.envenHub.backend.common.ApiResponse;
import com.envenHub.backend.common.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Objects;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // Catch all exception (fallback)
    @ExceptionHandler(value = Exception.class)
    ResponseEntity<ApiResponse<String>> handlingRuntimeException(Exception exception) {

        log.error("Unhandled Exception occurred", exception);

        ApiResponse<String> apiResponse = new ApiResponse<>();
        apiResponse.setCode(9998);
        apiResponse.setMessage("Internal server error");

        return ResponseEntity.badRequest().body(apiResponse);
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse<String>> handlingMethodArgumentNotValidException(
            MethodArgumentNotValidException exception
    ) {
        String enumKey = Objects.requireNonNull(exception.getFieldError()).getDefaultMessage();

        log.warn("Validation failed: field={}, messageKey={}",
                exception.getFieldError().getField(),
                enumKey
        );

        ErrorCode errorCode = ErrorCode.valueOf(enumKey);

        ApiResponse<String> apiResponse = new ApiResponse<>();
        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(errorCode.getMessage());

        return ResponseEntity.badRequest().body(apiResponse);
    }

    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse<String>> handlingAppException(AppException exception) {

        ErrorCode errorCode = exception.getErrorCode();

        log.warn("AppException occurred: code={}, message={}",
                errorCode.getCode(),
                errorCode.getMessage()
        );

        ApiResponse<String> apiResponse = new ApiResponse<>();
        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(errorCode.getMessage());

        return ResponseEntity.badRequest().body(apiResponse);
    }
}