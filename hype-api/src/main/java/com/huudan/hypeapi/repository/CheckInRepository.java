package com.huudan.hypeapi.repository;

import com.huudan.hypeapi.model.CheckIn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CheckInRepository extends JpaRepository<CheckIn, Long> {
    Optional<CheckIn> findByTicketId(Long ticketId);
    boolean existsByTicketId(Long ticketId);
}
