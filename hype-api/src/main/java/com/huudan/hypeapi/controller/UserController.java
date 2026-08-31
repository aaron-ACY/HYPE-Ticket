package com.huudan.hypeapi.controller;

import com.huudan.hypeapi.dto.ChangePasswordRequest;
import com.huudan.hypeapi.dto.TicketEmailRequest;
import com.huudan.hypeapi.dto.UpdateProfileRequest;
import com.huudan.hypeapi.dto.UserDto;
import com.huudan.hypeapi.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal String email) {
        try {
            UserDto userDto = userService.getProfile(email);
            return ResponseEntity.ok(userDto);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal String email,
            @jakarta.validation.Valid @RequestBody UpdateProfileRequest request,
            org.springframework.validation.BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }
        try {
            UserDto updatedUser = userService.updateProfile(email, request);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @AuthenticationPrincipal String email,
            @RequestBody ChangePasswordRequest request) {
        try {
            userService.changePassword(email, request);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Thay đổi mật khẩu thành công");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/test-email")
    public ResponseEntity<?> testEmail(@RequestParam("to") String to) {
        try {
            userService.sendTestEmail(to);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Đã gửi email thử nghiệm thành công tới " + to);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Lỗi gửi email: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/send-ticket-email")
    public ResponseEntity<?> sendTicketEmail(@RequestBody TicketEmailRequest request) {
        try {
            userService.sendTicketEmail(request);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Gửi email thành công");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Lỗi gửi email: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
