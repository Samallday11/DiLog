package com.dilog.backend.controller;

import com.dilog.backend.dto.activity.ActivityEntryResponse;
import com.dilog.backend.dto.activity.CreateActivityEntryRequest;
import com.dilog.backend.service.ActivityService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/activities")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping
    public List<ActivityEntryResponse> getActivityEntries(@PathVariable Long userId) {
        return activityService.getActivityEntries(userId);
    }

    @PostMapping
    public ActivityEntryResponse createActivityEntry(
            @PathVariable Long userId,
            @Valid @RequestBody CreateActivityEntryRequest request
    ) {
        return activityService.createActivityEntry(userId, request);
    }
}
