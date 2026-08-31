package com.huudan.hypeapi.controller;

import com.huudan.hypeapi.dto.OrganizerProfileDto;
import com.huudan.hypeapi.dto.OrganizerRegisterRequest;
import com.huudan.hypeapi.dto.UserDto;
import com.huudan.hypeapi.service.OrganizerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/organizer")
public class OrganizerController {

    private final OrganizerService organizerService;

    @Autowired
    public OrganizerController(OrganizerService organizerService) {
        this.organizerService = organizerService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerOrganizer(
            @AuthenticationPrincipal String email,
            @Valid @RequestBody OrganizerRegisterRequest request,
            BindingResult bindingResult) {
        if (email == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Vui lòng đăng nhập để thực hiện đăng ký Ban tổ chức");
            return ResponseEntity.status(401).body(error);
        }

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            UserDto updatedUser = organizerService.registerOrganizer(email, request);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getOrganizerProfile(@AuthenticationPrincipal String email) {
        if (email == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Vui lòng đăng nhập");
            return ResponseEntity.status(401).body(error);
        }

        try {
            OrganizerProfileDto profile = organizerService.getOrganizerProfile(email);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateOrganizerProfile(
            @AuthenticationPrincipal String email,
            @RequestBody OrganizerRegisterRequest request) {
        if (email == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Vui lòng đăng nhập");
            return ResponseEntity.status(401).body(error);
        }

        try {
            OrganizerProfileDto profile = organizerService.updateOrganizerProfile(email, request);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/my-status")
    public ResponseEntity<?> getMyStatus(@AuthenticationPrincipal String email) {
        if (email == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Vui lòng đăng nhập");
            return ResponseEntity.status(401).body(error);
        }

        OrganizerProfileDto statusDto = organizerService.getMyStatus(email);
        return ResponseEntity.ok(statusDto);
    }
}
