package com.dilog.backend.dto.meal;

import java.time.LocalDateTime;
import java.util.List;

public record MealResponse(
        Long id,
        String name,
        String type,
        Integer carbs,
        List<String> tags,
        String notes,
        LocalDateTime loggedAt
) {
}
