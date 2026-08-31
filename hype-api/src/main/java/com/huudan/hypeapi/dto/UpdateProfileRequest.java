package com.huudan.hypeapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateProfileRequest {

    @NotBlank(message = "Họ và tên không được để trống")
    private String name;

    @Pattern(regexp = "^$|^[0-9]{10}$", message = "Số điện thoại phải gồm đúng 10 chữ số")
    private String phone;

    private String avatar;
}
