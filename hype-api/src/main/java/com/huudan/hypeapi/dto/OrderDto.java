package com.huudan.hypeapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    private String id; // orderCode or String.valueOf(id)
    private Long orderId;
    private String orderCode;
    private Long eventId;
    private String eventTitle;
    private String eventDate;
    private String eventLocation;
    private String eventImage;
    private List<OrderItemDto> items;
    private List<TicketDto> tickets;
    private BigDecimal subtotal;
    private BigDecimal fee;
    private BigDecimal total;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String paymentMethod;
    private String createdAt;
    private String status;
    private RefundRequestDto refundRequest;
}
