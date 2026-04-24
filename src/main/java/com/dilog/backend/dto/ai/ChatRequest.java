package com.dilog.backend.dto.ai;

import jakarta.validation.constraints.NotBlank;

public record ChatRequest(
        @NotBlank(message = "Message is required")
        String message
) {
}
