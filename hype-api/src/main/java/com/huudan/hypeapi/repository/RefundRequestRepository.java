package com.huudan.hypeapi.repository;

import com.huudan.hypeapi.model.RefundRequest;
import com.huudan.hypeapi.model.RefundStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RefundRequestRepository extends JpaRepository<RefundRequest, Long> {
    Optional<RefundRequest> findByOrderId(Long orderId);
    List<RefundRequest> findByUserId(Long userId);
    List<RefundRequest> findByStatus(RefundStatus status);

    @Query("SELECT r FROM RefundRequest r WHERE r.order.event.organizer.id = :organizerId")
    List<RefundRequest> findByOrganizerId(@Param("organizerId") Long organizerId);

    long countByStatus(RefundStatus status);
}
