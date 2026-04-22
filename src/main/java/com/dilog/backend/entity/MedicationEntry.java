package com.dilog.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "medications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicationEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "medication_name", nullable = false, length = 255)
    private String medicationName;

    @Column(nullable = false, length = 100)
    private String dosage;

    @Column(name = "time_taken", nullable = false)
    private LocalDateTime timeTaken;

    @Column(length = 80)
    private String route;

    @Column(length = 500)
    private String notes;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void ensureCreatedAt() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
