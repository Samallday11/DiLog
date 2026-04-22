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
@Table(name = "activities")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "activity_type", nullable = false, length = 80)
    private String category;

    @Column(name = "description", length = 255)
    private String activityName;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime loggedAt;

    @PrePersist
    void ensureLoggedAt() {
        if (loggedAt == null) {
            loggedAt = LocalDateTime.now();
        }
    }
}
