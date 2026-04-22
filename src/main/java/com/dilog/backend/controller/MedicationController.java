package com.dilog.backend.controller;

import com.dilog.backend.dto.medication.CreateMedicationEntryRequest;
import com.dilog.backend.dto.medication.MedicationEntryResponse;
import com.dilog.backend.service.MedicationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/medications")
public class MedicationController {

    private final MedicationService medicationService;

    public MedicationController(MedicationService medicationService) {
        this.medicationService = medicationService;
    }

    @GetMapping
    public List<MedicationEntryResponse> getMedicationEntries(@PathVariable Long userId) {
        return medicationService.getMedicationEntries(userId);
    }

    @PostMapping
    public MedicationEntryResponse createMedicationEntry(
            @PathVariable Long userId,
            @Valid @RequestBody CreateMedicationEntryRequest request
    ) {
        return medicationService.createMedicationEntry(userId, request);
    }
}
