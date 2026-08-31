package com.huudan.hypeapi.repository;

import com.huudan.hypeapi.model.Ticket;
import com.huudan.hypeapi.model.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    Optional<Ticket> findByTicketCode(String ticketCode);
    Optional<Ticket> findByQrToken(String qrToken);

    @Query("SELECT t FROM Ticket t WHERE t.orderItem.order.user.id = :userId")
    List<Ticket> findByUserId(@Param("userId") Long userId);

    @Query("SELECT t FROM Ticket t WHERE t.orderItem.ticketType.event.id = :eventId")
    List<Ticket> findByEventId(@Param("eventId") Long eventId);

    long countByStatus(TicketStatus status);
}
