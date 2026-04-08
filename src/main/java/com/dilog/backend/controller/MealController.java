package com.dilog.backend.controller;

import com.dilog.backend.dto.meal.CreateMealRequest;
import com.dilog.backend.dto.meal.MealResponse;
import com.dilog.backend.service.MealService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/meals")
public class MealController {

    private final MealService mealService;

    public MealController(MealService mealService) {
        this.mealService = mealService;
    }

    @GetMapping
    public List<MealResponse> getMeals(@PathVariable Long userId) {
        return mealService.getMeals(userId);
    }

    @PostMapping
    public MealResponse createMeal(
            @PathVariable Long userId,
            @Valid @RequestBody CreateMealRequest request
    ) {
        return mealService.createMeal(userId, request);
    }
}
