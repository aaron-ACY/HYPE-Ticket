package com.huudan.hypeapi.service;

import com.huudan.hypeapi.dto.ChangePasswordRequest;
import com.huudan.hypeapi.dto.TicketEmailRequest;
import com.huudan.hypeapi.dto.UpdateProfileRequest;
import com.huudan.hypeapi.dto.UserDto;
import com.huudan.hypeapi.model.User;
import com.huudan.hypeapi.model.UserStatus;
import com.huudan.hypeapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Autowired
    public UserService(UserRepository userRepository, 
                       CloudinaryService cloudinaryService, 
                       PasswordEncoder passwordEncoder,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.cloudinaryService = cloudinaryService;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public void sendTestEmail(String to) {
        emailService.sendTicketSuccessEmail(
                to,
                "Khách Hàng Thử Nghiệm",
                "Đại Nhạc Hội Hype Fest 2026",
                "HYPE-TEST-999999",
                "250,000 đ",
                "VIP ZONE",
                "20/09/2026 · 19:00 - 23:00",
                "Nhà Văn Hóa Thanh Niên, TP. Hồ Chí Minh",
                2
        );
    }

    public UserDto getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new RuntimeException("Tài khoản của bạn đã bị khóa bởi Quản trị viên");
        }

        return mapToUserDto(user);
    }

    public UserDto updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        String oldAvatar = user.getAvatarUrl();
        String newAvatar = request.getAvatar();

        // Nếu người dùng thay đổi ảnh và ảnh cũ là link Cloudinary, tiến hành xóa ảnh cũ
        if (oldAvatar != null && !oldAvatar.equals(newAvatar)) {
            cloudinaryService.deleteFile(oldAvatar);
        }

        user.setFullName(request.getName());
        user.setPhone(request.getPhone());
        user.setAvatarUrl(newAvatar);

        User savedUser = userRepository.save(user);
        return mapToUserDto(savedUser);
    }

    public void changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        boolean userHasPassword = user.getHasPassword() != null ? user.getHasPassword() : !"GOOGLE".equalsIgnoreCase(user.getAuthProvider());

        // 1. Nếu tài khoản đã có mật khẩu, bắt buộc kiểm tra mật khẩu hiện tại
        if (userHasPassword) {
            if (request.getCurrentPassword() == null || request.getCurrentPassword().trim().isEmpty()) {
                throw new RuntimeException("Vui lòng nhập mật khẩu hiện tại");
            }
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
                throw new RuntimeException("Mật khẩu hiện tại không chính xác");
            }
        }

        // 2. Kiểm tra mật khẩu xác nhận
        if (request.getNewPassword() == null || !request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Mật khẩu xác nhận không khớp");
        }

        // 3. Kiểm tra độ dài mật khẩu mới
        if (request.getNewPassword().length() < 6) {
            throw new RuntimeException("Mật khẩu mới phải có ít nhất 6 ký tự");
        }

        // 4. Mã hóa mật khẩu mới, cập nhật hasPassword = true và lưu
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setHasPassword(true);
        userRepository.save(user);
    }

    public void sendTicketEmail(TicketEmailRequest request) {
        emailService.sendTicketSuccessEmail(
                request.getToEmail(),
                request.getUserName(),
                request.getEventName(),
                request.getTicketCode(),
                request.getPrice(),
                request.getTicketType() != null ? request.getTicketType() : "STANDARD",
                request.getEventDate() != null ? request.getEventDate() : "",
                request.getEventLocation() != null ? request.getEventLocation() : "",
                request.getQuantity() > 0 ? request.getQuantity() : 1
        );
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
}
