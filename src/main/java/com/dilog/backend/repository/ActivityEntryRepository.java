package com.dilog.backend.repository;

import com.dilog.backend.entity.ActivityEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityEntryRepository extends JpaRepository<ActivityEntry, Long> {
    List<ActivityEntry> findByUserIdOrderByLoggedAtDesc(Long userId);
}
