package com.huudan.hypeapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Long id;
    private String email;
    private String fullName;
    private String name; // maps to name in frontend
    private String phone;
    private String avatarUrl;
    private String avatar; // maps to avatar in frontend
    private String status;
    private Boolean hasPassword;
    private String authProvider;
    private Set<String> roles;
}
