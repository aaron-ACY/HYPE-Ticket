-- =====================================================================
-- SEED DATA
-- =====================================================================

INSERT INTO roles (id, code, name) VALUES
  (1, 'ROLE_USER', 'Customers and users'),
  (2, 'ROLE_ORGANIZER', 'Event organizer'),
  (3, 'ROLE_ADMIN', 'Administration');

-- password_hash: BCrypt that, rounds=10, da verify bang thu vien bcrypt
-- (tuong thich Spring Security BCryptPasswordEncoder mac dinh).
-- Plaintext goc cho MOI user seed la: Password123!
-- (chi dung de test local, doi ngay khi deploy that)
-- INSERT INTO users (id, email, password_hash, full_name, phone, status) VALUES
--   (1, 'admin@ticketing.vn',      '$2b$10$wvunwu1b9p/sY7wx51UujuL9swBX4WgnEGvKS7CJZDWe6HI5ZVlQy', 'System Admin',       '0900000001', 'ACTIVE'),
--   (2, 'organizer1@ticketing.vn', '$2b$10$wvunwu1b9p/sY7wx51UujuL9swBX4WgnEGvKS7CJZDWe6HI5ZVlQy', 'Nguyễn Văn Tổ Chức', '0900000002', 'ACTIVE'),
--   (3, 'user1@ticketing.vn',      '$2b$10$wvunwu1b9p/sY7wx51UujuL9swBX4WgnEGvKS7CJZDWe6HI5ZVlQy', 'Trần Thị User Một',  '0900000003', 'ACTIVE'),
--   (4, 'user2@ticketing.vn',      '$2b$10$wvunwu1b9p/sY7wx51UujuL9swBX4WgnEGvKS7CJZDWe6HI5ZVlQy', 'Lê Văn User Hai',    '0900000004', 'ACTIVE');

-- INSERT INTO user_roles (user_id, role_id) VALUES
--   (1, 3),
--   (2, 2),
--   (3, 1),
--   (4, 1);

-- INSERT INTO event_categories (id, name, slug) VALUES
--   (1, 'Âm nhạc', 'am-nhac'),
--   (2, 'Hội thảo', 'hoi-thao'),
--   (3, 'Thể thao', 'the-thao');

-- INSERT INTO events (id, organizer_id, category_id, title, slug, description, location, address, start_at, end_at, status) VALUES
--   (1, 2, 1, 'Đêm nhạc Acoustic Mùa Thu', 'dem-nhac-acoustic-mua-thu',
--      'Chương trình âm nhạc acoustic ngoài trời.', 'Nhà hát Hòa Bình', '240 3/2, Quận 10, TP.HCM',
--      '2026-10-15 19:00:00', '2026-10-15 22:00:00', 'PUBLISHED'),
--   (2, 2, 2, 'Hội thảo Công nghệ AI 2026', 'hoi-thao-cong-nghe-ai-2026',
--      'Hội thảo chia sẻ xu hướng AI mới nhất.', 'Trung tâm Hội nghị Quốc gia', 'Mỹ Đình, Hà Nội',
--      '2026-11-05 08:00:00', '2026-11-05 17:00:00', 'PENDING_APPROVAL');

-- INSERT INTO ticket_types (id, event_id, name, description, price, quantity, sold_quantity, sale_start_at, sale_end_at, status) VALUES
--   (1, 1, 'Early Bird', 'Vé ưu đãi sớm', 250000.00, 100, 0, '2026-08-01 00:00:00', '2026-09-15 23:59:59', 'ACTIVE'),
--   (2, 1, 'Regular',    'Vé thường',     350000.00, 300, 0, '2026-09-16 00:00:00', '2026-10-14 23:59:59', 'ACTIVE'),
--   (3, 1, 'VIP',        'Vé VIP kèm quà tặng', 700000.00, 50, 0, '2026-08-01 00:00:00', '2026-10-14 23:59:59', 'ACTIVE'),
--   (4, 2, 'Regular',    'Vé tham dự hội thảo', 500000.00, 200, 0, '2026-09-01 00:00:00', '2026-11-04 23:59:59', 'ACTIVE');

-- INSERT INTO coupons (id, code, description, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, start_at, end_at, status) VALUES
--   (1, 'WELCOME10', 'Giảm 10% cho đơn đầu tiên', 'PERCENTAGE', 10.00, 200000.00, 100000.00, 500, '2026-08-01 00:00:00', '2026-12-31 23:59:59', 'ACTIVE'),
--   (2, 'FLAT50K',   'Giảm thẳng 50,000đ',        'FIXED_AMOUNT', 50000.00, 300000.00, NULL, 200, '2026-08-01 00:00:00', '2026-12-31 23:59:59', 'ACTIVE');