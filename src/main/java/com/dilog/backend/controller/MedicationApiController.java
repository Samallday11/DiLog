package com.dilog.backend.controller;

import com.dilog.backend.dto.medication.CreateMedicationEntryRequest;
import com.dilog.backend.dto.medication.CreateMedicationRequest;
import com.dilog.backend.dto.medication.MedicationEntryResponse;
import com.dilog.backend.dto.medication.MedicationResponse;
import com.dilog.backend.service.MedicationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping({"/api/medications", "/medications"})
public class MedicationApiController {

    private final MedicationService medicationService;

    public MedicationApiController(MedicationService medicationService) {
        this.medicationService = medicationService;
    }

    @GetMapping
    public List<MedicationResponse> getMedications(@RequestParam Long userId) {
        return medicationService.getMedicationEntries(userId)
                .stream()
                .map(entry -> new MedicationResponse(
                        entry.id(),
                        userId,
                        entry.medicationName(),
                        entry.dosage(),
                        entry.timeTaken(),
                        entry.notes(),
                        entry.createdAt()
                ))
                .toList();
    }

    @PostMapping
    public MedicationResponse createMedication(@Valid @RequestBody CreateMedicationRequest request) {
        MedicationEntryResponse entry = medicationService.createMedicationEntry(
                request.userId(),
                new CreateMedicationEntryRequest(
                        request.medicationName(),
                        request.dosage(),
                        request.timeTaken(),
                        null,
                        request.notes()
                )
        );

        return new MedicationResponse(
                entry.id(),
                request.userId(),
                entry.medicationName(),
                entry.dosage(),
                entry.timeTaken(),
                entry.notes(),
                entry.createdAt()
        );
    }
}
