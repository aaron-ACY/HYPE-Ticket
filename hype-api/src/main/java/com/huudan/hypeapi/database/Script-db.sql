-- =====================================================================
-- EVENT TICKETING PLATFORM - MySQL 8.0+ Schema (FINAL REVIEW v3)
-- Engine: InnoDB | Charset: utf8mb4 | Collation: utf8mb4_unicode_ci
-- Thứ tự tạo bảng đã sắp xếp đúng theo dependency (FK).
-- =====================================================================

DROP DATABASE IF EXISTS event_ticketing;
CREATE DATABASE event_ticketing
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE event_ticketing;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------
-- 1. roles
-- ---------------------------------------------------------------------
CREATE TABLE roles (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code        VARCHAR(30)  NOT NULL,
    name        VARCHAR(100) NOT NULL,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_roles_code UNIQUE (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='ROLE_USER, ROLE_ORGANIZER, ROLE_ADMIN';

-- ---------------------------------------------------------------------
-- 2. users
-- ---------------------------------------------------------------------
CREATE TABLE users (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email           VARCHAR(150)  NOT NULL,
    password_hash   VARCHAR(255)  NOT NULL COMMENT 'BCrypt hash, KHONG luu plaintext',
    full_name       VARCHAR(150)  NOT NULL,
    phone           VARCHAR(20)   NULL,
    avatar_url      VARCHAR(500)  NULL,
    status          VARCHAR(20)   NOT NULL DEFAULT 'ACTIVE',
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at      DATETIME NULL COMMENT 'Soft delete: user co the co lich su order/ticket',
    CONSTRAINT uq_users_email UNIQUE (email),   -- da tu tao index, KHONG them index rieng cho email
    CONSTRAINT chk_users_status CHECK (status IN ('ACTIVE','INACTIVE','BANNED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_users_status ON users(status);

-- ---------------------------------------------------------------------
-- 3. user_roles (many-to-many User <-> Role)
-- ---------------------------------------------------------------------
CREATE TABLE user_roles (
    user_id     BIGINT UNSIGNED NOT NULL,
    role_id     BIGINT UNSIGNED NOT NULL,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. event_categories
-- ---------------------------------------------------------------------
CREATE TABLE event_categories (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    slug        VARCHAR(120) NOT NULL,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_event_categories_slug UNIQUE (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5. events
-- ---------------------------------------------------------------------
CREATE TABLE events (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    organizer_id    BIGINT UNSIGNED NOT NULL,
    category_id     BIGINT UNSIGNED NULL,
    title           VARCHAR(255) NOT NULL,
    slug            VARCHAR(280) NOT NULL,
    description     TEXT NULL,
    thumbnail_url   VARCHAR(500) NULL,
    location        VARCHAR(255) NULL,
    address         VARCHAR(500) NULL,
    start_at        DATETIME NOT NULL,
    end_at          DATETIME NOT NULL,
    status          VARCHAR(20)  NOT NULL DEFAULT 'DRAFT',
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at      DATETIME NULL COMMENT 'Soft delete: giu lich su ve/doanh thu du event bi an',
    CONSTRAINT uq_events_slug UNIQUE (slug),    -- da tu tao index, KHONG them index rieng cho slug
    CONSTRAINT fk_events_organizer FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_events_category  FOREIGN KEY (category_id)  REFERENCES event_categories(id) ON DELETE SET NULL,
    CONSTRAINT chk_events_status CHECK (status IN ('DRAFT','PENDING_APPROVAL','PUBLISHED','REJECTED','CANCELLED','ENDED')),
    CONSTRAINT chk_events_time   CHECK (end_at > start_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_events_category  ON events(category_id);
CREATE INDEX idx_events_status    ON events(status);
CREATE INDEX idx_events_start_at  ON events(start_at);

-- ---------------------------------------------------------------------
-- 6. ticket_types
-- ---------------------------------------------------------------------
CREATE TABLE ticket_types (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    event_id        BIGINT UNSIGNED NOT NULL,
    name            VARCHAR(100)  NOT NULL,
    description     VARCHAR(500)  NULL,
    price           DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    quantity        INT NOT NULL,
    sold_quantity   INT NOT NULL DEFAULT 0,
    sale_start_at   DATETIME NULL,
    sale_end_at     DATETIME NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    version         INT NOT NULL DEFAULT 0 COMMENT 'JPA @Version - optimistic locking, chong oversell',
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at      DATETIME NULL COMMENT 'Soft delete: giu lich su ve da ban',
    CONSTRAINT fk_ticket_types_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT chk_ticket_types_price    CHECK (price >= 0),
    CONSTRAINT chk_ticket_types_quantity CHECK (quantity >= 0),
    CONSTRAINT chk_ticket_types_sold     CHECK (sold_quantity >= 0 AND sold_quantity <= quantity),
    CONSTRAINT chk_ticket_types_status   CHECK (status IN ('ACTIVE','PAUSED','SOLD_OUT','CLOSED')),
    CONSTRAINT chk_ticket_types_sale_window
        CHECK (sale_start_at IS NULL OR sale_end_at IS NULL OR sale_end_at > sale_start_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_ticket_types_event  ON ticket_types(event_id);
CREATE INDEX idx_ticket_types_status ON ticket_types(status);

-- ---------------------------------------------------------------------
-- 7. orders
-- status: PENDING -> CONFIRMED | CANCELLED | EXPIRED
-- subtotal_amount / discount_amount / total_amount: gia tri duoc TINH va GHI
-- boi Spring Boot Service Layer, DB chi rang buoc >= 0, KHONG rang buoc
-- cong thuc (xem giai thich cuoi cau tra loi).
-- ---------------------------------------------------------------------
CREATE TABLE orders (
    id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id          BIGINT UNSIGNED NOT NULL,
    order_code       VARCHAR(40) NOT NULL,
    subtotal_amount  DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT 'Tong tien truoc giam gia (SUM order_items.subtotal)',
    discount_amount  DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT 'So tien duoc giam tu coupon (neu co)',
    total_amount     DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT 'So tien phai thanh toan cuoi cung, tinh o Service Layer',
    status           VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    payment_status   VARCHAR(20) NOT NULL DEFAULT 'UNPAID',
    expires_at       DATETIME NULL COMMENT 'Han giu ve; qua han job se chuyen EXPIRED',
    created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_orders_code UNIQUE (order_code),   -- da tu tao index, KHONG them index rieng
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT chk_orders_subtotal CHECK (subtotal_amount >= 0),
    CONSTRAINT chk_orders_discount CHECK (discount_amount >= 0),
    CONSTRAINT chk_orders_total    CHECK (total_amount >= 0),
    CONSTRAINT chk_orders_status CHECK (status IN ('PENDING','CONFIRMED','CANCELLED','EXPIRED')),
    CONSTRAINT chk_orders_payment_status CHECK (payment_status IN ('UNPAID','PAID','FAILED','REFUNDED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_orders_user       ON orders(user_id);
CREATE INDEX idx_orders_status     ON orders(status);
CREATE INDEX idx_orders_expires_at ON orders(expires_at);

-- ---------------------------------------------------------------------
-- 8. order_items
-- FK -> orders: RESTRICT (khong CASCADE) de bao toan lich su tai chinh.
-- Trong he thong nay, orders/order_items KHONG bao gio bi hard-delete;
-- muon "huy" thi doi orders.status = CANCELLED.
-- ---------------------------------------------------------------------
CREATE TABLE order_items (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id        BIGINT UNSIGNED NOT NULL,
    ticket_type_id  BIGINT UNSIGNED NOT NULL,
    quantity        INT NOT NULL,
    unit_price      DECIMAL(12,2) NOT NULL COMMENT 'Snapshot gia tai thoi diem mua, KHONG doc lai ticket_types.price',
    subtotal        DECIMAL(12,2) NOT NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_items_order       FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT,
    CONSTRAINT fk_order_items_ticket_type FOREIGN KEY (ticket_type_id) REFERENCES ticket_types(id) ON DELETE RESTRICT,
    CONSTRAINT chk_order_items_quantity   CHECK (quantity > 0),
    CONSTRAINT chk_order_items_unit_price CHECK (unit_price >= 0),
    CONSTRAINT chk_order_items_subtotal   CHECK (subtotal = quantity * unit_price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_order_items_order       ON order_items(order_id);
CREATE INDEX idx_order_items_ticket_type ON order_items(ticket_type_id);

-- ---------------------------------------------------------------------
-- 9. tickets
-- FK -> order_items: RESTRICT (ve la bang chung mua hang / QR, khong
-- duoc phep bien mat theo cascade).
-- ---------------------------------------------------------------------
CREATE TABLE tickets (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_item_id   BIGINT UNSIGNED NOT NULL,
    ticket_code     VARCHAR(40)  NOT NULL,
    qr_token        VARCHAR(255) NOT NULL COMMENT 'Random opaque token, khong nhung thong tin nhay cam',
    status          VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    checked_in_at   DATETIME NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_tickets_code     UNIQUE (ticket_code),   -- da tu tao index
    CONSTRAINT uq_tickets_qr_token UNIQUE (qr_token),      -- da tu tao index
    CONSTRAINT fk_tickets_order_item FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE RESTRICT,
    CONSTRAINT chk_tickets_status CHECK (status IN ('ACTIVE','USED','CANCELLED','EXPIRED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_tickets_order_item ON tickets(order_item_id);
CREATE INDEX idx_tickets_status     ON tickets(status);

-- ---------------------------------------------------------------------
-- 10. payments
-- 1 order co the co NHIEU payment attempt (retry).
-- transaction_id NULLABLE: attempt duoc tao truoc khi goi sang cong
-- thanh toan va chua co ma giao dich tra ve; khi callback/webhook den
-- se UPDATE cot nay. UNIQUE(provider, transaction_id) van giu nguyen -
-- MySQL coi moi NULL la khac biet nen nhieu row PENDING cung provider,
-- transaction_id = NULL van hop le.
-- FK -> orders: RESTRICT de khong bao gio mat lich su thanh toan.
-- ---------------------------------------------------------------------
CREATE TABLE payments (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id        BIGINT UNSIGNED NOT NULL,
    provider        VARCHAR(50)  NOT NULL COMMENT 'VNPAY, MOMO, STRIPE, ...',
    transaction_id  VARCHAR(100) NULL COMMENT 'Ma giao dich tu cong thanh toan; NULL cho toi khi co callback',
    amount          DECIMAL(12,2) NOT NULL,
    status          VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    payment_method  VARCHAR(50)  NULL,
    paid_at         DATETIME NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_payments_provider_txn UNIQUE (provider, transaction_id),  -- webhook idempotency key
    CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT,
    CONSTRAINT chk_payments_amount CHECK (amount >= 0),
    CONSTRAINT chk_payments_status CHECK (status IN ('PENDING','SUCCESS','FAILED','REFUNDED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Nhieu row/order = ho tro retry. uq_payments_provider_txn = webhook idempotency key';

CREATE INDEX idx_payments_order        ON payments(order_id);
CREATE INDEX idx_payments_order_status ON payments(order_id, status);
-- KHONG tao them index rieng tren transaction_id: unique index
-- (provider, transaction_id) da du dung cho pattern tra cuu webhook
-- (provider luon biet truoc tu endpoint/config nhan callback).

-- ---------------------------------------------------------------------
-- 11. check_ins (khong luu attempt that bai -> khong can cot status)
-- FK -> tickets: RESTRICT de bao toan bang chung diem danh.
-- ---------------------------------------------------------------------
CREATE TABLE check_ins (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ticket_id       BIGINT UNSIGNED NOT NULL,
    checked_in_by   BIGINT UNSIGNED NOT NULL,
    checked_in_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_check_ins_ticket UNIQUE (ticket_id),   -- da tu tao index
    CONSTRAINT fk_check_ins_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE RESTRICT,
    CONSTRAINT fk_check_ins_staff  FOREIGN KEY (checked_in_by) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='1 row = 1 lan check-in THANH CONG. uq_check_ins_ticket dam bao khong check-in 2 lan';

CREATE INDEX idx_check_ins_staff ON check_ins(checked_in_by);

-- ---------------------------------------------------------------------
-- 12. coupons
-- ---------------------------------------------------------------------
CREATE TABLE coupons (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code                VARCHAR(50)  NOT NULL,
    description         VARCHAR(255) NULL,
    discount_type       VARCHAR(20)  NOT NULL,
    discount_value      DECIMAL(12,2) NOT NULL,
    min_order_amount    DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    max_discount_amount DECIMAL(12,2) NULL,
    usage_limit         INT NULL COMMENT 'NULL = khong gioi han',
    used_count          INT NOT NULL DEFAULT 0,
    start_at            DATETIME NOT NULL,
    end_at              DATETIME NOT NULL,
    status              VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_coupons_code UNIQUE (code),   -- da tu tao index, KHONG them index rieng
    CONSTRAINT chk_coupons_discount_type   CHECK (discount_type IN ('PERCENTAGE','FIXED_AMOUNT')),
    CONSTRAINT chk_coupons_discount_value  CHECK (discount_value > 0),
    CONSTRAINT chk_coupons_percentage_max  CHECK (discount_type <> 'PERCENTAGE' OR discount_value <= 100),
    CONSTRAINT chk_coupons_status CHECK (status IN ('ACTIVE','INACTIVE','EXPIRED')),
    CONSTRAINT chk_coupons_time   CHECK (end_at > start_at),
    CONSTRAINT chk_coupons_min_amount CHECK (min_order_amount >= 0),
    CONSTRAINT chk_coupons_max_discount CHECK (max_discount_amount IS NULL OR max_discount_amount >= 0),
    CONSTRAINT chk_coupons_usage_limit  CHECK (usage_limit IS NULL OR usage_limit > 0),
    CONSTRAINT chk_coupons_used_count   CHECK (used_count >= 0),
    CONSTRAINT chk_coupons_used_within_limit CHECK (usage_limit IS NULL OR used_count <= usage_limit)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_coupons_status ON coupons(status);

-- ---------------------------------------------------------------------
-- 13. coupon_usages
-- FK -> coupons/users/orders: RESTRICT de bao toan lich su khuyen mai.
-- ---------------------------------------------------------------------
CREATE TABLE coupon_usages (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    coupon_id       BIGINT UNSIGNED NOT NULL,
    user_id         BIGINT UNSIGNED NOT NULL,
    order_id        BIGINT UNSIGNED NOT NULL,
    discount_amount DECIMAL(12,2) NOT NULL,
    used_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_coupon_usages_coupon_user UNIQUE (coupon_id, user_id),
    CONSTRAINT uq_coupon_usages_order UNIQUE (order_id),
    CONSTRAINT fk_coupon_usages_coupon FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE RESTRICT,
    CONSTRAINT fk_coupon_usages_user   FOREIGN KEY (user_id)   REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_coupon_usages_order  FOREIGN KEY (order_id)  REFERENCES orders(id) ON DELETE RESTRICT,
    CONSTRAINT chk_coupon_usages_amount CHECK (discount_amount >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='uq_coupon_usages_coupon_user = business rule: 1 user dung 1 coupon toi da 1 lan';

SET FOREIGN_KEY_CHECKS = 1;

