package com.envenHub.backend.config;

import com.envenHub.backend.common.ErrorCode;
import com.envenHub.backend.constant.PredefinedAccount;
import com.envenHub.backend.constant.RoleName;
import com.envenHub.backend.entity.User;
import com.envenHub.backend.enums.EventStatus;
import com.envenHub.backend.enums.UserStatus;
import com.envenHub.backend.exception.AppException;
import com.envenHub.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@Slf4j
@RequiredArgsConstructor
public class ApplicationInitConfig {

    private final PasswordEncoder passwordEncoder;

    @Bean
    @ConditionalOnProperty(
            prefix = "spring.datasource",
            value = "driver-class-name",
            havingValue = "com.mysql.cj.jdbc.Driver"
    )
    ApplicationRunner applicationRunner(UserRepository userRepository){
        log.info("Initializing application....");
        return args -> {
            if (userRepository.findByRole(RoleName.ADMIN).isEmpty()){
                User user = User.builder()
                        .email(PredefinedAccount.ADMIN_USER_NAME)
                        .password(passwordEncoder.encode(PredefinedAccount.ADMIN_PASSWORD))
                        .role(RoleName.ADMIN)
                        .fullName(RoleName.ADMIN)
                        .phone("0000000000")
                        .status(UserStatus.ACTIVE)
                        .build();
                userRepository.save(user);
                log.warn("admin user has been created with default password: admin, please change it");
            }

            if (userRepository.findByRole(RoleName.ORGANIZER).isEmpty()){
                User user = User.builder()
                        .email(PredefinedAccount.ORGANIZER_USER_NAME)
                        .password(passwordEncoder.encode(PredefinedAccount.ORGANIZER_PASSWORD))
                        .role(RoleName.ORGANIZER)
                        .fullName(RoleName.ORGANIZER)
                        .phone("0000000000")
                        .status(UserStatus.ACTIVE)
                        .build();
                userRepository.save(user);
                log.warn("Organizer has been created with default password: organizer, please change it");
            }
            log.info("Application initialization completed .....");
        };
    }

}
