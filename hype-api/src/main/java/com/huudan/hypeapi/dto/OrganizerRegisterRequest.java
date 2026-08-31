package com.huudan.hypeapi.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganizerRegisterRequest {

    @NotBlank(message = "Tên ban tổ chức không được để trống")
    @Size(max = 200, message = "Tên ban tổ chức không quá 200 ký tự")
    private String organizationName;

    @Size(max = 50, message = "Mã số thuế không quá 50 ký tự")
    private String taxCode;

    @Email(message = "Email doanh nghiệp không hợp lệ")
    private String businessEmail;

    @Pattern(regexp = "^$|^[0-9]{10}$", message = "Số điện thoại liên hệ phải gồm đúng 10 chữ số")
    private String phone;

    @Size(max = 255, message = "Đường dẫn website không quá 255 ký tự")
    private String websiteUrl;

    @Size(max = 500, message = "Đường dẫn logo không quá 500 ký tự")
    private String logoUrl;

    private String description;
}
