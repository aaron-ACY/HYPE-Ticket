import { Order } from "../types";

const ORDERS_KEY = "hype_ticket_orders";

/**
 * Tự động tạo vé mẫu mang thông tin cá nhân của người dùng
 */
export const createSampleOrderForUser = (user: {
  name?: string;
  email: string;
  phone?: string;
}): Order => {
  const userEmail = user.email.trim().toLowerCase();
  const userName = user.name || userEmail.split("@")[0];
  const userPhone = user.phone || "0901234567";

  const sampleOrder: Order = {
    id: `HT-${Math.floor(100000 + Math.random() * 900000)}-SAMPLE`,
    eventId: "evt_1",
    eventTitle: "Indie Music Festival 2026 - Thanh Âm Tự Do",
    eventDate: "12/09/2026",
    eventLocation: "Sân vận động Quân Khu 7 (TP. Hồ Chí Minh)",
    eventImage:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200",
    items: [
      {
        ticketName: "ALL-ACCESS VIP PASS",
        price: 1899000,
        quantity: 1,
      },
    ],
    subtotal: 1899000,
    fee: 10000,
    total: 1909000,
    customerName: userName,
    customerEmail: userEmail,
    customerPhone: userPhone,
    paymentMethod: "Ví điện tử MoMo",
    createdAt: new Date().toISOString(),
    isSample: true,
  };

  saveOrder(sampleOrder);
  return sampleOrder;
};

/**
 * Lấy danh sách vé. Nếu tài khoản mới chưa có vé nào, tự động cấp 1 vé mẫu mang thông tin của họ.
 */
export const getOrders = (
  userEmail?: string,
  userProfile?: { name?: string; phone?: string }
): Order[] => {
  const data = localStorage.getItem(ORDERS_KEY);
  let allOrders: Order[] = [];

  if (data) {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        allOrders = parsed;
      }
    } catch {
      allOrders = [];
    }
  }

  if (userEmail && userEmail.trim()) {
    const emailKey = userEmail.trim().toLowerCase();
    const userOrders = allOrders.filter(
      (o: Order) =>
        o.customerEmail &&
        o.customerEmail.trim().toLowerCase() === emailKey
    );

    // Nếu tài khoản này chưa có vé nào, tự động tạo 1 vé mẫu chính chủ
    if (userOrders.length === 0) {
      const newSample = createSampleOrderForUser({
        email: emailKey,
        name: userProfile?.name,
        phone: userProfile?.phone,
      });
      return [newSample];
    }

    return userOrders;
  }

  return allOrders;
};

export const saveOrder = (order: Order): void => {
  const data = localStorage.getItem(ORDERS_KEY);
  let currentOrders: Order[] = [];
  if (data) {
    try {
      currentOrders = JSON.parse(data);
      if (!Array.isArray(currentOrders)) currentOrders = [];
    } catch {
      currentOrders = [];
    }
  }

  // Loại bỏ order trùng id (nếu đã tồn tại) và thêm order mới lên đầu
  const filtered = currentOrders.filter((o) => o.id !== order.id);
  const newOrders = [order, ...filtered];
  localStorage.setItem(ORDERS_KEY, JSON.stringify(newOrders));
};

export const getOrderById = (id: string): Order | undefined => {
  const data = localStorage.getItem(ORDERS_KEY);
  if (!data) return undefined;
  try {
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return undefined;
    return parsed.find((o: Order) => o.id === id);
  } catch {
    return undefined;
  }
};

export const deleteOrder = (id: string): void => {
  const data = localStorage.getItem(ORDERS_KEY);
  if (!data) return;
  try {
    const currentOrders = JSON.parse(data);
    if (!Array.isArray(currentOrders)) return;
    const updatedOrders = currentOrders.filter((o: Order) => o.id !== id);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));
  } catch {
    // ignore
  }
};

/**
 * Gửi yêu cầu hoàn/hủy vé
 */
export const requestRefund = (
  orderId: string,
  refundData: {
    reason: string;
    reasonDetail?: string;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    quantity: number;
    refundAmount: number;
  }
): Order | null => {
  const order = getOrderById(orderId);
  if (!order) return null;

  const updatedOrder: Order = {
    ...order,
    status: "REFUND_PENDING",
    refundRequest: {
      requestedAt: new Date().toISOString(),
      reason: refundData.reason,
      reasonDetail: refundData.reasonDetail,
      bankName: refundData.bankName,
      accountNumber: refundData.accountNumber,
      accountHolder: refundData.accountHolder.toUpperCase(),
      quantity: refundData.quantity,
      refundAmount: refundData.refundAmount,
      status: "PENDING",
    },
  };

  saveOrder(updatedOrder);
  return updatedOrder;
};

/**
 * Rút lại / Hủy yêu cầu hoàn vé
 */
export const cancelRefundRequest = (orderId: string): Order | null => {
  const order = getOrderById(orderId);
  if (!order) return null;

  const updatedOrder: Order = {
    ...order,
    status: "PAID",
    refundRequest: undefined,
  };

  saveOrder(updatedOrder);
  return updatedOrder;
};

/**
 * Ban tổ chức / Admin duyệt hoàn vé
 */
export const approveRefund = (orderId: string): Order | null => {
  const order = getOrderById(orderId);
  if (!order || !order.refundRequest) return null;

  const updatedOrder: Order = {
    ...order,
    status: "REFUNDED",
    refundRequest: {
      ...order.refundRequest,
      status: "APPROVED",
      resolvedAt: new Date().toISOString(),
    },
  };

  saveOrder(updatedOrder);
  return updatedOrder;
};

/**
 * Ban tổ chức / Admin từ chối hoàn vé
 */
export const rejectRefund = (orderId: string, rejectionReason: string): Order | null => {
  const order = getOrderById(orderId);
  if (!order || !order.refundRequest) return null;

  const updatedOrder: Order = {
    ...order,
    status: "REJECTED_REFUND",
    refundRequest: {
      ...order.refundRequest,
      status: "REJECTED",
      rejectionReason: rejectionReason,
      resolvedAt: new Date().toISOString(),
    },
  };

  saveOrder(updatedOrder);
  return updatedOrder;
};

