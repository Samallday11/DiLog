package com.dilog.backend.dto.activity;

import java.time.LocalDateTime;

public record ActivityEntryResponse(
        Long id,
        String category,
        String activityName,
        LocalDateTime loggedAt
) {
}
