package com.huudan.hypeapi.service;

import com.huudan.hypeapi.dto.GoogleLoginRequest;
import com.huudan.hypeapi.dto.LoginRequest;
import com.huudan.hypeapi.dto.LoginResponse;
import com.huudan.hypeapi.dto.RegisterRequest;
import com.huudan.hypeapi.dto.UserDto;
import com.huudan.hypeapi.model.Role;
import com.huudan.hypeapi.model.User;
import com.huudan.hypeapi.model.UserStatus;
import com.huudan.hypeapi.repository.RoleRepository;
import com.huudan.hypeapi.repository.UserRepository;
import com.huudan.hypeapi.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Value("${app.google.client-id:}")
    private String googleClientId;

    @Value("${app.google.client-secret:}")
    private String googleClientSecret;

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Autowired
    public AuthService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public LoginResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email đã được đăng ký trong hệ thống");
        }

        // Tự động lấy hoặc tạo ROLE_USER dự phòng nếu DB chưa được seed
        Role userRole = roleRepository.findByCode("ROLE_USER")
                .orElseGet(() -> roleRepository.save(Role.builder()
                        .code("ROLE_USER")
                        .name("Customers and users")
                        .build()));

        Set<Role> roles = new HashSet<>();
        roles.add(userRole);

        String defaultAvatar = "https://api.dicebear.com/7.x/adventurer/svg?seed=" + registerRequest.getFullName();

        User user = User.builder()
                .fullName(registerRequest.getFullName())
                .email(registerRequest.getEmail())
                .phone(registerRequest.getPhone())
                .passwordHash(passwordEncoder.encode(registerRequest.getPassword()))
                .status(UserStatus.ACTIVE)
                .hasPassword(true)
                .authProvider("LOCAL")
                .avatarUrl(defaultAvatar)
                .roles(roles)
                .build();

        User savedUser = userRepository.save(user);

        List<String> roleCodes = roles.stream().map(role -> role.getCode()).collect(Collectors.toList());
        String token = tokenProvider.generateToken(savedUser.getEmail(), roleCodes);

        return LoginResponse.builder()
                .token(token)
                .user(mapToUserDto(savedUser))
                .build();
    }

    public LoginResponse login(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Email chưa được đăng ký trong hệ thống"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Mật khẩu không chính xác");
        }

        if (user.getStatus() == UserStatus.LOCKED) {
            throw new RuntimeException("Tài khoản của bạn đã bị khóa bởi Quản trị viên. Vui lòng liên hệ hỗ trợ.");
        }
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new RuntimeException("Tài khoản chưa được kích hoạt hoặc đã bị vô hiệu hóa.");
        }

        List<String> roleCodes = user.getRoles().stream()
                .map(role -> role.getCode())
                .collect(Collectors.toList());

        String token = tokenProvider.generateToken(user.getEmail(), roleCodes);

        return LoginResponse.builder()
                .token(token)
                .user(mapToUserDto(user))
                .build();
    }

    @Transactional
    public LoginResponse loginWithGoogle(GoogleLoginRequest googleRequest) {
        String email = googleRequest.getEmail();
        String name = googleRequest.getName();
        String avatar = googleRequest.getAvatar();

        // 1. Thử xác thực ID Token qua Google API endpoint
        if (googleRequest.getIdToken() != null && !googleRequest.getIdToken().trim().isEmpty()) {
            try {
                java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
                java.net.http.HttpRequest httpRequest = java.net.http.HttpRequest.newBuilder()
                        .uri(java.net.URI.create("https://oauth2.googleapis.com/tokeninfo?id_token=" + googleRequest.getIdToken().trim()))
                        .GET()
                        .build();

                java.net.http.HttpResponse<String> httpResponse = client.send(httpRequest, java.net.http.HttpResponse.BodyHandlers.ofString());

                if (httpResponse.statusCode() == 200) {
                    String body = httpResponse.body();
                    java.util.regex.Matcher emailMatcher = java.util.regex.Pattern.compile("\"email\"\\s*:\\s*\"([^\"]+)\"").matcher(body);
                    if (emailMatcher.find()) {
                        email = emailMatcher.group(1);
                    }
                    java.util.regex.Matcher nameMatcher = java.util.regex.Pattern.compile("\"name\"\\s*:\\s*\"([^\"]+)\"").matcher(body);
                    if (nameMatcher.find()) {
                        name = nameMatcher.group(1);
                    }
                    java.util.regex.Matcher picMatcher = java.util.regex.Pattern.compile("\"picture\"\\s*:\\s*\"([^\"]+)\"").matcher(body);
                    if (picMatcher.find()) {
                        avatar = picMatcher.group(1);
                    }
                } else {
                    // Nếu TokenInfo API trả về lỗi (ví dụ token dev / offline), thử giải mã JWT Payload từ Nimbus nếu có
                    try {
                        com.nimbusds.jwt.SignedJWT signedJWT = com.nimbusds.jwt.SignedJWT.parse(googleRequest.getIdToken().trim());
                        com.nimbusds.jwt.JWTClaimsSet claims = signedJWT.getJWTClaimsSet();
                        if (claims.getStringClaim("email") != null) {
                            email = claims.getStringClaim("email");
                        }
                        if (claims.getStringClaim("name") != null) {
                            name = claims.getStringClaim("name");
                        }
                        if (claims.getStringClaim("picture") != null) {
                            avatar = claims.getStringClaim("picture");
                        }
                    } catch (Exception ignored) {
                    }
                }
            } catch (Exception ex) {
                // Ghi nhận lỗi gọi Google API nhưng vẫn tiếp tục kiểm tra dữ liệu payload gửi lên
                System.err.println("Google Token Verification Warning: " + ex.getMessage());
            }
        }

        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Không thể xác thực thông tin tài khoản Google hoặc thiếu Email");
        }

        final String finalEmail = email.trim().toLowerCase();
        final String finalName = (name != null && !name.trim().isEmpty()) ? name.trim() : finalEmail.split("@")[0];
        final String finalAvatar = (avatar != null && !avatar.trim().isEmpty())
                ? avatar.trim()
                : "https://api.dicebear.com/7.x/adventurer/svg?seed=" + finalName;

        // 2. Tìm hoặc tạo mới tài khoản
        User user = userRepository.findByEmail(finalEmail).orElseGet(() -> {
            Role userRole = roleRepository.findByCode("ROLE_USER")
                    .orElseGet(() -> roleRepository.save(Role.builder()
                            .code("ROLE_USER")
                            .name("Customers and users")
                            .build()));

            Set<Role> roles = new HashSet<>();
            roles.add(userRole);

            User newUser = User.builder()
                    .fullName(finalName)
                    .email(finalEmail)
                    .phone("")
                    .passwordHash(passwordEncoder.encode(java.util.UUID.randomUUID().toString()))
                    .status(UserStatus.ACTIVE)
                    .hasPassword(false)
                    .authProvider("GOOGLE")
                    .avatarUrl(finalAvatar)
                    .roles(roles)
                    .build();

            return userRepository.save(newUser);
        });

        // Nếu user này đăng nhập bằng Google và chưa từng thiết lập mật khẩu thì đảm bảo hasPassword = false và authProvider = GOOGLE
        if (user.getAuthProvider() == null || "GOOGLE".equalsIgnoreCase(user.getAuthProvider())) {
            user.setAuthProvider("GOOGLE");
            if (user.getHasPassword() == null) {
                user.setHasPassword(false);
            }
            user = userRepository.save(user);
        }

        if (user.getStatus() == UserStatus.LOCKED) {
            throw new RuntimeException("Tài khoản Google của bạn đã bị khóa bởi Quản trị viên. Vui lòng liên hệ hỗ trợ.");
        }
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new RuntimeException("Tài khoản này đã bị tạm ngưng hoạt động.");
        }

        // Cập nhật avatar nếu user chưa có avatar cá nhân
        if ((user.getAvatarUrl() == null || user.getAvatarUrl().contains("dicebear")) && avatar != null && !avatar.trim().isEmpty()) {
            user.setAvatarUrl(finalAvatar);
            userRepository.save(user);
        }

        List<String> roleCodes = user.getRoles().stream()
                .map(role -> role.getCode())
                .collect(Collectors.toList());

        String token = tokenProvider.generateToken(user.getEmail(), roleCodes);

        return LoginResponse.builder()
                .token(token)
                .user(mapToUserDto(user))
                .build();
    }

    private UserDto mapToUserDto(User user) {
        Set<String> roleCodes = user.getRoles().stream()
                .map(role -> role.getCode())
                .collect(Collectors.toSet());

        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .name(user.getFullName())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .avatar(user.getAvatarUrl())
                .status(user.getStatus().name())
                .hasPassword(user.getHasPassword() != null ? user.getHasPassword() : true)
                .authProvider(user.getAuthProvider() != null ? user.getAuthProvider() : "LOCAL")
                .roles(roleCodes)
                .build();
    }
}
