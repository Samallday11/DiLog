package com.dilog.backend.service;

import com.dilog.backend.dto.activity.ActivityEntryResponse;
import com.dilog.backend.dto.activity.CreateActivityEntryRequest;
import com.dilog.backend.entity.ActivityEntry;
import com.dilog.backend.entity.User;
import com.dilog.backend.repository.ActivityEntryRepository;
import com.dilog.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ActivityService {

    private final ActivityEntryRepository activityEntryRepository;
    private final UserRepository userRepository;

    public ActivityService(ActivityEntryRepository activityEntryRepository, UserRepository userRepository) {
        this.activityEntryRepository = activityEntryRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<ActivityEntryResponse> getActivityEntries(Long userId) {
        return activityEntryRepository.findByUserIdOrderByLoggedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ActivityEntryResponse createActivityEntry(Long userId, CreateActivityEntryRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        ActivityEntry entry = new ActivityEntry();
        entry.setUser(user);
        entry.setCategory(request.category().trim());
        entry.setActivityName(request.activityName() == null || request.activityName().isBlank()
                ? null
                : request.activityName().trim());

        return toResponse(activityEntryRepository.save(entry));
    }

    private ActivityEntryResponse toResponse(ActivityEntry entry) {
        return new ActivityEntryResponse(
                entry.getId(),
                entry.getCategory(),
                entry.getActivityName() == null || entry.getActivityName().isBlank()
                        ? entry.getCategory()
                        : entry.getActivityName(),
                entry.getLoggedAt()
        );
    }
}
