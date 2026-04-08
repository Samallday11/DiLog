package com.dilog.backend.dto.meal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreateMealRequest(
        @NotBlank @Size(max = 255) String name,
        @NotBlank @Size(max = 50) String type,
        Integer carbs,
        List<String> tags,
        @Size(max = 500) String notes
) {
}
