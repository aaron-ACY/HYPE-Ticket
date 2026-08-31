package com.huudan.hypeapi.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.huudan.hypeapi.dto.*;
import com.huudan.hypeapi.model.*;
import com.huudan.hypeapi.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final CategoryRepository categoryRepository;
    private final VenueRepository venueRepository;
    private final UserRepository userRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final ObjectMapper objectMapper;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    @Autowired
    public EventService(EventRepository eventRepository,
                        CategoryRepository categoryRepository,
                        VenueRepository venueRepository,
                        UserRepository userRepository,
                        TicketTypeRepository ticketTypeRepository,
                        ObjectMapper objectMapper) {
        this.eventRepository = eventRepository;
        this.categoryRepository = categoryRepository;
        this.venueRepository = venueRepository;
        this.userRepository = userRepository;
        this.ticketTypeRepository = ticketTypeRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional(readOnly = true)
    public List<EventDto> searchEvents(String query, String category, String city) {
        String cleanQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        String cleanCategory = (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("all")) ? category.trim() : null;
        String cleanCity = (city != null && !city.trim().isEmpty() && !city.equalsIgnoreCase("all")) ? city.trim() : null;

        List<Event> events = eventRepository.searchEvents(cleanQuery, cleanCategory, cleanCity, EventStatus.PUBLISHED);
        return events.stream().map(this::mapToEventDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventDto> getFeaturedEvents() {
        List<Event> events = eventRepository.findByFeaturedTrueAndStatus(EventStatus.PUBLISHED);
        return events.stream().map(this::mapToEventDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EventDetailDto getEventDetail(String idOrSlug) {
        Event event;
        try {
            Long id = Long.parseLong(idOrSlug);
            event = eventRepository.findById(id)
                    .orElseGet(() -> eventRepository.findBySlug(idOrSlug)
                            .orElseThrow(() -> new RuntimeException("Không tìm thấy sự kiện")));
        } catch (NumberFormatException e) {
            event = eventRepository.findBySlug(idOrSlug)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sự kiện"));
        }
        return mapToEventDetailDto(event);
    }

    @Transactional(readOnly = true)
    public List<EventDto> getOrganizerEvents(String email) {
        User organizer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        return eventRepository.findByOrganizerId(organizer.getId()).stream()
                .map(this::mapToEventDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventDto> getAllEventsForAdmin() {
        return eventRepository.findAll().stream()
                .map(this::mapToEventDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public EventDetailDto createEvent(String organizerEmail, CreateEventRequest req) {
        User organizer = userRepository.findByEmail(organizerEmail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        Category category = null;
        if (req.getCategoryId() != null) {
            category = categoryRepository.findById(req.getCategoryId()).orElse(null);
        }

        Venue venue = null;
        if (req.getVenueId() != null) {
            venue = venueRepository.findById(req.getVenueId()).orElse(null);
        }

        String baseSlug = toSlug(req.getTitle());
        String slug = baseSlug;
        int count = 1;
        while (eventRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + count++;
        }

        String highlightsJson = null;
        if (req.getHighlights() != null) {
            try {
                highlightsJson = objectMapper.writeValueAsString(req.getHighlights());
            } catch (Exception ignored) {}
        }

        Event event = Event.builder()
                .organizer(organizer)
                .category(category)
                .venue(venue)
                .title(req.getTitle())
                .slug(slug)
                .description(req.getDescription())
                .thumbnailUrl(req.getThumbnailUrl())
                .location(req.getLocation() != null ? req.getLocation() : (venue != null ? venue.getCity() : ""))
                .address(req.getAddress() != null ? req.getAddress() : (venue != null ? venue.getAddress() : ""))
                .startAt(req.getStartAt())
                .endAt(req.getEndAt())
                .priceFrom(req.getPriceFrom() != null ? req.getPriceFrom() : BigDecimal.ZERO)
                .status(EventStatus.PUBLISHED)
                .featured(req.getFeatured() != null ? req.getFeatured() : false)
                .highlights(highlightsJson)
                .scheduleJson(req.getScheduleJson())
                .faqsJson(req.getFaqsJson())
                .build();

        Event savedEvent = eventRepository.save(event);

        if (req.getTicketTypes() != null && !req.getTicketTypes().isEmpty()) {
            List<TicketType> ticketTypes = new ArrayList<>();
            BigDecimal minPrice = null;
            for (CreateTicketTypeRequest t : req.getTicketTypes()) {
                TicketType tt = TicketType.builder()
                        .event(savedEvent)
                        .name(t.getName())
                        .price(t.getPrice())
                        .quantity(t.getCapacity())
                        .soldQuantity(0)
                        .description(t.getDescription())
                        .status(TicketTypeStatus.ACTIVE)
                        .build();
                ticketTypes.add(tt);
                if (minPrice == null || t.getPrice().compareTo(minPrice) < 0) {
                    minPrice = t.getPrice();
                }
            }
            ticketTypeRepository.saveAll(ticketTypes);
            if (minPrice != null) {
                savedEvent.setPriceFrom(minPrice);
                eventRepository.save(savedEvent);
            }
        }

        return mapToEventDetailDto(savedEvent);
    }

    @Transactional
    public EventDetailDto updateEvent(Long eventId, String organizerEmail, UpdateEventRequest req) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sự kiện"));

        if (req.getTitle() != null) event.setTitle(req.getTitle());
        if (req.getDescription() != null) event.setDescription(req.getDescription());
        if (req.getThumbnailUrl() != null) event.setThumbnailUrl(req.getThumbnailUrl());
        if (req.getLocation() != null) event.setLocation(req.getLocation());
        if (req.getAddress() != null) event.setAddress(req.getAddress());
        if (req.getStartAt() != null) event.setStartAt(req.getStartAt());
        if (req.getEndAt() != null) event.setEndAt(req.getEndAt());
        if (req.getPriceFrom() != null) event.setPriceFrom(req.getPriceFrom());
        if (req.getFeatured() != null) event.setFeatured(req.getFeatured());

        if (req.getCategoryId() != null) {
            Category category = categoryRepository.findById(req.getCategoryId()).orElse(null);
            event.setCategory(category);
        }
        if (req.getVenueId() != null) {
            Venue venue = venueRepository.findById(req.getVenueId()).orElse(null);
            event.setVenue(venue);
        }

        if (req.getStatus() != null) {
            try {
                event.setStatus(EventStatus.valueOf(req.getStatus().toUpperCase()));
            } catch (Exception ignored) {}
        }

        if (req.getHighlights() != null) {
            try {
                event.setHighlights(objectMapper.writeValueAsString(req.getHighlights()));
            } catch (Exception ignored) {}
        }
        if (req.getScheduleJson() != null) event.setScheduleJson(req.getScheduleJson());
        if (req.getFaqsJson() != null) event.setFaqsJson(req.getFaqsJson());

        return mapToEventDetailDto(eventRepository.save(event));
    }

    @Transactional
    public void deleteEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sự kiện"));
        eventRepository.delete(event);
    }

    @Transactional
    public EventDto updateEventStatus(Long eventId, String status) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sự kiện"));
        event.setStatus(EventStatus.valueOf(status.toUpperCase()));
        return mapToEventDto(eventRepository.save(event));
    }

    public EventDto mapToEventDto(Event e) {
        List<TicketTypeDto> ticketTypeDtos = ticketTypeRepository.findByEventId(e.getId()).stream()
                .map(t -> TicketTypeDto.builder()
                        .id(t.getId())
                        .name(t.getName())
                        .price(t.getPrice())
                        .capacity(t.getQuantity())
                        .sold(t.getSoldQuantity())
                        .description(t.getDescription())
                        .status(t.getStatus().name())
                        .build())
                .collect(Collectors.toList());

        return EventDto.builder()
                .id(e.getId())
                .slug(e.getSlug())
                .title(e.getTitle())
                .description(e.getDescription())
                .image(e.getThumbnailUrl())
                .category(e.getCategory() != null ? e.getCategory().getSlug() : null)
                .categoryName(e.getCategory() != null ? e.getCategory().getName() : null)
                .date(e.getStartAt() != null ? e.getStartAt().format(DATE_FORMATTER) : "")
                .time(e.getStartAt() != null ? e.getStartAt().format(TIME_FORMATTER) : "")
                .venueId(e.getVenue() != null ? e.getVenue().getId() : null)
                .venueName(e.getVenue() != null ? e.getVenue().getName() : (e.getAddress() != null ? e.getAddress() : ""))
                .location(e.getLocation() != null ? e.getLocation() : (e.getVenue() != null ? e.getVenue().getCity() : ""))
                .priceFrom(e.getPriceFrom())
                .status(e.getStatus() == EventStatus.PUBLISHED ? "upcoming" : e.getStatus().name().toLowerCase())
                .featured(e.getFeatured())
                .ticketTypes(ticketTypeDtos)
                .organizerId(e.getOrganizer() != null ? e.getOrganizer().getId() : null)
                .organizerName(e.getOrganizer() != null ? e.getOrganizer().getFullName() : null)
                .build();
    }

    public EventDetailDto mapToEventDetailDto(Event e) {
        EventDto baseDto = mapToEventDto(e);

        List<String> highlights = new ArrayList<>();
        if (e.getHighlights() != null && !e.getHighlights().trim().isEmpty()) {
            try {
                highlights = objectMapper.readValue(e.getHighlights(), new TypeReference<List<String>>() {});
            } catch (Exception ignored) {}
        }

        List<Map<String, String>> schedule = new ArrayList<>();
        if (e.getScheduleJson() != null && !e.getScheduleJson().trim().isEmpty()) {
            try {
                schedule = objectMapper.readValue(e.getScheduleJson(), new TypeReference<List<Map<String, String>>>() {});
            } catch (Exception ignored) {}
        }

        List<Map<String, String>> faqs = new ArrayList<>();
        if (e.getFaqsJson() != null && !e.getFaqsJson().trim().isEmpty()) {
            try {
                faqs = objectMapper.readValue(e.getFaqsJson(), new TypeReference<List<Map<String, String>>>() {});
            } catch (Exception ignored) {}
        }

        return EventDetailDto.builder()
                .id(baseDto.getId())
                .slug(baseDto.getSlug())
                .title(baseDto.getTitle())
                .description(baseDto.getDescription())
                .image(baseDto.getImage())
                .category(baseDto.getCategory())
                .categoryName(baseDto.getCategoryName())
                .date(baseDto.getDate())
                .time(baseDto.getTime())
                .venueId(baseDto.getVenueId())
                .venueName(baseDto.getVenueName())
                .location(baseDto.getLocation())
                .address(e.getAddress())
                .priceFrom(baseDto.getPriceFrom())
                .status(baseDto.getStatus())
                .featured(baseDto.getFeatured())
                .ticketTypes(baseDto.getTicketTypes())
                .highlights(highlights)
                .schedule(schedule)
                .faqs(faqs)
                .organizerId(baseDto.getOrganizerId())
                .organizerName(baseDto.getOrganizerName())
                .build();
    }

    private String toSlug(String input) {
        if (input == null) return "";
        String nfdNormalizedString = Normalizer.normalize(input, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        String slug = pattern.matcher(nfdNormalizedString).replaceAll("");
        slug = slug.toLowerCase().replaceAll("[^a-z0-9\\s-]", "").replaceAll("\\s+", "-").replaceAll("-+", "-");
        if (slug.startsWith("-")) slug = slug.substring(1);
        if (slug.endsWith("-")) slug = slug.substring(0, slug.length() - 1);
        return slug;
    }
}
