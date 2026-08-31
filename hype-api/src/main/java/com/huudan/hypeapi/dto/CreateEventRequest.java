package com.huudan.hypeapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class CreateEventRequest {
    @NotBlank(message = "Tiêu đề sự kiện không được để trống")
    private String title;

    private String description;
    private String thumbnailUrl;
    private Long categoryId;
    private Long venueId;
    private String location;
    private String address;

    @NotNull(message = "Thời gian bắt đầu không được để trống")
    private LocalDateTime startAt;

    @NotNull(message = "Thời gian kết thúc không được để trống")
    private LocalDateTime endAt;

    private BigDecimal priceFrom;
    private Boolean featured;
    private List<String> highlights;
    private String scheduleJson;
    private String faqsJson;
    private List<CreateTicketTypeRequest> ticketTypes;
}
