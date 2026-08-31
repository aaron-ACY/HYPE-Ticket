package com.huudan.hypeapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateEventRequest {
    private String title;
    private String description;
    private String thumbnailUrl;
    private Long categoryId;
    private Long venueId;
    private String location;
    private String address;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private BigDecimal priceFrom;
    private String status;
    private Boolean featured;
    private List<String> highlights;
    private String scheduleJson;
    private String faqsJson;
}
