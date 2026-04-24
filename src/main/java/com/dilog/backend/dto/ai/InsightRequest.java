package com.dilog.backend.dto.ai;

public record InsightRequest(
        Float glucose,
        String activity,
        String medication
) {
}
