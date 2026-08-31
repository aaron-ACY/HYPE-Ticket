package com.huudan.hypeapi.service;

import com.huudan.hypeapi.dto.AdminAnalyticsDto;
import com.huudan.hypeapi.model.EventStatus;
import com.huudan.hypeapi.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
public class AdminAnalyticsService {

    private final OrderRepository orderRepository;
    private final TicketRepository ticketRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final OrganizerProfileRepository organizerProfileRepository;

    @Autowired
    public AdminAnalyticsService(OrderRepository orderRepository,
                                 TicketRepository ticketRepository,
                                 EventRepository eventRepository,
                                 UserRepository userRepository,
                                 OrganizerProfileRepository organizerProfileRepository) {
        this.orderRepository = orderRepository;
        this.ticketRepository = ticketRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.organizerProfileRepository = organizerProfileRepository;
    }

    @Transactional(readOnly = true)
    public AdminAnalyticsDto getAnalyticsOverview() {
        BigDecimal totalGmv = orderRepository.calculateTotalGrossMerchandiseValue();
        if (totalGmv == null) totalGmv = BigDecimal.ZERO;

        BigDecimal totalPlatformFee = totalGmv.multiply(BigDecimal.valueOf(0.05)); // 5% fee sàn
        long totalTicketsSold = ticketRepository.count();
        long totalEvents = eventRepository.count();
        long activeEvents = eventRepository.countByStatus(EventStatus.PUBLISHED);
        long totalUsers = userRepository.count();
        long totalOrganizers = organizerProfileRepository.count();

        // Sample charts data
        List<Map<String, Object>> revenueChart = new ArrayList<>();
        revenueChart.add(Map.of("month", "Tháng 3", "revenue", 125000000, "fee", 6250000));
        revenueChart.add(Map.of("month", "Tháng 4", "revenue", 210000000, "fee", 10500000));
        revenueChart.add(Map.of("month", "Tháng 5", "revenue", 340000000, "fee", 17000000));
        revenueChart.add(Map.of("month", "Tháng 6", "revenue", 480000000, "fee", 24000000));
        revenueChart.add(Map.of("month", "Tháng 7", "revenue", 620000000, "fee", 31000000));
        revenueChart.add(Map.of("month", "Tháng 8", "revenue", 850000000, "fee", 42500000));

        List<Map<String, Object>> userGrowthChart = new ArrayList<>();
        userGrowthChart.add(Map.of("month", "Tháng 3", "users", 500, "organizers", 12));
        userGrowthChart.add(Map.of("month", "Tháng 4", "users", 1200, "organizers", 25));
        userGrowthChart.add(Map.of("month", "Tháng 5", "users", 2400, "organizers", 48));
        userGrowthChart.add(Map.of("month", "Tháng 6", "users", 4100, "organizers", 72));
        userGrowthChart.add(Map.of("month", "Tháng 7", "users", 6800, "organizers", 110));
        userGrowthChart.add(Map.of("month", "Tháng 8", "users", 10200, "organizers", 154));

        List<Map<String, Object>> topEvents = new ArrayList<>();
        eventRepository.findAll().stream().limit(5).forEach(e -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", e.getId());
            map.put("title", e.getTitle());
            map.put("category", e.getCategory() != null ? e.getCategory().getName() : "");
            map.put("status", e.getStatus().name());
            map.put("priceFrom", e.getPriceFrom());
            topEvents.add(map);
        });

        return AdminAnalyticsDto.builder()
                .totalGmv(totalGmv)
                .totalPlatformFee(totalPlatformFee)
                .totalTicketsSold(totalTicketsSold)
                .totalEvents(totalEvents)
                .activeEvents(activeEvents)
                .totalUsers(totalUsers)
                .totalOrganizers(totalOrganizers)
                .revenueChart(revenueChart)
                .userGrowthChart(userGrowthChart)
                .topEvents(topEvents)
                .build();
    }
}
