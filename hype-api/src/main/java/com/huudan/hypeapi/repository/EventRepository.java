package com.huudan.hypeapi.repository;

import com.huudan.hypeapi.model.Event;
import com.huudan.hypeapi.model.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    Optional<Event> findBySlug(String slug);
    boolean existsBySlug(String slug);
    List<Event> findByOrganizerId(Long organizerId);
    List<Event> findByStatus(EventStatus status);
    List<Event> findByFeaturedTrueAndStatus(EventStatus status);

    @Query("SELECT e FROM Event e WHERE " +
           "(:category IS NULL OR LOWER(e.category.slug) = LOWER(:category)) AND " +
           "(:city IS NULL OR LOWER(e.venue.city) LIKE LOWER(CONCAT('%', :city, '%')) OR LOWER(e.location) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
           "(:query IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(e.description) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:status IS NULL OR e.status = :status) AND " +
           "e.deletedAt IS NULL " +
           "ORDER BY e.startAt ASC")
    List<Event> searchEvents(@Param("query") String query,
                             @Param("category") String category,
                             @Param("city") String city,
                             @Param("status") EventStatus status);

    long countByStatus(EventStatus status);
}
