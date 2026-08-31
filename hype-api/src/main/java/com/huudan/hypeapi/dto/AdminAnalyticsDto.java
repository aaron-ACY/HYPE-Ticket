package com.huudan.hypeapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminAnalyticsDto {
    private BigDecimal totalGmv;
    private BigDecimal totalPlatformFee;
    private Long totalTicketsSold;
    private Long totalEvents;
    private Long activeEvents;
    private Long totalUsers;
    private Long totalOrganizers;
    private List<Map<String, Object>> revenueChart;
    private List<Map<String, Object>> userGrowthChart;
    private List<Map<String, Object>> topEvents;
}
