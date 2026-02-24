package com.dilog.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "glucose_ranges")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GlucoseRange {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Float min;

    @Column(nullable = false)
    private Float max;

    @Column(length = 50)
    private String label;
}