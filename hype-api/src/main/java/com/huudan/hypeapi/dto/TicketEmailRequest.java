package com.huudan.hypeapi.dto;

import lombok.Data;

@Data
public class TicketEmailRequest {
    private String toEmail;
    private String userName;
    private String eventName;
    private String ticketCode;
    private String price;
    private String ticketType;
    private String eventDate;
    private String eventLocation;
    private int quantity;
}
