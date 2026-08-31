package com.huudan.hypeapi.controller;

import com.huudan.hypeapi.dto.CreateReportRequest;
import com.huudan.hypeapi.dto.ViolationDto;
import com.huudan.hypeapi.service.ViolationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {

    private final ViolationService violationService;

    @Autowired
    public ReportController(ViolationService violationService) {
        this.violationService = violationService;
    }

    @PostMapping
    public ResponseEntity<?> submitReport(
            @Valid @RequestBody CreateReportRequest req,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }
        try {
            ViolationDto dto = violationService.createReport(req);
            return ResponseEntity.status(HttpStatus.CREATED).body(dto);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
