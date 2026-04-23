package com.envenHub.backend.service;

import com.envenHub.backend.common.ErrorCode;
import com.envenHub.backend.constant.RoleName;
import com.envenHub.backend.dto.request.LoginRequest;
import com.envenHub.backend.dto.request.RegisterRequest;
import com.envenHub.backend.dto.request.UpdateProfileRequest;
import com.envenHub.backend.dto.request.UpdateStatusRequest;
import com.envenHub.backend.dto.response.PagedResponse;
import com.envenHub.backend.dto.response.UserResponse;
import com.envenHub.backend.enums.UserStatus;
import com.envenHub.backend.exception.AppException;
import com.envenHub.backend.entity.User;
import com.envenHub.backend.mapper.UserMapper;
import com.envenHub.backend.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserMapper userMapper;

    public User register(RegisterRequest request) {
        log.info("register called: email={}, phone={}", request.getEmail(), request.getPhone());

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            log.warn("register failed: email already exists, email={}", request.getEmail());
            throw new AppException(ErrorCode.EMAIL_ALREADY);
        }

        if (userRepository.findByPhone(request.getPhone()).isPresent()) {
            log.warn("register failed: phone already used, phone={}", request.getPhone());
            throw new AppException(ErrorCode.PHONE_NUMBER_USED);
        }

        User user = userMapper.toUser(request);

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(RoleName.CUSTOMER);
        user.setStatus(UserStatus.ACTIVE);

        User savedUser = userRepository.save(user);

        log.info("register success: userId={}, email={}", savedUser.getId(), savedUser.getEmail());

        return savedUser;
    }

    public UserResponse login(LoginRequest request) {
        log.info("login called: email={}", request.getEmail());

        User logUser = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.warn("login failed: email not found, email={}", request.getEmail());
                    return new AppException(ErrorCode.EMAIL_NOT_FOUND);
                });

        if (!passwordEncoder.matches(request.getPassword(), logUser.getPassword())) {
            log.warn("login failed: incorrect password, email={}", request.getEmail());
            throw new AppException(ErrorCode.INCORRECT_PASSWORD);
        }

        log.info("login success: userId={}, email={}", logUser.getId(), logUser.getEmail());

        return userMapper.toUserResponse(logUser);
    }

    public UserResponse getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            log.warn("getCurrentUser failed: user not authenticated");
            throw new AppException(ErrorCode.USER_NOT_AUTHENTICATED);
        }

        String userId = authentication.getName();
        log.info("getCurrentUser called: userId={}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("getCurrentUser failed: user not found, userId={}", userId);
                    return new AppException(ErrorCode.USER_NOT_FOUND);
                });

        log.info("getCurrentUser success: userId={}", userId);

        return userMapper.toUserResponse(user);
    }

    public UserResponse updateProfile(Authentication authentication, UpdateProfileRequest request) {
        if (authentication == null || !authentication.isAuthenticated()) {
            log.warn("updateProfile failed: user not authenticated");
            throw new AppException(ErrorCode.USER_NOT_AUTHENTICATED);
        }

        String userId = authentication.getName();
        log.info("updateProfile called: userId={}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("updateProfile failed: user not found, userId={}", userId);
                    return new AppException(ErrorCode.USER_NOT_FOUND);
                });

        user.setPhone(request.getPhone());
        user.setFullName(request.getFullName());

        userRepository.save(user);

        log.info("updateProfile success: userId={}", userId);

        return userMapper.toUserResponse(user);
    }

    // Admin service
    public PagedResponse<UserResponse> getAllUsers(int page, int size) {
        log.info("getAllUsers called: page={}, size={}", page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<User> pageResult = userRepository.findAll(pageable);

        List<UserResponse> users = userMapper.toUserResponseList(pageResult.getContent());

        log.info(
                "getAllUsers success: returnedItems={}, totalItems={}, totalPages={}",
                users.size(), pageResult.getTotalElements(), pageResult.getTotalPages()
        );

        return PagedResponse.<UserResponse>builder()
                .items(users)
                .page(pageResult.getNumber())
                .size(pageResult.getSize())
                .totalItems(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .hasNext(pageResult.hasNext())
                .build();
    }

    public UserResponse getUserById(String id) {
        log.info("getUserById called: userId={}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("getUserById failed: user not found, userId={}", id);
                    return new AppException(ErrorCode.USER_NOT_FOUND);
                });

        log.info("getUserById success: userId={}", id);

        return userMapper.toUserResponse(user);
    }

    public UserResponse updateUserStatus(String id, UpdateStatusRequest request) {
        log.info("updateUserStatus called: userId={}, status={}", id, request.getStatus());

        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("updateUserStatus failed: user not found, userId={}", id);
                    return new AppException(ErrorCode.USER_NOT_FOUND);
                });

        user.setStatus(UserStatus.valueOf(request.getStatus()));
        userRepository.save(user);

        log.info("updateUserStatus success: userId={}, newStatus={}", id, user.getStatus());

        return userMapper.toUserResponse(user);
    }
}