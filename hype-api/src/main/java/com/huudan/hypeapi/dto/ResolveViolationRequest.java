package com.huudan.hypeapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResolveViolationRequest {
    private String action; // RESOLVED, DISMISSED, BAN_USER, SUSPEND_EVENT
    private String resolutionNote;
}
