package com.huudan.hypeapi.service;

import com.huudan.hypeapi.dto.*;
import com.huudan.hypeapi.model.*;
import com.huudan.hypeapi.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketService {

    private final TicketTypeRepository ticketTypeRepository;
    private final EventRepository eventRepository;
    private final TicketRepository ticketRepository;
    private final CheckInRepository checkInRepository;
    private final UserRepository userRepository;

    @Autowired
    public TicketService(TicketTypeRepository ticketTypeRepository,
                         EventRepository eventRepository,
                         TicketRepository ticketRepository,
                         CheckInRepository checkInRepository,
                         UserRepository userRepository) {
        this.ticketTypeRepository = ticketTypeRepository;
        this.eventRepository = eventRepository;
        this.ticketRepository = ticketRepository;
        this.checkInRepository = checkInRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<TicketTypeDto> getTicketTypesByEventId(Long eventId) {
        return ticketTypeRepository.findByEventIdAndDeletedAtIsNull(eventId).stream()
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
    }

    @Transactional
    public TicketTypeDto addTicketType(Long eventId, CreateTicketTypeRequest req) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sự kiện"));

        TicketType tt = TicketType.builder()
                .event(event)
                .name(req.getName())
                .price(req.getPrice())
                .quantity(req.getCapacity())
                .soldQuantity(0)
                .description(req.getDescription())
                .status(TicketTypeStatus.ACTIVE)
                .build();

        TicketType saved = ticketTypeRepository.save(tt);

        if (event.getPriceFrom() == null || req.getPrice().compareTo(event.getPriceFrom()) < 0) {
            event.setPriceFrom(req.getPrice());
            eventRepository.save(event);
        }

        return TicketTypeDto.builder()
                .id(saved.getId())
                .name(saved.getName())
                .price(saved.getPrice())
                .capacity(saved.getQuantity())
                .sold(saved.getSoldQuantity())
                .description(saved.getDescription())
                .status(saved.getStatus().name())
                .build();
    }

    @Transactional
    public CheckInResponseDto checkInTicket(String staffEmail, CheckInRequest req) {
        User staff = userRepository.findByEmail(staffEmail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên check-in"));

        String tokenOrCode = req.getQrToken().trim();
        Ticket ticket = ticketRepository.findByQrToken(tokenOrCode)
                .orElseGet(() -> ticketRepository.findByTicketCode(tokenOrCode)
                        .orElseThrow(() -> new RuntimeException("Mã vé không tồn tại hoặc không hợp lệ")));

        if (ticket.getStatus() == TicketStatus.USED) {
            return CheckInResponseDto.builder()
                    .success(false)
                    .message("Vé này ĐÃ ĐƯỢC SỬ DỤNG trước đó vào lúc " + ticket.getCheckedInAt())
                    .ticketCode(ticket.getTicketCode())
                    .ticketTypeName(ticket.getOrderItem().getTicketType().getName())
                    .customerName(ticket.getOrderItem().getOrder().getCustomerName())
                    .eventTitle(ticket.getOrderItem().getTicketType().getEvent().getTitle())
                    .checkedInAt(ticket.getCheckedInAt())
                    .build();
        }

        if (ticket.getStatus() == TicketStatus.CANCELLED || ticket.getStatus() == TicketStatus.EXPIRED) {
            return CheckInResponseDto.builder()
                    .success(false)
                    .message("Vé đã bị hủy hoặc hết hạn (Trạng thái: " + ticket.getStatus() + ")")
                    .ticketCode(ticket.getTicketCode())
                    .build();
        }

        LocalDateTime now = LocalDateTime.now();
        ticket.setStatus(TicketStatus.USED);
        ticket.setCheckedInAt(now);
        ticketRepository.save(ticket);

        CheckIn checkIn = CheckIn.builder()
                .ticket(ticket)
                .checkedInBy(staff)
                .checkedInAt(now)
                .build();
        checkInRepository.save(checkIn);

        return CheckInResponseDto.builder()
                .success(true)
                .message("Check-in thành công! Chào mừng quý khách.")
                .ticketCode(ticket.getTicketCode())
                .ticketTypeName(ticket.getOrderItem().getTicketType().getName())
                .customerName(ticket.getOrderItem().getOrder().getCustomerName())
                .eventTitle(ticket.getOrderItem().getTicketType().getEvent().getTitle())
                .checkedInAt(now)
                .build();
    }

    @Transactional(readOnly = true)
    public List<TicketDto> getTicketsByEventId(Long eventId) {
        return ticketRepository.findByEventId(eventId).stream()
                .map(this::mapToTicketDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TicketDto> getAllTicketsForAdmin() {
        return ticketRepository.findAll().stream()
                .map(this::mapToTicketDto)
                .collect(Collectors.toList());
    }

    public TicketDto mapToTicketDto(Ticket t) {
        OrderItem oi = t.getOrderItem();
        Order order = oi != null ? oi.getOrder() : null;
        TicketType tt = oi != null ? oi.getTicketType() : null;
        Event event = tt != null ? tt.getEvent() : null;

        return TicketDto.builder()
                .id(t.getId())
                .ticketCode(t.getTicketCode())
                .qrToken(t.getQrToken())
                .status(t.getStatus().name())
                .ticketTypeName(tt != null ? tt.getName() : "")
                .price(oi != null ? oi.getUnitPrice() : null)
                .eventId(event != null ? event.getId() : null)
                .eventTitle(event != null ? event.getTitle() : "")
                .eventDate(event != null && event.getStartAt() != null ? event.getStartAt().toString() : "")
                .eventLocation(event != null ? event.getLocation() : "")
                .customerName(order != null ? order.getCustomerName() : "")
                .customerEmail(order != null ? order.getCustomerEmail() : "")
                .checkedInAt(t.getCheckedInAt())
                .createdAt(t.getCreatedAt())
                .build();
    }
}
