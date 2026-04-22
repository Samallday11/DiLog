package com.dilog.backend.controller;

import com.dilog.backend.dto.activity.ActivityEntryResponse;
import com.dilog.backend.dto.activity.ActivityResponse;
import com.dilog.backend.dto.activity.CreateActivityEntryRequest;
import com.dilog.backend.dto.activity.CreateActivityRequest;
import com.dilog.backend.service.ActivityService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping({"/api/activities", "/activities"})
public class ActivityApiController {

    private final ActivityService activityService;

    public ActivityApiController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping
    public List<ActivityResponse> getActivities(@RequestParam Long userId) {
        return activityService.getActivityEntries(userId)
                .stream()
                .map(entry -> new ActivityResponse(
                        entry.id(),
                        userId,
                        entry.category(),
                        entry.activityName(),
                        entry.loggedAt()
                ))
                .toList();
    }

    @PostMapping
    public ActivityResponse createActivity(@Valid @RequestBody CreateActivityRequest request) {
        ActivityEntryResponse entry = activityService.createActivityEntry(
                request.userId(),
                new CreateActivityEntryRequest(
                        request.activityType(),
                        request.description() == null || request.description().isBlank()
                                ? request.activityType()
                                : request.description()
                )
        );

        return new ActivityResponse(
                entry.id(),
                request.userId(),
                entry.category(),
                entry.activityName(),
                entry.loggedAt()
        );
    }
}
