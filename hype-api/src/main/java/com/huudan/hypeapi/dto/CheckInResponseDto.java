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
public class CheckInResponseDto {
    private Boolean success;
    private String message;
    private String ticketCode;
    private String ticketTypeName;
    private String customerName;
    private String eventTitle;
    private LocalDateTime checkedInAt;
}
