package com.dilog.backend.dto.activity;

import java.time.LocalDateTime;

public record ActivityResponse(
        Long id,
        Long userId,
        String activityType,
        String description,
        LocalDateTime createdAt
) {
}
