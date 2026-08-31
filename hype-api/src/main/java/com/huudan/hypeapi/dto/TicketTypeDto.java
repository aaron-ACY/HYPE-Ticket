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
public class TicketTypeDto {
    private Long id;
    private String name;
    private BigDecimal price;
    private Integer capacity; // total tickets
    private Integer sold;
    private String description;
    private String status;
}
