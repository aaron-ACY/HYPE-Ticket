package com.huudan.hypeapi.service;

import com.huudan.hypeapi.dto.AdminDashboardStatsDto;
import com.huudan.hypeapi.dto.AdminUserDto;
import com.huudan.hypeapi.dto.OrganizerProfileDto;
import com.huudan.hypeapi.model.OrganizerProfile;
import com.huudan.hypeapi.model.Role;
import com.huudan.hypeapi.model.User;
import com.huudan.hypeapi.model.UserStatus;
import com.huudan.hypeapi.repository.OrganizerProfileRepository;
import com.huudan.hypeapi.repository.RoleRepository;
import com.huudan.hypeapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final OrganizerProfileRepository organizerProfileRepository;
    private final RedisService redisService;

    @Autowired
    public AdminService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            OrganizerProfileRepository organizerProfileRepository,
            RedisService redisService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.organizerProfileRepository = organizerProfileRepository;
        this.redisService = redisService;
    }

    @Transactional(readOnly = true)
    public AdminDashboardStatsDto getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalOrganizers = organizerProfileRepository.count();

        return AdminDashboardStatsDto.builder()
                .totalGmv(1450000000.0)             // 1.45 tỷ VNĐ
                .platformRevenue(145000000.0)       // 145 triệu VNĐ (10% commission)
                .totalTicketsSold(5820L)
                .totalUsers(totalUsers)
                .totalOrganizers(totalOrganizers)
                .pendingEventsCount(4L)
                .activeEventsCount(15L)
                .build();
    }

    @Transactional(readOnly = true)
    public List<AdminUserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToAdminUserDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public AdminUserDto updateUserStatus(Long userId, String statusStr) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + userId));

        try {
            UserStatus newStatus = UserStatus.valueOf(statusStr.toUpperCase());
            user.setStatus(newStatus);
            User savedUser = userRepository.save(user);

            // Đồng bộ trạng thái vào Redis realtime
            try {
                if (UserStatus.LOCKED.equals(newStatus)) {
                    redisService.setUserLocked(user.getEmail());
                } else {
                    redisService.removeUserLocked(user.getEmail());
                }
            } catch (Exception ignored) {}

            return mapToAdminUserDto(savedUser);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Trạng thái không hợp lệ: " + statusStr);
        }
    }

    @Transactional
    public AdminUserDto toggleUserRole(Long userId, String roleCode) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + userId));

        Role role = roleRepository.findByCode(roleCode)
                .orElseGet(() -> roleRepository.save(Role.builder()
                        .code(roleCode)
                        .name(roleCode.replace("ROLE_", ""))
                        .build()));

        Set<Role> roles = user.getRoles();
        boolean hasRole = roles.stream().anyMatch(r -> r.getCode().equals(roleCode));

        if (hasRole) {
            roles.removeIf(r -> r.getCode().equals(roleCode));
        } else {
            roles.add(role);
        }

        user.setRoles(roles);
        User savedUser = userRepository.save(user);
        return mapToAdminUserDto(savedUser);
    }

    @Transactional(readOnly = true)
    public List<OrganizerProfileDto> getAllOrganizers() {
        return organizerProfileRepository.findAll().stream()
                .map(this::mapToOrganizerProfileDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrganizerProfileDto approveOrganizer(Long profileId) {
        OrganizerProfile profile = organizerProfileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ Ban tổ chức với ID: " + profileId));

        profile.setStatus("APPROVED");
        profile.setIsVerified(true);
        profile.setRejectionReason(null);

        // Cấp quyền ROLE_ORGANIZER cho User
        User user = profile.getUser();
        if (user != null) {
            Role organizerRole = roleRepository.findByCode("ROLE_ORGANIZER")
                    .orElseGet(() -> roleRepository.save(Role.builder()
                            .code("ROLE_ORGANIZER")
                            .name("Event Organizer")
                            .build()));

            Set<Role> roles = user.getRoles();
            if (roles.stream().noneMatch(r -> "ROLE_ORGANIZER".equals(r.getCode()))) {
                roles.add(organizerRole);
                user.setRoles(roles);
                userRepository.save(user);
            }
        }

        OrganizerProfile savedProfile = organizerProfileRepository.save(profile);
        return mapToOrganizerProfileDto(savedProfile);
    }

    @Transactional
    public OrganizerProfileDto rejectOrganizer(Long profileId, String reason) {
        OrganizerProfile profile = organizerProfileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ Ban tổ chức với ID: " + profileId));

        profile.setStatus("REJECTED");
        profile.setIsVerified(false);
        profile.setHasBlueTick(false);
        profile.setRejectionReason(reason != null && !reason.trim().isEmpty() ? reason.trim() : "Hồ sơ chưa đáp ứng tiêu chuẩn kiểm duyệt");

        // Thu hồi quyền ROLE_ORGANIZER nếu có
        User user = profile.getUser();
        if (user != null) {
            Set<Role> roles = user.getRoles();
            roles.removeIf(r -> "ROLE_ORGANIZER".equals(r.getCode()));
            user.setRoles(roles);
            userRepository.save(user);
        }

        OrganizerProfile savedProfile = organizerProfileRepository.save(profile);
        return mapToOrganizerProfileDto(savedProfile);
    }

    @Transactional
    public OrganizerProfileDto suspendOrganizer(Long profileId, String reason) {
        OrganizerProfile profile = organizerProfileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ Ban tổ chức với ID: " + profileId));

        profile.setStatus("SUSPENDED");
        profile.setIsVerified(false);
        profile.setHasBlueTick(false);
        profile.setRejectionReason(reason != null && !reason.trim().isEmpty() ? reason.trim() : "Quyền Ban tổ chức bị tạm khóa bởi Quản trị viên");

        // Khi bị khóa quyền Organizer, ta thu hồi role ROLE_ORGANIZER khỏi User
        User user = profile.getUser();
        if (user != null) {
            Set<Role> roles = user.getRoles();
            roles.removeIf(r -> "ROLE_ORGANIZER".equals(r.getCode()));
            user.setRoles(roles);
            userRepository.save(user);
        }

        OrganizerProfile savedProfile = organizerProfileRepository.save(profile);
        return mapToOrganizerProfileDto(savedProfile);
    }

    @Transactional
    public OrganizerProfileDto unsuspendOrganizer(Long profileId) {
        OrganizerProfile profile = organizerProfileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ Ban tổ chức với ID: " + profileId));

        profile.setStatus("APPROVED");
        profile.setIsVerified(true);
        profile.setRejectionReason(null);

        // Cấp lại role ROLE_ORGANIZER cho User
        User user = profile.getUser();
        if (user != null) {
            Role organizerRole = roleRepository.findByCode("ROLE_ORGANIZER")
                    .orElseGet(() -> roleRepository.save(Role.builder()
                            .code("ROLE_ORGANIZER")
                            .name("Event Organizer")
                            .build()));

            Set<Role> roles = user.getRoles();
            if (roles.stream().noneMatch(r -> "ROLE_ORGANIZER".equals(r.getCode()))) {
                roles.add(organizerRole);
                user.setRoles(roles);
                userRepository.save(user);
            }
        }

        OrganizerProfile savedProfile = organizerProfileRepository.save(profile);
        return mapToOrganizerProfileDto(savedProfile);
    }

    @Transactional
    public OrganizerProfileDto toggleBlueTick(Long profileId) {
        OrganizerProfile profile = organizerProfileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ Ban tổ chức với ID: " + profileId));

        boolean nextTick = !(profile.getHasBlueTick() != null && profile.getHasBlueTick());
        profile.setHasBlueTick(nextTick);
        if (nextTick) {
            profile.setIsVerified(true);
        }

        OrganizerProfile savedProfile = organizerProfileRepository.save(profile);
        return mapToOrganizerProfileDto(savedProfile);
    }

    @Transactional
    public OrganizerProfileDto verifyOrganizer(Long profileId, Boolean isVerified) {
        OrganizerProfile profile = organizerProfileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ Ban tổ chức với ID: " + profileId));

        boolean verified = isVerified != null ? isVerified : true;
        profile.setIsVerified(verified);
        profile.setHasBlueTick(verified);
        OrganizerProfile savedProfile = organizerProfileRepository.save(profile);
        return mapToOrganizerProfileDto(savedProfile);
    }

    private AdminUserDto mapToAdminUserDto(User user) {
        Set<String> roleCodes = user.getRoles().stream()
                .map(role -> role.getCode())
                .collect(Collectors.toSet());

        Optional<OrganizerProfile> organizerOpt = organizerProfileRepository.findByUser(user);

        return AdminUserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .status(user.getStatus().name())
                .authProvider(user.getAuthProvider() != null ? user.getAuthProvider() : "LOCAL")
                .hasPassword(user.getHasPassword() != null ? user.getHasPassword() : !"GOOGLE".equalsIgnoreCase(user.getAuthProvider()))
                .isOrganizer(organizerOpt.isPresent() || roleCodes.contains("ROLE_ORGANIZER"))
                .organizationName(organizerOpt.map(p -> p.getOrganizationName()).orElse(null))
                .roles(roleCodes)
                .createdAt(user.getCreatedAt())
                .build();
    }

    private OrganizerProfileDto mapToOrganizerProfileDto(OrganizerProfile profile) {
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
