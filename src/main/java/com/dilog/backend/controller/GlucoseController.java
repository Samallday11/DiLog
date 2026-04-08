package com.dilog.backend.controller;

import com.dilog.backend.dto.glucose.CreateGlucoseEntryRequest;
import com.dilog.backend.dto.glucose.GlucoseEntryResponse;
import com.dilog.backend.service.GlucoseService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/glucose")
public class GlucoseController {

    private final GlucoseService glucoseService;

    public GlucoseController(GlucoseService glucoseService) {
        this.glucoseService = glucoseService;
    }

    @GetMapping
    public List<GlucoseEntryResponse> getEntries(@PathVariable Long userId) {
        return glucoseService.getEntries(userId);
    }

    @PostMapping
    public GlucoseEntryResponse createEntry(
            @PathVariable Long userId,
            @Valid @RequestBody CreateGlucoseEntryRequest request
    ) {
        return glucoseService.createEntry(userId, request);
    }
}
