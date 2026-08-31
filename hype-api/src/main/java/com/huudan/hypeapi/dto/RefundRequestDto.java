package com.huudan.hypeapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefundRequestDto {
    private Long id;
    private Long orderId;
    private String orderCode;
    private String requestedAt;
    private String reason;
    private String reasonDetail;
    private String bankName;
    private String accountNumber;
    private String accountHolder;
    private BigDecimal refundAmount;
    private Integer quantity;
    private String status; // PENDING, APPROVED, REJECTED
    private String rejectionReason;
    private String resolvedAt;
}
