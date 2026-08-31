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
public class CheckInRequest {
    @NotBlank(message = "Mã vé hoặc QR Token không được để trống")
    private String qrToken; // or ticketCode
}
