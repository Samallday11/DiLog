package com.dilog.backend.dto.glucose;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CreateGlucoseEntryRequest(
        @NotNull @Min(20) @Max(600) Float value
) {
}
