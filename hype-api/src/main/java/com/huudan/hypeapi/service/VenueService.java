package com.huudan.hypeapi.service;

import com.huudan.hypeapi.dto.VenueDto;
import com.huudan.hypeapi.mapper.VenueMapper;
import com.huudan.hypeapi.model.Venue;
import com.huudan.hypeapi.repository.VenueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VenueService {

    private final VenueRepository venueRepository;
    private final VenueMapper venueMapper;

    @Autowired
    public VenueService(VenueRepository venueRepository, VenueMapper venueMapper) {
        this.venueRepository = venueRepository;
        this.venueMapper = venueMapper;
    }

    @Transactional(readOnly = true)
    public List<VenueDto> getAllVenues() {
        return venueMapper.toDtoList(venueRepository.findAll());
    }

    @Transactional
    public VenueDto createVenue(VenueDto dto) {
        Venue venue = venueMapper.toEntity(dto);
        return venueMapper.toDto(venueRepository.save(venue));
    }
}
