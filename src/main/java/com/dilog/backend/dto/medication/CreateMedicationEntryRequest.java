package com.dilog.backend.dto.medication;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record CreateMedicationEntryRequest(
        @NotBlank @Size(max = 255) String medicationName,
        @NotBlank @Size(max = 100) String dosage,
        @NotNull LocalDateTime timeTaken,
        @Size(max = 80) String route,
        @Size(max = 500) String notes
) {
}
