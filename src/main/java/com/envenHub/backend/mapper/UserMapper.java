package com.envenHub.backend.mapper;

import com.envenHub.backend.dto.request.RegisterRequest;
import com.envenHub.backend.dto.response.UserResponse;
import com.envenHub.backend.entity.User;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(RegisterRequest request);
    UserResponse toUserResponse(User user);
    List<UserResponse> toUserResponseList(List<User> users);
}
