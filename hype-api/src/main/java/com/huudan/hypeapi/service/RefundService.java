package com.huudan.hypeapi.service;

import com.huudan.hypeapi.dto.CreateRefundRequest;
import com.huudan.hypeapi.dto.RefundRequestDto;
import com.huudan.hypeapi.dto.ResolveRefundRequest;
import com.huudan.hypeapi.mapper.RefundMapper;
import com.huudan.hypeapi.model.*;
import com.huudan.hypeapi.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RefundService {

    private final RefundRequestRepository refundRequestRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final RefundMapper refundMapper;

    @Autowired
    public RefundService(RefundRequestRepository refundRequestRepository,
                         OrderRepository orderRepository,
                         UserRepository userRepository,
                         TicketRepository ticketRepository,
                         TicketTypeRepository ticketTypeRepository,
                         RefundMapper refundMapper) {
        this.refundRequestRepository = refundRequestRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.ticketRepository = ticketRepository;
        this.ticketTypeRepository = ticketTypeRepository;
        this.refundMapper = refundMapper;
    }

    @Transactional
    public RefundRequestDto createRefundRequest(Long orderId, String userEmail, CreateRefundRequest req) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Bạn không có quyền yêu cầu hoàn vé cho đơn hàng này");
        }

        if (refundRequestRepository.findByOrderId(orderId).isPresent()) {
            throw new RuntimeException("Đơn hàng này đã có yêu cầu hoàn vé đang được xử lý");
        }

        RefundRequest refundRequest = RefundRequest.builder()
                .order(order)
                .user(user)
                .reason(req.getReason())
                .reasonDetail(req.getReasonDetail())
                .bankName(req.getBankName())
                .accountNumber(req.getAccountNumber())
                .accountHolder(req.getAccountHolder())
                .refundAmount(req.getRefundAmount())
                .quantity(req.getQuantity() != null ? req.getQuantity() : 1)
                .status(RefundStatus.PENDING)
                .build();

        order.setStatus(OrderStatus.REFUND_PENDING);
        orderRepository.save(order);

        RefundRequest saved = refundRequestRepository.save(refundRequest);
        return refundMapper.toDto(saved);
    }

    @Transactional
    public RefundRequestDto cancelRefundRequest(Long orderId, String userEmail) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        RefundRequest refundRequest = refundRequestRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu hoàn vé"));

        if (!order.getUser().getEmail().equalsIgnoreCase(userEmail)) {
            throw new RuntimeException("Bạn không có quyền hủy yêu cầu này");
        }

        order.setStatus(OrderStatus.PAID);
        orderRepository.save(order);

        refundRequestRepository.delete(refundRequest);
        return null;
    }

    @Transactional(readOnly = true)
    public List<RefundRequestDto> getAllRefundsForAdmin() {
        return refundMapper.toDtoList(refundRequestRepository.findAll());
    }

    @Transactional(readOnly = true)
    public List<RefundRequestDto> getRefundsForOrganizer(String organizerEmail) {
        User organizer = userRepository.findByEmail(organizerEmail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Organizer"));
        return refundMapper.toDtoList(refundRequestRepository.findByOrganizerId(organizer.getId()));
    }

    @Transactional
    public RefundRequestDto approveRefund(Long requestId) {
        RefundRequest request = refundRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu hoàn tiền"));

        request.setStatus(RefundStatus.APPROVED);
        request.setResolvedAt(LocalDateTime.now());

        Order order = request.getOrder();
        order.setStatus(OrderStatus.REFUNDED);
        order.setPaymentStatus(PaymentStatus.REFUNDED);

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
        orderRepository.save(order);

        return refundMapper.toDto(refundRequestRepository.save(request));
    }

    @Transactional
    public RefundRequestDto rejectRefund(Long requestId, ResolveRefundRequest resolveReq) {
        RefundRequest request = refundRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu hoàn tiền"));

        request.setStatus(RefundStatus.REJECTED);
        request.setRejectionReason(resolveReq != null ? resolveReq.getRejectionReason() : "Từ chối hoàn tiền theo chính sách");
        request.setResolvedAt(LocalDateTime.now());

        Order order = request.getOrder();
        order.setStatus(OrderStatus.REJECTED_REFUND);
        orderRepository.save(order);

        return refundMapper.toDto(refundRequestRepository.save(request));
    }
}
