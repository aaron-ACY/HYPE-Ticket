package com.huudan.hypeapi.service;

import com.huudan.hypeapi.dto.OrganizerProfileDto;
import com.huudan.hypeapi.dto.OrganizerRegisterRequest;
import com.huudan.hypeapi.dto.UserDto;
import com.huudan.hypeapi.model.OrganizerProfile;
import com.huudan.hypeapi.model.User;
import com.huudan.hypeapi.repository.OrganizerProfileRepository;
import com.huudan.hypeapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class OrganizerService {

    private final UserRepository userRepository;
    private final OrganizerProfileRepository organizerProfileRepository;

    @Autowired
    public OrganizerService(
            UserRepository userRepository,
            OrganizerProfileRepository organizerProfileRepository) {
        this.userRepository = userRepository;
        this.organizerProfileRepository = organizerProfileRepository;
    }

    @Transactional
    public UserDto registerOrganizer(String email, OrganizerRegisterRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // 1. Tạo hoặc cập nhật hồ sơ OrganizerProfile ở trạng thái PENDING (chờ duyệt)
        Optional<OrganizerProfile> existingProfileOpt = organizerProfileRepository.findByUser(user);
        OrganizerProfile profile = existingProfileOpt.orElseGet(() -> OrganizerProfile.builder()
                .user(user)
                .build());

        profile.setOrganizationName(request.getOrganizationName().trim());
        profile.setTaxCode(request.getTaxCode() != null ? request.getTaxCode().trim() : null);
        profile.setBusinessEmail(request.getBusinessEmail() != null && !request.getBusinessEmail().trim().isEmpty()
                ? request.getBusinessEmail().trim().toLowerCase()
                : user.getEmail());
        profile.setPhone(request.getPhone() != null && !request.getPhone().trim().isEmpty()
                ? request.getPhone().trim()
                : user.getPhone());
        profile.setWebsiteUrl(request.getWebsiteUrl() != null ? request.getWebsiteUrl().trim() : null);
        profile.setLogoUrl(request.getLogoUrl() != null ? request.getLogoUrl().trim() : user.getAvatarUrl());
        profile.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        profile.setStatus("PENDING");
        profile.setIsVerified(false);
        profile.setHasBlueTick(false);
        profile.setRejectionReason(null);

        organizerProfileRepository.save(profile);

        // 2. Trả về thông tin User
        return mapToUserDto(user);
    }

    @Transactional(readOnly = true)
    public OrganizerProfileDto getOrganizerProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        OrganizerProfile profile = organizerProfileRepository.findByUser(user)
                .orElseGet(() -> {
                    // Tự động tạo hồ sơ mặc định nếu user là organizer
                    OrganizerProfile newProfile = OrganizerProfile.builder()
                            .user(user)
                            .organizationName("Hype Live Entertainment Corp")
                            .businessEmail(user.getEmail())
                            .phone(user.getPhone() != null ? user.getPhone() : "0908123456")
                            .taxCode("0318921890")
                            .websiteUrl("https://hypelive.vn")
                            .status("APPROVED")
                            .isVerified(true)
                            .hasBlueTick(true)
                            .build();
                    return organizerProfileRepository.save(newProfile);
                });

        return mapToProfileDto(profile);
    }

    @Transactional
    public OrganizerProfileDto updateOrganizerProfile(String email, OrganizerRegisterRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        OrganizerProfile profile = organizerProfileRepository.findByUser(user)
                .orElseGet(() -> OrganizerProfile.builder()
                        .user(user)
                        .status("APPROVED")
                        .isVerified(true)
                        .hasBlueTick(true)
                        .build());

        if (request.getOrganizationName() != null && !request.getOrganizationName().trim().isEmpty()) {
            profile.setOrganizationName(request.getOrganizationName().trim());
        }
        if (request.getTaxCode() != null) {
            profile.setTaxCode(request.getTaxCode().trim());
        }
        if (request.getBusinessEmail() != null && !request.getBusinessEmail().trim().isEmpty()) {
            profile.setBusinessEmail(request.getBusinessEmail().trim());
        }
        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            profile.setPhone(request.getPhone().trim());
        }
        if (request.getWebsiteUrl() != null) {
            profile.setWebsiteUrl(request.getWebsiteUrl().trim());
        }
        if (request.getDescription() != null) {
            profile.setDescription(request.getDescription().trim());
        }

        OrganizerProfile saved = organizerProfileRepository.save(profile);
        return mapToProfileDto(saved);
    }

    @Transactional(readOnly = true)
    public OrganizerProfileDto getMyStatus(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        return organizerProfileRepository.findByUser(user)
                .map(this::mapToProfileDto)
                .orElse(null);
    }

    private UserDto mapToUserDto(User user) {
        Set<String> roleCodes = user.getRoles().stream()
                .map(role -> role.getCode())
                .collect(Collectors.toSet());

        boolean hasPassword = user.getHasPassword() != null ? user.getHasPassword() : !"GOOGLE".equalsIgnoreCase(user.getAuthProvider());

        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .name(user.getFullName())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .avatar(user.getAvatarUrl())
                .status(user.getStatus().name())
                .hasPassword(hasPassword)
                .authProvider(user.getAuthProvider() != null ? user.getAuthProvider() : "LOCAL")
                .roles(roleCodes)
                .build();
    }

    private OrganizerProfileDto mapToProfileDto(OrganizerProfile profile) {
        return OrganizerProfileDto.builder()
                .id(profile.getId())
                .userId(profile.getUser() != null ? profile.getUser().getId() : null)
                .organizationName(profile.getOrganizationName())
                .taxCode(profile.getTaxCode())
                .businessEmail(profile.getBusinessEmail())
                .phone(profile.getPhone())
                .websiteUrl(profile.getWebsiteUrl())
                .logoUrl(profile.getLogoUrl())
                .description(profile.getDescription())
                .isVerified(profile.getIsVerified())
                .status(profile.getStatus() != null ? profile.getStatus() : "PENDING")
                .hasBlueTick(profile.getHasBlueTick() != null ? profile.getHasBlueTick() : false)
                .rejectionReason(profile.getRejectionReason())
                .createdAt(profile.getCreatedAt())
                .build();
    }
}
