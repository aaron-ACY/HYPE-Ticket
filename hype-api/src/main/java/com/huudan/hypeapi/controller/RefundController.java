package com.huudan.hypeapi.controller;

import com.huudan.hypeapi.dto.RefundRequestDto;
import com.huudan.hypeapi.dto.ResolveRefundRequest;
import com.huudan.hypeapi.service.RefundService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class RefundController {

    private final RefundService refundService;

    @Autowired
    public RefundController(RefundService refundService) {
        this.refundService = refundService;
    }

    @GetMapping("/organizer/refunds")
    public ResponseEntity<List<RefundRequestDto>> getOrganizerRefunds(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(refundService.getRefundsForOrganizer(email));
    }

    @GetMapping("/admin/refunds")
    public ResponseEntity<List<RefundRequestDto>> getAdminRefunds() {
        return ResponseEntity.ok(refundService.getAllRefundsForAdmin());
    }

    @PutMapping("/admin/refunds/{requestId}/approve")
    public ResponseEntity<?> approveRefund(@PathVariable Long requestId) {
        try {
            return ResponseEntity.ok(refundService.approveRefund(requestId));
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/admin/refunds/{requestId}/reject")
    public ResponseEntity<?> rejectRefund(
            @PathVariable Long requestId,
            @RequestBody(required = false) ResolveRefundRequest req) {
        try {
            return ResponseEntity.ok(refundService.rejectRefund(requestId, req));
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
