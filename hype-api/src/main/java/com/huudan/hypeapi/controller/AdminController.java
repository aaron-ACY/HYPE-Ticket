package com.huudan.hypeapi.controller;

import com.huudan.hypeapi.dto.*;
import com.huudan.hypeapi.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final AdminService adminService;
    private final EventService eventService;
    private final TicketService ticketService;
    private final OrderService orderService;
    private final ViolationService violationService;
    private final AdminAnalyticsService adminAnalyticsService;

    @Autowired
    public AdminController(AdminService adminService,
                           EventService eventService,
                           TicketService ticketService,
                           OrderService orderService,
                           ViolationService violationService,
                           AdminAnalyticsService adminAnalyticsService) {
        this.adminService = adminService;
        this.eventService = eventService;
        this.ticketService = ticketService;
        this.orderService = orderService;
        this.violationService = violationService;
        this.adminAnalyticsService = adminAnalyticsService;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats(@AuthenticationPrincipal String email) {
        try {
            AdminDashboardStatsDto stats = adminService.getDashboardStats();
            return ResponseEntity.ok(stats);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(@AuthenticationPrincipal String email) {
        try {
            List<AdminUserDto> users = adminService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/users/{userId}/status")
    public ResponseEntity<?> updateUserStatus(
            @PathVariable Long userId,
            @RequestBody Map<String, String> body) {
        try {
            String status = body.get("status");
            if (status == null || status.trim().isEmpty()) {
                throw new RuntimeException("Thiếu thông tin status");
            }
            AdminUserDto updatedUser = adminService.updateUserStatus(userId, status);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/users/{userId}/toggle-role")
    public ResponseEntity<?> toggleUserRole(
            @PathVariable Long userId,
            @RequestBody Map<String, String> body) {
        try {
            String role = body.get("role");
            if (role == null || role.trim().isEmpty()) {
                throw new RuntimeException("Thiếu thông tin role");
            }
            AdminUserDto updatedUser = adminService.toggleUserRole(userId, role);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/organizers")
    public ResponseEntity<?> getAllOrganizers(@AuthenticationPrincipal String email) {
        try {
            List<OrganizerProfileDto> organizers = adminService.getAllOrganizers();
            return ResponseEntity.ok(organizers);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/organizers/{profileId}/verify")
    public ResponseEntity<?> verifyOrganizer(
            @PathVariable Long profileId,
            @RequestBody Map<String, Boolean> body) {
        try {
            Boolean isVerified = body.get("isVerified");
            OrganizerProfileDto updated = adminService.verifyOrganizer(profileId, isVerified);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/organizers/{profileId}/approve")
    public ResponseEntity<?> approveOrganizer(@PathVariable Long profileId) {
        try {
            OrganizerProfileDto updated = adminService.approveOrganizer(profileId);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/organizers/{profileId}/reject")
    public ResponseEntity<?> rejectOrganizer(
            @PathVariable Long profileId,
            @RequestBody(required = false) Map<String, String> body) {
        try {
            String reason = body != null ? body.get("reason") : null;
            OrganizerProfileDto updated = adminService.rejectOrganizer(profileId, reason);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/organizers/{profileId}/suspend")
    public ResponseEntity<?> suspendOrganizer(
            @PathVariable Long profileId,
            @RequestBody(required = false) Map<String, String> body) {
        try {
            String reason = body != null ? body.get("reason") : null;
            OrganizerProfileDto updated = adminService.suspendOrganizer(profileId, reason);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/organizers/{profileId}/unsuspend")
    public ResponseEntity<?> unsuspendOrganizer(@PathVariable Long profileId) {
        try {
            OrganizerProfileDto updated = adminService.unsuspendOrganizer(profileId);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/organizers/{profileId}/toggle-blue-tick")
    public ResponseEntity<?> toggleBlueTick(@PathVariable Long profileId) {
        try {
            OrganizerProfileDto updated = adminService.toggleBlueTick(profileId);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // --- Events Management for Admin ---
    @GetMapping("/events")
    public ResponseEntity<List<EventDto>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEventsForAdmin());
    }

    @PutMapping("/events/{eventId}/status")
    public ResponseEntity<?> updateEventStatus(
            @PathVariable Long eventId,
            @RequestBody Map<String, String> body) {
        try {
            String status = body.get("status");
            if (status == null || status.trim().isEmpty()) {
                throw new RuntimeException("Thiếu thông tin status");
            }
            return ResponseEntity.ok(eventService.updateEventStatus(eventId, status));
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // --- Tickets Monitor for Admin ---
    @GetMapping("/tickets")
    public ResponseEntity<List<TicketDto>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTicketsForAdmin());
    }

    // --- Orders Management for Admin ---
    @GetMapping("/orders")
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrdersForAdmin());
    }

    // --- Violations & Reports Management for Admin ---
    @GetMapping("/violations")
    public ResponseEntity<List<ViolationDto>> getAllViolations(
            @RequestParam(value = "status", required = false) String status) {
        return ResponseEntity.ok(violationService.getAllViolations(status));
    }

    @PutMapping("/violations/{id}/resolve")
    public ResponseEntity<?> resolveViolation(
            @PathVariable Long id,
            @RequestBody ResolveViolationRequest req) {
        try {
            return ResponseEntity.ok(violationService.resolveViolation(id, req));
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // --- Analytics for Admin ---
    @GetMapping("/analytics/overview")
    public ResponseEntity<AdminAnalyticsDto> getAnalyticsOverview() {
        return ResponseEntity.ok(adminAnalyticsService.getAnalyticsOverview());
    }
}
