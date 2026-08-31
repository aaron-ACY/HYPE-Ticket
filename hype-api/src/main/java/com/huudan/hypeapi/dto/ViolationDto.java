package com.huudan.hypeapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ViolationDto {
    private Long id;
    private String type; // BOT_SCALPER, EVENT_DISPUTE, FAKE_TICKET, COPYRIGHT
    private String typeLabel;
    private String severity; // HIGH, MEDIUM, LOW
    private String title;
    private String target;
    private String targetType; // USER, ORGANIZER, EVENT
    private String evidence;
    private String status; // PENDING, RESOLVED, DISMISSED
    private String time;
    private LocalDateTime createdAt;
}
