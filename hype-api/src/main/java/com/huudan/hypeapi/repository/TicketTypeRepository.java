package com.huudan.hypeapi.repository;

import com.huudan.hypeapi.model.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TicketTypeRepository extends JpaRepository<TicketType, Long> {
    List<TicketType> findByEventId(Long eventId);
    List<TicketType> findByEventIdAndDeletedAtIsNull(Long eventId);
}
