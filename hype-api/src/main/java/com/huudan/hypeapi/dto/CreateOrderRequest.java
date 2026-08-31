package com.huudan.hypeapi.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {
    private Long eventId;
    private String eventTitle;
    private String eventDate;
    private String eventLocation;
    private String eventImage;

    @NotEmpty(message = "Danh sách vé không được để trống")
    private List<OrderItemRequest> items;

    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String paymentMethod;
}
