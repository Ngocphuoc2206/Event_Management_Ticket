package com.envenHub.backend.controller;

import com.envenHub.backend.common.ApiResponse;
import com.envenHub.backend.common.ErrorCode;
import com.envenHub.backend.dto.request.LoginRequest;
import com.envenHub.backend.dto.request.RegisterRequest;
import com.envenHub.backend.dto.request.UpdateProfileRequest;
import com.envenHub.backend.dto.request.UpdateStatusRequest;
import com.envenHub.backend.dto.response.LogoutResponse;
import com.envenHub.backend.dto.response.TokenResponse;
import com.envenHub.backend.dto.response.UserResponse;
import com.envenHub.backend.entity.RefreshToken;
import com.envenHub.backend.entity.User;
import com.envenHub.backend.exception.AppException;
import com.envenHub.backend.repository.RefreshTokenRepository;
import com.envenHub.backend.repository.UserRepository;
import com.envenHub.backend.service.UserService;
import com.envenHub.backend.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/users/me")
    public ApiResponse<UserResponse> getUserProfile(Authentication authentication) {
        UserResponse user = userService.getCurrentUser(authentication);

        ApiResponse<UserResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResults(user);
        return apiResponse;
    }

    @PutMapping("/users/me")
    public ApiResponse<UserResponse> updateUserProfile(
            Authentication authentication,
            @RequestBody UpdateProfileRequest request
    ) {
        UserResponse user = userService.updateProfile(authentication, request);

        ApiResponse<UserResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResults(user);
        return apiResponse;
    }

    @PostMapping("/register")
    public ApiResponse<UserResponse> register(@RequestBody RegisterRequest request) {
        User user = userService.register(request);

        UserResponse userResponse = new UserResponse(user);

        ApiResponse<UserResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResults(userResponse);
        return apiResponse;
    }

    @PostMapping("/login")
    public ApiResponse<TokenResponse> login(
            @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        UserResponse user = userService.login(request);

        // Generate token
        String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getRole());
        String refreshToken = jwtUtil.generateRefreshToken(user.getId());

        // Save refreshToken to database
        RefreshToken rt = new RefreshToken();
        rt.setUserId(user.getId());
        rt.setToken(refreshToken);
        rt.setExpiryDate(LocalDateTime.now()
                .plus(Duration.ofMillis(jwtUtil.getRefreshExpiration())));
        refreshTokenRepository.save(rt);

        // Save refreshToken to HttpOnly Cookie
        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // true for https, false for http
        cookie.setPath("/auth/refresh");
        cookie.setMaxAge((int) (jwtUtil.getRefreshExpiration() / 1000));

        response.addCookie(cookie);

        TokenResponse tokenResponse = new TokenResponse(accessToken);

        // Return access token
        ApiResponse<TokenResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResults(tokenResponse);
        return apiResponse;
    }

    @PostMapping("/refresh")
    public ApiResponse<TokenResponse> refresh(
        @CookieValue(value = "refreshToken", required = false) String refreshToken,
        HttpServletResponse response
    ) {
        if (refreshToken == null || !jwtUtil.validateToken(refreshToken)) {
            throw new AppException(ErrorCode.INVALID_REFRESH_TOKEN);
        }

        String userId = jwtUtil.getUserIdFromToken(refreshToken);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        //Generate new token
        String newAccessToken = jwtUtil.generateAccessToken(userId, user.getRole());
        String newRefreshToken = jwtUtil.generateRefreshToken(userId);

        Optional<RefreshToken> storedToken = refreshTokenRepository.findByToken(refreshToken);

        // Delete old refreshToken
        storedToken.ifPresent(refreshTokenRepository::delete);

        // Save new refreshToken
        RefreshToken newRt =new RefreshToken();
        newRt.setToken(newRefreshToken);
        newRt.setUserId(userId);
        newRt.setExpiryDate(LocalDateTime.now()
                .plus(Duration.ofMillis(jwtUtil.getRefreshExpiration())));
        refreshTokenRepository.save(newRt);

        // Set new cookie
        Cookie cookie = new Cookie("refreshToken", newRefreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/auth/refresh");
        cookie.setMaxAge((int) (jwtUtil.getRefreshExpiration() / 1000));
        response.addCookie(cookie);

        // Return new access token
        TokenResponse tokenResponse = new TokenResponse(newAccessToken);

        ApiResponse<TokenResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResults(tokenResponse);
        return apiResponse;
    }

    @PostMapping("/logout")
    public ApiResponse<LogoutResponse> logout(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        // Get cookie
        Cookie[] cookies = request.getCookies();
        String refreshToken = null;

        if(cookies != null) {
            for (Cookie cookie : cookies) {
                if("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                }
            }
        }

        // Delete refreshToken from database
        if (refreshToken != null) {
            refreshTokenRepository.findByToken(refreshToken)
                    .ifPresent(refreshTokenRepository::delete);
        }

        // Delete cookie from browser
        Cookie deleteCookie = new Cookie("refreshToken", null);
        deleteCookie.setHttpOnly(true);
        deleteCookie.setSecure(false);
        deleteCookie.setPath("/auth/refresh");
        deleteCookie.setMaxAge(0);

        response.addCookie(deleteCookie);

        LogoutResponse logoutResponse = new LogoutResponse("Log out Successfully");

        ApiResponse<LogoutResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResults(logoutResponse);

        return apiResponse;
    }



}
