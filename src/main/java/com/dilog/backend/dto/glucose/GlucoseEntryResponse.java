package com.dilog.backend.dto.glucose;

import java.time.LocalDateTime;

public record GlucoseEntryResponse(
        Long id,
        Float value,
        String status,
        LocalDateTime timestamp
) {
}
