package com.huudan.hypeapi.controller;

import com.huudan.hypeapi.dto.CheckInRequest;
import com.huudan.hypeapi.dto.CheckInResponseDto;
import com.huudan.hypeapi.dto.CreateTicketTypeRequest;
import com.huudan.hypeapi.dto.TicketDto;
import com.huudan.hypeapi.dto.TicketTypeDto;
import com.huudan.hypeapi.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/organizer")
public class OrganizerTicketController {

    private final TicketService ticketService;

    @Autowired
    public OrganizerTicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping("/events/{eventId}/ticket-types")
    public ResponseEntity<?> addTicketType(
            @PathVariable Long eventId,
            @Valid @RequestBody CreateTicketTypeRequest req,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }
        try {
            TicketTypeDto created = ticketService.addTicketType(eventId, req);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/tickets/check-in")
    public ResponseEntity<?> checkIn(
            @AuthenticationPrincipal String email,
            @Valid @RequestBody CheckInRequest req,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }
        try {
            CheckInResponseDto result = ticketService.checkInTicket(email, req);
            return ResponseEntity.ok(result);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/events/{eventId}/tickets")
    public ResponseEntity<List<TicketDto>> getEventTickets(@PathVariable Long eventId) {
        return ResponseEntity.ok(ticketService.getTicketsByEventId(eventId));
    }
}
