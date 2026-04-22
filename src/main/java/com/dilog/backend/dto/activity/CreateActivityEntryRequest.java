package com.dilog.backend.dto.activity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateActivityEntryRequest(
        @NotBlank @Size(max = 80) String category,
        @NotBlank @Size(max = 255) String activityName
) {
}
