package com.huudan.hypeapi.controller;

import com.huudan.hypeapi.dto.CreateEventRequest;
import com.huudan.hypeapi.dto.EventDetailDto;
import com.huudan.hypeapi.dto.EventDto;
import com.huudan.hypeapi.dto.UpdateEventRequest;
import com.huudan.hypeapi.service.EventService;
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
@RequestMapping("/api/v1/organizer/events")
public class OrganizerEventController {

    private final EventService eventService;

    @Autowired
    public OrganizerEventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<List<EventDto>> getMyEvents(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(eventService.getOrganizerEvents(email));
    }

    @PostMapping
    public ResponseEntity<?> createEvent(
            @AuthenticationPrincipal String email,
            @Valid @RequestBody CreateEventRequest req,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }
        try {
            EventDetailDto created = eventService.createEvent(email, req);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(
            @PathVariable Long id,
            @AuthenticationPrincipal String email,
            @RequestBody UpdateEventRequest req) {
        try {
            EventDetailDto updated = eventService.updateEvent(id, email, req);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        try {
            eventService.deleteEvent(id);
            Map<String, String> res = new HashMap<>();
            res.put("message", "Xóa sự kiện thành công");
            return ResponseEntity.ok(res);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
