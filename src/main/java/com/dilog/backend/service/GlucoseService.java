package com.dilog.backend.service;

import com.dilog.backend.dto.glucose.CreateGlucoseEntryRequest;
import com.dilog.backend.dto.glucose.GlucoseEntryResponse;
import com.dilog.backend.entity.GlucoseEntry;
import com.dilog.backend.entity.User;
import com.dilog.backend.repository.GlucoseEntryRepository;
import com.dilog.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class GlucoseService {

    private final GlucoseEntryRepository glucoseEntryRepository;
    private final UserRepository userRepository;

    public GlucoseService(GlucoseEntryRepository glucoseEntryRepository, UserRepository userRepository) {
        this.glucoseEntryRepository = glucoseEntryRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<GlucoseEntryResponse> getEntries(Long userId) {
        return glucoseEntryRepository.findTop30ByUserIdOrderByTimestampDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public GlucoseEntryResponse createEntry(Long userId, CreateGlucoseEntryRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        GlucoseEntry entry = new GlucoseEntry();
        entry.setUser(user);
        entry.setValue(request.value());
        entry.setTimestamp(LocalDateTime.now());
        entry.setGlucoseRange(null);

        return toResponse(glucoseEntryRepository.save(entry));
    }

    private GlucoseEntryResponse toResponse(GlucoseEntry entry) {
        return new GlucoseEntryResponse(
                entry.getId(),
                entry.getValue(),
                getStatus(entry.getValue()),
                entry.getTimestamp()
        );
    }

    private String getStatus(Float value) {
        if (value < 70) {
            return "Low";
        }
        if (value <= 180) {
            return "In Range";
        }
        return "High";
    }
}
