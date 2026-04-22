package com.dilog.backend.dto.medication;

import java.time.LocalDateTime;

public record MedicationEntryResponse(
        Long id,
        String medicationName,
        String dosage,
        LocalDateTime timeTaken,
        String route,
        String notes,
        LocalDateTime createdAt
) {
}
