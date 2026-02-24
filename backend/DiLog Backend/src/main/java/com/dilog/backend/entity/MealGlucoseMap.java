package com.dilog.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "meal_glucose_map")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MealGlucoseMap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meal_id")
    private Meal meal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "glucose_range_id")
    private GlucoseRange glucoseRange;

    private Integer priority;
}