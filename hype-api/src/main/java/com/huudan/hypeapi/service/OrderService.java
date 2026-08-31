package com.huudan.hypeapi.service;

import com.huudan.hypeapi.dto.*;
import com.huudan.hypeapi.model.*;
import com.huudan.hypeapi.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final TicketRepository ticketRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    @Autowired
    public OrderService(OrderRepository orderRepository,
                        TicketRepository ticketRepository,
                        TicketTypeRepository ticketTypeRepository,
                        EventRepository eventRepository,
                        UserRepository userRepository,
                        EmailService emailService) {
        this.orderRepository = orderRepository;
        this.ticketRepository = ticketRepository;
        this.ticketTypeRepository = ticketTypeRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    @Transactional
    public OrderDto createOrder(String userEmail, CreateOrderRequest req) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        Event event = null;
        if (req.getEventId() != null) {
            event = eventRepository.findById(req.getEventId()).orElse(null);
        }

        String orderCode = "HYPE-" + System.currentTimeMillis() % 1000000 + "-" + (new Random().nextInt(900) + 100);

        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();
        List<Ticket> allTickets = new ArrayList<>();

        Order order = Order.builder()
                .user(user)
                .event(event)
                .orderCode(orderCode)
                .customerName(req.getCustomerName() != null ? req.getCustomerName() : user.getFullName())
                .customerEmail(req.getCustomerEmail() != null ? req.getCustomerEmail() : user.getEmail())
                .customerPhone(req.getCustomerPhone() != null ? req.getCustomerPhone() : user.getPhone())
                .paymentMethod(req.getPaymentMethod() != null ? req.getPaymentMethod() : "ONLINE_BANKING")
                .status(OrderStatus.PAID)
                .paymentStatus(PaymentStatus.PAID)
                .build();

        for (OrderItemRequest itemReq : req.getItems()) {
            TicketType ticketType = ticketTypeRepository.findById(itemReq.getTicketTypeId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy loại vé: " + itemReq.getTicketTypeId()));

            if (ticketType.getSoldQuantity() + itemReq.getQuantity() > ticketType.getQuantity()) {
                throw new RuntimeException("Loại vé '" + ticketType.getName() + "' không đủ số lượng còn lại");
            }

            ticketType.setSoldQuantity(ticketType.getSoldQuantity() + itemReq.getQuantity());
            if (ticketType.getSoldQuantity().equals(ticketType.getQuantity())) {
                ticketType.setStatus(TicketTypeStatus.SOLD_OUT);
            }
            ticketTypeRepository.save(ticketType);

            BigDecimal itemSubtotal = ticketType.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            subtotal = subtotal.add(itemSubtotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .ticketType(ticketType)
                    .quantity(itemReq.getQuantity())
                    .unitPrice(ticketType.getPrice())
                    .subtotal(itemSubtotal)
                    .build();
            orderItems.add(orderItem);

            for (int i = 0; i < itemReq.getQuantity(); i++) {
                String ticketCode = "TICK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
                String qrToken = UUID.randomUUID().toString().replace("-", "") + System.currentTimeMillis();

                Ticket ticket = Ticket.builder()
                        .orderItem(orderItem)
                        .ticketCode(ticketCode)
                        .qrToken(qrToken)
                        .status(TicketStatus.ACTIVE)
                        .build();
                orderItem.getTickets().add(ticket);
                allTickets.add(ticket);
            }
        }

        BigDecimal fee = BigDecimal.valueOf(15000); // Phí dịch vụ cố định
        BigDecimal total = subtotal.add(fee);

        order.setSubtotalAmount(subtotal);
        order.setFeeAmount(fee);
        order.setTotalAmount(total);
        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        // Gửi email vé nếu có cấu hình
        try {
            if (order.getCustomerEmail() != null && !order.getCustomerEmail().isEmpty()) {
                String ticketCodes = allTickets.stream().map(t -> t.getTicketCode()).collect(Collectors.joining(", "));
                String eventTitle = event != null ? event.getTitle() : (req.getEventTitle() != null ? req.getEventTitle() : "");
                String eventDate = event != null && event.getStartAt() != null ? event.getStartAt().format(DATE_FORMATTER) : (req.getEventDate() != null ? req.getEventDate() : "");
                String eventLoc = event != null ? event.getLocation() : (req.getEventLocation() != null ? req.getEventLocation() : "");
                emailService.sendTicketSuccessEmail(
                        order.getCustomerEmail(),
                        order.getCustomerName(),
                        eventTitle,
                        ticketCodes,
                        total.toString() + " đ",
                        orderItems.isEmpty() ? "Vé điện tử" : orderItems.get(0).getTicketType().getName(),
                        eventDate,
                        eventLoc,
                        allTickets.size()
                );
            }
        } catch (Exception ignored) {}

        return mapToOrderDto(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getUserOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::mapToOrderDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderDetail(String orderCodeOrId) {
        Order order;
        try {
            Long id = Long.parseLong(orderCodeOrId);
            order = orderRepository.findById(id)
                    .orElseGet(() -> orderRepository.findByOrderCode(orderCodeOrId)
                            .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng")));
        } catch (NumberFormatException e) {
            order = orderRepository.findByOrderCode(orderCodeOrId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
        }
        return mapToOrderDto(order);
    }

    @Transactional
    public OrderDto cancelOrder(Long orderId, String userEmail) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        if (!order.getUser().getEmail().equalsIgnoreCase(userEmail)) {
            throw new RuntimeException("Bạn không có quyền hủy đơn hàng này");
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.setPaymentStatus(PaymentStatus.UNPAID);

        for (OrderItem oi : order.getItems()) {
            TicketType tt = oi.getTicketType();
            tt.setSoldQuantity(Math.max(0, tt.getSoldQuantity() - oi.getQuantity()));
            if (tt.getStatus() == TicketTypeStatus.SOLD_OUT && tt.getSoldQuantity() < tt.getQuantity()) {
                tt.setStatus(TicketTypeStatus.ACTIVE);
            }
            ticketTypeRepository.save(tt);

            for (Ticket t : oi.getTickets()) {
                t.setStatus(TicketStatus.CANCELLED);
                ticketRepository.save(t);
            }
        }

        return mapToOrderDto(orderRepository.save(order));
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getAllOrdersForAdmin() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToOrderDto)
                .collect(Collectors.toList());
    }

    public OrderDto mapToOrderDto(Order o) {
        Event event = o.getEvent();
        List<OrderItemDto> itemDtos = o.getItems().stream()
                .map(i -> OrderItemDto.builder()
                        .id(i.getId())
                        .ticketTypeId(i.getTicketType().getId())
                        .ticketName(i.getTicketType().getName())
                        .price(i.getUnitPrice())
                        .quantity(i.getQuantity())
                        .subtotal(i.getSubtotal())
                        .build())
                .collect(Collectors.toList());

        List<TicketDto> ticketDtos = o.getItems().stream()
                .flatMap(i -> i.getTickets().stream())
                .map(t -> TicketDto.builder()
                        .id(t.getId())
                        .ticketCode(t.getTicketCode())
                        .qrToken(t.getQrToken())
                        .status(t.getStatus().name())
                        .ticketTypeName(t.getOrderItem().getTicketType().getName())
                        .price(t.getOrderItem().getUnitPrice())
                        .eventId(event != null ? event.getId() : null)
                        .eventTitle(event != null ? event.getTitle() : "")
                        .eventDate(event != null && event.getStartAt() != null ? event.getStartAt().format(DATE_FORMATTER) : "")
                        .eventLocation(event != null ? event.getLocation() : "")
                        .customerName(o.getCustomerName())
                        .customerEmail(o.getCustomerEmail())
                        .checkedInAt(t.getCheckedInAt())
                        .createdAt(t.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        RefundRequestDto refundDto = null;
        if (o.getRefundRequest() != null) {
            RefundRequest r = o.getRefundRequest();
            refundDto = RefundRequestDto.builder()
                    .id(r.getId())
                    .orderId(o.getId())
                    .orderCode(o.getOrderCode())
                    .requestedAt(r.getCreatedAt() != null ? r.getCreatedAt().format(DATE_FORMATTER) : "")
                    .reason(r.getReason())
                    .reasonDetail(r.getReasonDetail())
                    .bankName(r.getBankName())
                    .accountNumber(r.getAccountNumber())
                    .accountHolder(r.getAccountHolder())
                    .refundAmount(r.getRefundAmount())
                    .quantity(r.getQuantity())
                    .status(r.getStatus().name())
                    .rejectionReason(r.getRejectionReason())
                    .resolvedAt(r.getResolvedAt() != null ? r.getResolvedAt().format(DATE_FORMATTER) : null)
                    .build();
        }

        return OrderDto.builder()
                .id(o.getOrderCode())
                .orderId(o.getId())
                .orderCode(o.getOrderCode())
                .eventId(event != null ? event.getId() : null)
                .eventTitle(event != null ? event.getTitle() : "")
                .eventDate(event != null && event.getStartAt() != null ? event.getStartAt().format(DATE_FORMATTER) : "")
                .eventLocation(event != null ? event.getLocation() : "")
                .eventImage(event != null ? event.getThumbnailUrl() : "")
                .items(itemDtos)
                .tickets(ticketDtos)
                .subtotal(o.getSubtotalAmount())
                .fee(o.getFeeAmount())
                .total(o.getTotalAmount())
                .customerName(o.getCustomerName())
                .customerEmail(o.getCustomerEmail())
                .customerPhone(o.getCustomerPhone())
                .paymentMethod(o.getPaymentMethod())
                .createdAt(o.getCreatedAt() != null ? o.getCreatedAt().format(DATE_FORMATTER) : "")
                .status(o.getStatus().name())
                .refundRequest(refundDto)
                .build();
    }
}
