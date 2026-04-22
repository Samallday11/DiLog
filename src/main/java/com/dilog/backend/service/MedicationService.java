package com.dilog.backend.service;

import com.dilog.backend.dto.medication.CreateMedicationEntryRequest;
import com.dilog.backend.dto.medication.MedicationEntryResponse;
import com.dilog.backend.entity.MedicationEntry;
import com.dilog.backend.entity.User;
import com.dilog.backend.repository.MedicationEntryRepository;
import com.dilog.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class MedicationService {

    private final MedicationEntryRepository medicationEntryRepository;
    private final UserRepository userRepository;

    public MedicationService(
            MedicationEntryRepository medicationEntryRepository,
            UserRepository userRepository
    ) {
        this.medicationEntryRepository = medicationEntryRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<MedicationEntryResponse> getMedicationEntries(Long userId) {
        return medicationEntryRepository.findByUserIdOrderByTimeTakenDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public MedicationEntryResponse createMedicationEntry(Long userId, CreateMedicationEntryRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        MedicationEntry entry = new MedicationEntry();
        entry.setUser(user);
        entry.setMedicationName(request.medicationName().trim());
        entry.setDosage(request.dosage().trim());
        entry.setTimeTaken(request.timeTaken());
        entry.setRoute(request.route() == null || request.route().isBlank() ? null : request.route().trim());
        entry.setNotes(request.notes() == null || request.notes().isBlank() ? null : request.notes().trim());

        return toResponse(medicationEntryRepository.save(entry));
    }

    private MedicationEntryResponse toResponse(MedicationEntry entry) {
        return new MedicationEntryResponse(
                entry.getId(),
                entry.getMedicationName(),
                entry.getDosage(),
                entry.getTimeTaken(),
                entry.getRoute(),
                entry.getNotes(),
                entry.getCreatedAt()
        );
    }
}
