package com.huudan.hypeapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class RedisService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final StringRedisTemplate stringRedisTemplate;

    // Key Prefixes
    private static final String PREFIX_USER_LOCKED = "user:locked:";
    private static final String PREFIX_TICKET_STOCK = "ticket:stock:";
    private static final String PREFIX_TICKET_HOLD = "ticket:hold:";

    @Autowired
    public RedisService(RedisTemplate<String, Object> redisTemplate, StringRedisTemplate stringRedisTemplate) {
        this.redisTemplate = redisTemplate;
        this.stringRedisTemplate = stringRedisTemplate;
    }

    // ==================== 1. Generic Key-Value Operations ====================

    public void set(String key, Object value) {
        redisTemplate.opsForValue().set(key, value);
    }

    public void set(String key, Object value, Duration timeout) {
        redisTemplate.opsForValue().set(key, value, timeout);
    }

    public Object get(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    public Boolean delete(String key) {
        return redisTemplate.delete(key);
    }

    public Boolean hasKey(String key) {
        return redisTemplate.hasKey(key);
    }

    // ==================== 2. User Status & Lock Realtime Operations ====================

    /**
     * Đánh dấu tài khoản bị khóa trong Redis (ngay lập tức chặn trên mọi request)
     */
    public void setUserLocked(String email) {
        String key = PREFIX_USER_LOCKED + email.toLowerCase().trim();
        stringRedisTemplate.opsForValue().set(key, "LOCKED", Duration.ofHours(24));
    }

    /**
     * Mở khóa tài khoản: xóa key khỏi Redis
     */
    public void removeUserLocked(String email) {
        String key = PREFIX_USER_LOCKED + email.toLowerCase().trim();
        stringRedisTemplate.delete(key);
    }

    /**
     * Kiểm tra nhanh trạng thái LOCKED từ Redis
     * @return true nếu tài khoản bị khóa, false nếu không bị khóa, null nếu chưa có trong cache
     */
    public Boolean isUserLocked(String email) {
        String key = PREFIX_USER_LOCKED + email.toLowerCase().trim();
        Boolean exists = stringRedisTemplate.hasKey(key);
        return Boolean.TRUE.equals(exists);
    }

    // ==================== 3. Ticketing Concurrency & Holding Operations ====================

    /**
     * Khởi tạo số lượng vé vào kho Redis
     */
    public void initTicketStock(String ticketTypeId, int totalQuantity) {
        String key = PREFIX_TICKET_STOCK + ticketTypeId;
        stringRedisTemplate.opsForValue().set(key, String.valueOf(totalQuantity));
    }

    /**
     * Giữ vé tạm thời trong 10 phút khi người dùng vào trang thanh toán (Atomic Decrement)
     * @return true nếu giữ vé thành công, false nếu hết vé
     */
    public boolean holdTickets(String ticketTypeId, int quantity, String orderId) {
        String stockKey = PREFIX_TICKET_STOCK + ticketTypeId;
        
        // Trừ kho nguyên tử trên Redis (thread-safe, không lo race condition)
        Long remaining = stringRedisTemplate.opsForValue().decrement(stockKey, quantity);

        if (remaining != null && remaining >= 0) {
            // Giữ vé tạm 10 phút
            String holdKey = PREFIX_TICKET_HOLD + orderId;
            stringRedisTemplate.opsForValue().set(holdKey, ticketTypeId + ":" + quantity, Duration.ofMinutes(10));
            return true;
        } else {
            // Đã hết vé -> Hoàn lại số lượng đã trừ
            stringRedisTemplate.opsForValue().increment(stockKey, quantity);
            return false;
        }
    }

    /**
     * Hủy giữ vé (người dùng hủy đơn hoặc hết thời gian 10 phút) -> Hoàn lại kho
     */
    public void releaseHoldTickets(String orderId) {
        String holdKey = PREFIX_TICKET_HOLD + orderId;
        String holdData = stringRedisTemplate.opsForValue().get(holdKey);
        
        if (holdData != null) {
            String[] parts = holdData.split(":");
            if (parts.length == 2) {
                String ticketTypeId = parts[0];
                int quantity = Integer.parseInt(parts[1]);
                stringRedisTemplate.opsForValue().increment(PREFIX_TICKET_STOCK + ticketTypeId, quantity);
            }
            stringRedisTemplate.delete(holdKey);
        }
    }
}
