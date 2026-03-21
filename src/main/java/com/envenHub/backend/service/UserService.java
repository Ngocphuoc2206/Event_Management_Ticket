package com.envenHub.backend.service;

import com.envenHub.backend.common.ErrorCode;
import com.envenHub.backend.dto.request.LoginRequest;
import com.envenHub.backend.dto.request.RegisterRequest;
import com.envenHub.backend.dto.response.UserResponse;
import com.envenHub.backend.exception.AppException;
import com.envenHub.backend.entity.User;
import com.envenHub.backend.mapper.UserMapper;
import com.envenHub.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserMapper userMapper;

    public User register(RegisterRequest request) {
        if(userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new AppException(ErrorCode.EMAIL_ALREADY);
        }

        if (userRepository.findByPhone(request.getPhone()).isPresent()) {
            throw new AppException(ErrorCode.PHONE_NUMBER_USED);
        }

        //Map user
        User user = userMapper.toUser(request);

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        //Set role for user
        user.setRole("CUSTOMER");

        return userRepository.save(user);
    }

    public UserResponse login(LoginRequest request) {
        User logUser = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_NOT_FOUND));

        if (!passwordEncoder.matches(request.getPassword(), logUser.getPassword())) {
            throw new AppException(ErrorCode.INCORRECT_PASSWORD);
        }

        //Map user
        return userMapper.toUserResponse(logUser);
    }
}
