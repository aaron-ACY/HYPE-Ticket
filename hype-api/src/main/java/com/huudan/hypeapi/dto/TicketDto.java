package com.huudan.hypeapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketDto {
    private Long id;
    private String ticketCode;
    private String qrToken;
    private String status;
    private String ticketTypeName;
    private BigDecimal price;
    private Long eventId;
    private String eventTitle;
    private String eventDate;
    private String eventLocation;
    private String customerName;
    private String customerEmail;
    private LocalDateTime checkedInAt;
    private LocalDateTime createdAt;
}
