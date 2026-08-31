package com.huudan.hypeapi.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String mailFrom;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Gửi email xác nhận mua vé thành công với giao diện chuyên nghiệp kiểu vé điện tử
     */
    public void sendTicketSuccessEmail(String toEmail, String userName, String eventName,
                                        String ticketCode, String price,
                                        String ticketType, String eventDate,
                                        String eventLocation, int quantity) {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(mailFrom);
            helper.setTo(toEmail);
            helper.setSubject("🎟️ Xác nhận đặt vé thành công - " + eventName);

            String qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=" + ticketCode;

            String htmlContent = "<!DOCTYPE html>" +
                "<html><head><meta charset='UTF-8'></head>" +
                "<body style='margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;'>" +

                // ===== Container =====
                "<table width='100%' cellpadding='0' cellspacing='0' style='background-color:#f4f4f5;padding:30px 0;'>" +
                "<tr><td align='center'>" +
                "<table width='480' cellpadding='0' cellspacing='0' style='background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);'>" +

                // ===== Header =====
                "<tr><td style='background: linear-gradient(135deg,#7c3aed,#a855f7,#c084fc);padding:28px 32px;text-align:center;'>" +
                "  <h1 style='margin:0;color:#ffffff;font-size:26px;font-weight:900;letter-spacing:2px;text-transform:uppercase;'>HYPE TICKET</h1>" +
                "  <p style='margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:11px;letter-spacing:1.5px;text-transform:uppercase;'>Electronic Ticket Confirmation</p>" +
                "</td></tr>" +

                // ===== Event Banner =====
                "<tr><td style='background-color:#18181b;padding:24px 32px;text-align:center;border-bottom:2px dashed #3f3f46;'>" +
                "  <p style='margin:0 0 6px;color:#a78bfa;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;'>SỰ KIỆN THAM DỰ</p>" +
                "  <h2 style='margin:0;color:#ffffff;font-size:20px;font-weight:800;text-transform:uppercase;line-height:1.3;'>" + eventName + "</h2>" +
                "</td></tr>" +

                // ===== QR Code + Ticket Info =====
                "<tr><td style='padding:24px 32px;'>" +
                "<table width='100%' cellpadding='0' cellspacing='0'>" +
                "<tr>" +

                // -- QR Code Column --
                "<td width='180' valign='top' style='padding-right:20px;'>" +
                "  <div style='background:#fafafa;border:2px solid #e4e4e7;border-radius:12px;padding:12px;text-align:center;'>" +
                "    <img src='" + qrCodeUrl + "' alt='QR Code' width='150' height='150' style='display:block;margin:0 auto;' />" +
                "    <p style='margin:8px 0 0;color:#71717a;font-size:9px;font-weight:600;letter-spacing:0.5px;'>Quét mã để check-in</p>" +
                "  </div>" +
                "</td>" +

                // -- Ticket Details Column --
                "<td valign='top'>" +
                "  <table width='100%' cellpadding='0' cellspacing='0' style='font-size:13px;'>" +

                // Mã đơn
                "  <tr>" +
                "    <td style='padding:6px 0;color:#a1a1aa;font-size:11px;font-weight:600;'>Mã đơn:</td>" +
                "  </tr>" +
                "  <tr>" +
                "    <td style='padding:0 0 12px;color:#7c3aed;font-size:15px;font-weight:800;font-family:monospace;letter-spacing:0.5px;'>" + ticketCode + "</td>" +
                "  </tr>" +

                // Loại vé
                "  <tr>" +
                "    <td style='padding:6px 0;color:#a1a1aa;font-size:11px;font-weight:600;'>Loại vé:</td>" +
                "  </tr>" +
                "  <tr>" +
                "    <td style='padding:0 0 12px;color:#18181b;font-size:14px;font-weight:700;'>" + ticketType + " × " + quantity + "</td>" +
                "  </tr>" +

                // Tổng tiền
                "  <tr>" +
                "    <td style='padding:6px 0;color:#a1a1aa;font-size:11px;font-weight:600;'>Tổng tiền:</td>" +
                "  </tr>" +
                "  <tr>" +
                "    <td style='padding:0 0 6px;color:#059669;font-size:17px;font-weight:900;'>" + price + "</td>" +
                "  </tr>" +

                "  </table>" +
                "</td>" +
                "</tr>" +
                "</table>" +
                "</td></tr>" +

                // ===== Dashed Separator (tear-off effect) =====
                "<tr><td>" +
                "<table width='100%' cellpadding='0' cellspacing='0'><tr>" +
                "<td style='height:0;border-top:2px dashed #e4e4e7;font-size:0;line-height:0;'>&nbsp;</td>" +
                "</tr></table>" +
                "</td></tr>" +

                // ===== Event Details Section =====
                "<tr><td style='padding:20px 32px 24px;'>" +

                // Location row
                "<table width='100%' cellpadding='0' cellspacing='0' style='margin-bottom:14px;'>" +
                "<tr>" +
                "<td width='28' valign='top'>" +
                "  <div style='width:24px;height:24px;background-color:#f3e8ff;border-radius:6px;text-align:center;line-height:24px;font-size:13px;'>📍</div>" +
                "</td>" +
                "<td style='padding-left:10px;'>" +
                "  <p style='margin:0;color:#a1a1aa;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1px;'>Địa điểm</p>" +
                "  <p style='margin:3px 0 0;color:#27272a;font-size:13px;font-weight:600;'>" + eventLocation + "</p>" +
                "</td>" +
                "</tr></table>" +

                // Date row
                "<table width='100%' cellpadding='0' cellspacing='0' style='margin-bottom:14px;'>" +
                "<tr>" +
                "<td width='28' valign='top'>" +
                "  <div style='width:24px;height:24px;background-color:#e0f2fe;border-radius:6px;text-align:center;line-height:24px;font-size:13px;'>📅</div>" +
                "</td>" +
                "<td style='padding-left:10px;'>" +
                "  <p style='margin:0;color:#a1a1aa;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1px;'>Thời gian</p>" +
                "  <p style='margin:3px 0 0;color:#27272a;font-size:13px;font-weight:600;'>" + eventDate + "</p>" +
                "</td>" +
                "</tr></table>" +

                // Customer row
                "<table width='100%' cellpadding='0' cellspacing='0'>" +
                "<tr>" +
                "<td width='28' valign='top'>" +
                "  <div style='width:24px;height:24px;background-color:#fce7f3;border-radius:6px;text-align:center;line-height:24px;font-size:13px;'>👤</div>" +
                "</td>" +
                "<td style='padding-left:10px;'>" +
                "  <p style='margin:0;color:#a1a1aa;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1px;'>Người mua</p>" +
                "  <p style='margin:3px 0 0;color:#27272a;font-size:13px;font-weight:600;'>" + userName + " (" + toEmail + ")</p>" +
                "</td>" +
                "</tr></table>" +

                "</td></tr>" +

                // ===== Terms & Conditions =====
                "<tr><td style='padding:0 32px 24px;'>" +
                "<div style='background-color:#fafafa;border:1px solid #e4e4e7;border-radius:10px;padding:16px 18px;'>" +
                "  <p style='margin:0 0 8px;color:#52525b;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;'>Điều khoản & Lưu ý</p>" +
                "  <ul style='margin:0;padding-left:16px;color:#71717a;font-size:11px;line-height:1.8;'>" +
                "    <li>Vé này chỉ dành cho <b>1 người</b> vào cửa.</li>" +
                "    <li>Không hoàn tiền cho vé đã thanh toán.</li>" +
                "    <li>Vui lòng xuất trình <b>mã QR</b> hoặc <b>mã vé</b> khi check-in.</li>" +
                "    <li>Người mua phải trình CCCD/CMND xác minh danh tính.</li>" +
                "    <li>Khi mua vé, bạn đã đồng ý với các điều khoản sử dụng tại <span style='color:#7c3aed;font-weight:600;'>hypeticket.vn</span></li>" +
                "  </ul>" +
                "</div>" +
                "</td></tr>" +

                // ===== Footer =====
                "<tr><td style='background-color:#18181b;padding:20px 32px;text-align:center;border-radius:0 0 16px 16px;'>" +
                "  <p style='margin:0;color:#a1a1aa;font-size:11px;'>Email tự động từ hệ thống <span style='color:#a78bfa;font-weight:700;'>Hype Ticket</span>. Vui lòng không trả lời.</p>" +
                "  <p style='margin:6px 0 0;color:#52525b;font-size:10px;'>© 2026 Hype Ticket. All rights reserved.</p>" +
                "</td></tr>" +

                "</table>" +
                "</td></tr></table>" +
                "</body></html>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
            System.out.println("Email xác nhận đã gửi thành công tới: " + toEmail);
        } catch (Exception e) {
            System.err.println("Lỗi gửi email xác nhận đặt vé: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Gửi email thất bại: " + e.getMessage(), e);
        }
    }
}
