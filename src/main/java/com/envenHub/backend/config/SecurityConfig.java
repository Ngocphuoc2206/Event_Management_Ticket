package com.envenHub.backend.config;

import com.envenHub.backend.Security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    // PermitAll endpoints;
    public static final String[] PUBLIC_ENDPOINTS = {
            "/api/health",
            "/api/logout",
            "/auth/register",
            "/auth/login",
            "/auth/refresh"
    };

    // Authenticated endpoints
    public static final String[] ADMIN_ENDPOINTS = {
            "/auth/admin/**",
    };

    public static final String[] ORGANIZER_ENDPOINTS = {
            "/organizer/"
    };

    public static final String[] PRIVATE_ENDPOINTS = {
            "/users/me"
    };

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Turn off CSRF
                .csrf(AbstractHttpConfigurer::disable)

                .cors(cors -> {})

                .authorizeHttpRequests(auth -> auth
                                //API public
                                .requestMatchers(PUBLIC_ENDPOINTS).permitAll()

                                // API authenticated
                                .requestMatchers(ORGANIZER_ENDPOINTS).hasRole("ORGANIZER")
                                .requestMatchers(ADMIN_ENDPOINTS).hasRole("ADMIN")
                                .requestMatchers(PRIVATE_ENDPOINTS).authenticated()
                                .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

                // HTTP Basic
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable);

        return http.build();
    }
}