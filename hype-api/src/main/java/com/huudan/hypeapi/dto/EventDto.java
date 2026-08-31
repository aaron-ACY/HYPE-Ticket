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
public class EventDto {
    private Long id;
    private String slug;
    private String title;
    private String description;
    private String image;
    private String category; // category slug
    private String categoryName;
    private String date; // formatted DD/MM/YYYY
    private String time; // formatted HH:mm
    private Long venueId;
    private String venueName;
    private String location;
    private BigDecimal priceFrom;
    private String status; // upcoming, sold-out, draft, ended
    private Boolean featured;
    private List<TicketTypeDto> ticketTypes;
    private Long organizerId;
    private String organizerName;
}
