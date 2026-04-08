package com.dilog.backend.service;

import com.dilog.backend.dto.meal.CreateMealRequest;
import com.dilog.backend.dto.meal.MealResponse;
import com.dilog.backend.entity.Meal;
import com.dilog.backend.entity.User;
import com.dilog.backend.repository.MealRepository;
import com.dilog.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
public class MealService {

    private final MealRepository mealRepository;
    private final UserRepository userRepository;

    public MealService(MealRepository mealRepository, UserRepository userRepository) {
        this.mealRepository = mealRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<MealResponse> getMeals(Long userId) {
        return mealRepository.findTop30ByUserIdOrderByLoggedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public MealResponse createMeal(Long userId, CreateMealRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Meal meal = new Meal();
        meal.setUser(user);
        meal.setName(request.name().trim());
        meal.setType(request.type().trim());
        meal.setCalories(null);
        meal.setNotes(request.notes() == null ? null : request.notes().trim());
        meal.setTags(request.tags() == null ? new String[0] : request.tags().toArray(String[]::new));
        meal.setMacros(toMacrosJson(request.carbs()));
        meal.setLoggedAt(LocalDateTime.now());

        return toResponse(mealRepository.save(meal));
    }

    private MealResponse toResponse(Meal meal) {
        return new MealResponse(
                meal.getId(),
                meal.getName(),
                meal.getType(),
                parseCarbs(meal.getMacros()),
                meal.getTags() == null ? List.of() : Arrays.asList(meal.getTags()),
                meal.getNotes(),
                meal.getLoggedAt()
        );
    }

    private String toMacrosJson(Integer carbs) {
        int carbValue = carbs == null ? 0 : carbs;
        return "{\"carbs\":" + carbValue + "}";
    }

    private Integer parseCarbs(String macros) {
        if (macros == null || macros.isBlank()) {
            return 0;
        }

        String normalized = macros.replaceAll("[^0-9]", "");
        if (normalized.isBlank()) {
            return 0;
        }
        return Integer.parseInt(normalized);
    }
}
