package com.dilog.backend.dto.medication;

import java.time.LocalDateTime;

public record MedicationResponse(
        Long id,
        Long userId,
        String medicationName,
        String dosage,
        LocalDateTime timeTaken,
        String notes,
        LocalDateTime createdAt
) {
}
