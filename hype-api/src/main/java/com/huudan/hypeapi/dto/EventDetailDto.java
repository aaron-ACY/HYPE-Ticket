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
public class EventDetailDto {
    private Long id;
    private String slug;
    private String title;
    private String description;
    private String image;
    private String category;
    private String categoryName;
    private String date;
    private String time;
    private Long venueId;
    private String venueName;
    private String location;
    private String address;
    private BigDecimal priceFrom;
    private String status;
    private Boolean featured;
    private List<TicketTypeDto> ticketTypes;
    private List<String> highlights;
    private List<Map<String, String>> schedule;
    private List<Map<String, String>> faqs;
    private Long organizerId;
    private String organizerName;
}
