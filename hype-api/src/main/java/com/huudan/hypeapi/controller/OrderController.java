package com.huudan.hypeapi.controller;

import com.huudan.hypeapi.dto.CreateOrderRequest;
import com.huudan.hypeapi.dto.CreateRefundRequest;
import com.huudan.hypeapi.dto.OrderDto;
import com.huudan.hypeapi.dto.RefundRequestDto;
import com.huudan.hypeapi.service.OrderService;
import com.huudan.hypeapi.service.RefundService;
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
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;
    private final RefundService refundService;

    @Autowired
    public OrderController(OrderService orderService, RefundService refundService) {
        this.orderService = orderService;
        this.refundService = refundService;
    }

    @PostMapping
    public ResponseEntity<?> createOrder(
            @AuthenticationPrincipal String email,
            @Valid @RequestBody CreateOrderRequest req,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }
        try {
            OrderDto created = orderService.createOrder(email, req);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping
    public ResponseEntity<List<OrderDto>> getMyOrders(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(orderService.getUserOrders(email));
    }

    @GetMapping("/{orderIdOrCode}")
    public ResponseEntity<?> getOrderDetail(@PathVariable String orderIdOrCode) {
        try {
            return ResponseEntity.ok(orderService.getOrderDetail(orderIdOrCode));
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(
            @PathVariable Long orderId,
            @AuthenticationPrincipal String email) {
        try {
            return ResponseEntity.ok(orderService.cancelOrder(orderId, email));
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/{orderId}/refund-request")
    public ResponseEntity<?> requestRefund(
            @PathVariable Long orderId,
            @AuthenticationPrincipal String email,
            @Valid @RequestBody CreateRefundRequest req,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }
        try {
            RefundRequestDto dto = refundService.createRefundRequest(orderId, email, req);
            return ResponseEntity.status(HttpStatus.CREATED).body(dto);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{orderId}/refund-request/cancel")
    public ResponseEntity<?> cancelRefundRequest(
            @PathVariable Long orderId,
            @AuthenticationPrincipal String email) {
        try {
            refundService.cancelRefundRequest(orderId, email);
            Map<String, String> res = new HashMap<>();
            res.put("message", "Đã hủy yêu cầu hoàn vé thành công");
            return ResponseEntity.ok(res);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
