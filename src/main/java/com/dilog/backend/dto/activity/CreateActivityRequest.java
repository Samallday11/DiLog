package com.dilog.backend.dto.activity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateActivityRequest(
        @NotNull Long userId,
        @NotBlank @Size(max = 80) String activityType,
        @Size(max = 255) String description
) {
}
