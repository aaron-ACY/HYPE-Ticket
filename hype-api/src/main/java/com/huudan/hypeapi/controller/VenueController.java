package com.huudan.hypeapi.controller;

import com.huudan.hypeapi.dto.VenueDto;
import com.huudan.hypeapi.service.VenueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/venues")
public class VenueController {

    private final VenueService venueService;

    @Autowired
    public VenueController(VenueService venueService) {
        this.venueService = venueService;
    }

    @GetMapping
    public ResponseEntity<List<VenueDto>> getAllVenues() {
        return ResponseEntity.ok(venueService.getAllVenues());
    }

    @PostMapping
    public ResponseEntity<VenueDto> createVenue(@RequestBody VenueDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(venueService.createVenue(dto));
    }
}
