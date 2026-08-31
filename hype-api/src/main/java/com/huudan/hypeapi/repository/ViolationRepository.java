package com.huudan.hypeapi.repository;

import com.huudan.hypeapi.model.Violation;
import com.huudan.hypeapi.model.ViolationStatus;
import com.huudan.hypeapi.model.ViolationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ViolationRepository extends JpaRepository<Violation, Long> {
    List<Violation> findByStatus(ViolationStatus status);
    List<Violation> findByType(ViolationType type);
    List<Violation> findAllByOrderByCreatedAtDesc();
    long countByStatus(ViolationStatus status);
}
