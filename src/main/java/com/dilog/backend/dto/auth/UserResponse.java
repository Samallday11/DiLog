package com.dilog.backend.dto.auth;

public record UserResponse(
        Long id,
        String fullName,
        String email
) {
}
