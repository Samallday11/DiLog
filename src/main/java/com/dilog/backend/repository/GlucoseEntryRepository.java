package com.dilog.backend.repository;

import com.dilog.backend.entity.GlucoseEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GlucoseEntryRepository extends JpaRepository<GlucoseEntry, Long> {
    List<GlucoseEntry> findByUserIdOrderByTimestampDesc(Long userId);
}
