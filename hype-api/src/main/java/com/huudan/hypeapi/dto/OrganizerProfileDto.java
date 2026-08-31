package com.huudan.hypeapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganizerProfileDto {
    private Long id;
    private Long userId;
    private String organizationName;
    private String taxCode;
    private String businessEmail;
    private String phone;
    private String websiteUrl;
    private String logoUrl;
    private String description;
    private Boolean isVerified;
    private String status;
    private Boolean hasBlueTick;
    private String rejectionReason;
    private LocalDateTime createdAt;
}
