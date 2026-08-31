package com.huudan.hypeapi.controller;

import com.huudan.hypeapi.dto.EventDetailDto;
import com.huudan.hypeapi.dto.EventDto;
import com.huudan.hypeapi.dto.TicketTypeDto;
import com.huudan.hypeapi.service.EventService;
import com.huudan.hypeapi.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/events")
public class EventController {

    private final EventService eventService;
    private final TicketService ticketService;

    @Autowired
    public EventController(EventService eventService, TicketService ticketService) {
        this.eventService = eventService;
        this.ticketService = ticketService;
    }

    @GetMapping
    public ResponseEntity<List<EventDto>> searchEvents(
            @RequestParam(value = "q", required = false) String query,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "city", required = false) String city) {
        return ResponseEntity.ok(eventService.searchEvents(query, category, city));
    }

    @GetMapping("/featured")
    public ResponseEntity<List<EventDto>> getFeaturedEvents() {
        return ResponseEntity.ok(eventService.getFeaturedEvents());
    }

    @GetMapping("/{idOrSlug}")
    public ResponseEntity<?> getEventDetail(@PathVariable String idOrSlug) {
        try {
            EventDetailDto detail = eventService.getEventDetail(idOrSlug);
            return ResponseEntity.ok(detail);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @GetMapping("/{eventId}/ticket-types")
    public ResponseEntity<List<TicketTypeDto>> getTicketTypes(@PathVariable Long eventId) {
        return ResponseEntity.ok(ticketService.getTicketTypesByEventId(eventId));
    }
}
