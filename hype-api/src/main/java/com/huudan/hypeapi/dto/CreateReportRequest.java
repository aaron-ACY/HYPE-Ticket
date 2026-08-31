package com.huudan.hypeapi.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateReportRequest {
    @NotBlank(message = "Loại vi phạm không được để trống")
    private String type; // BOT_SCALPER, EVENT_DISPUTE, FAKE_TICKET, COPYRIGHT

    @NotBlank(message = "Tiêu đề không được để trống")
    private String title;

    @NotBlank(message = "Mục tiêu vi phạm không được để trống")
    private String target;

    private String targetType; // USER, ORGANIZER, EVENT
    private String evidence;
    private String severity; // HIGH, MEDIUM, LOW
}
