package com.huudan.hypeapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardStatsDto {
    private Double totalGmv;                // Tổng doanh số giao dịch (VNĐ)
    private Double platformRevenue;         // Doanh thu phí sàn thu được (10%)
    private Long totalTicketsSold;          // Tổng số vé đã bán
    private Long totalUsers;                // Tổng số người dùng
    private Long totalOrganizers;           // Tổng số ban tổ chức
    private Long pendingEventsCount;        // Số sự kiện đang chờ duyệt
    private Long activeEventsCount;         // Số sự kiện đang mở bán
}
