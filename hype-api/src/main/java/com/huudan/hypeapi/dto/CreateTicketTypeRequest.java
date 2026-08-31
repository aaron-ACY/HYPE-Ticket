package com.huudan.hypeapi.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateTicketTypeRequest {
    @NotBlank(message = "Tên loại vé không được để trống")
    private String name;

    @NotNull(message = "Giá vé không được để trống")
    @Min(value = 0, message = "Giá vé phải lớn hơn hoặc bằng 0")
    private BigDecimal price;

    @NotNull(message = "Số lượng vé không được để trống")
    @Min(value = 1, message = "Số lượng vé phải lớn hơn 0")
    private Integer capacity;

    private String description;
}
