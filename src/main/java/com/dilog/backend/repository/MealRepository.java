package com.dilog.backend.repository;

import com.dilog.backend.entity.Meal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MealRepository extends JpaRepository<Meal, Long> {
    List<Meal> findTop30ByUserIdOrderByLoggedAtDesc(Long userId);
}
