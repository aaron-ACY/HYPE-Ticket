package com.huudan.hypeapi.dto;

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
public class CreateRefundRequest {
    @NotBlank(message = "Lý do hoàn vé không được để trống")
    private String reason;

    private String reasonDetail;

    @NotBlank(message = "Tên ngân hàng không được để trống")
    private String bankName;

    @NotBlank(message = "Số tài khoản không được để trống")
    private String accountNumber;

    @NotBlank(message = "Tên chủ tài khoản không được để trống")
    private String accountHolder;

    @NotNull(message = "Số tiền hoàn không được để trống")
    private BigDecimal refundAmount;

    private Integer quantity;
}
