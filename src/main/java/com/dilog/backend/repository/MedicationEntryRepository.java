package com.dilog.backend.repository;

import com.dilog.backend.entity.MedicationEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicationEntryRepository extends JpaRepository<MedicationEntry, Long> {
    List<MedicationEntry> findByUserIdOrderByTimeTakenDesc(Long userId);
}
