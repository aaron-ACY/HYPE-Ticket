import React, { useState } from "react";
import { 
  RefreshCcw, 
  AlertTriangle, 
  Building2, 
  CreditCard, 
  User, 
  HelpCircle, 
  CheckCircle2, 
  ShieldAlert,
  ChevronDown
} from "lucide-react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { Order } from "../../types";

interface RefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  onSubmit: (refundData: {
    reason: string;
    reasonDetail?: string;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    quantity: number;
    refundAmount: number;
  }) => void;
}

const POPULAR_BANKS = [
  "Vietcombank (VCB)",
  "MB Bank (Quân Đội)",
  "Techcombank (TCB)",
  "VietinBank (CTG)",
  "BIDV",
  "VPBank",
  "ACB (Á Châu)",
  "TPBank (Tiên Phong)",
  "Sacombank",
  "HDBank",
  "VIB",
  "Ví MoMo",
  "Ví ZaloPay",
  "Ngân hàng khác",
];

const REFUND_REASONS = [
  "Sự cố cá nhân đột xuất",
  "Trùng lịch trình / Bận công tác đột xuất",
  "Lý do sức khỏe không thể tham dự",
  "Đặt nhầm hạng vé / Mua trùng đơn vé",
  "Sự kiện thay đổi địa điểm hoặc thời gian",
  "Lý do khác",
];

export const RefundModal: React.FC<RefundModalProps> = ({
  isOpen,
  onClose,
  order,
  onSubmit,
}) => {
  const totalTickets = order.items.reduce((acc, item) => acc + item.quantity, 0);
  const unitPrice = totalTickets > 0 ? Math.round(order.total / totalTickets) : order.total;

  const [quantity, setQuantity] = useState<number>(totalTickets);
  const [reason, setReason] = useState<string>(REFUND_REASONS[0]);
  const [reasonDetail, setReasonDetail] = useState<string>("");
  const [bankName, setBankName] = useState<string>(POPULAR_BANKS[0]);
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [accountHolder, setAccountHolder] = useState<string>(order.customerName || "");
  const [agreePolicy, setAgreePolicy] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const calculatedRefundAmount = unitPrice * quantity;

  const formattedRefundAmount = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(calculatedRefundAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!accountNumber.trim()) {
      setErrorMessage("Vui lòng nhập số tài khoản hoặc số điện thoại ví điện tử nhận tiền.");
      return;
    }

    if (!accountHolder.trim()) {
      setErrorMessage("Vui lòng nhập tên chủ tài khoản nhận tiền hoàn.");
      return;
    }

    if (!agreePolicy) {
      setErrorMessage("Bạn cần đồng ý với Điều khoản và Chính sách hoàn vé trước khi tiếp tục.");
      return;
    }

    setIsSubmitting(true);

    try {
      onSubmit({
        reason,
        reasonDetail: reasonDetail.trim() || undefined,
        bankName,
        accountNumber: accountNumber.trim(),
        accountHolder: accountHolder.trim().toUpperCase(),
        quantity,
        refundAmount: calculatedRefundAmount,
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Đã xảy ra lỗi khi gửi yêu cầu hoàn vé.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Yêu Cầu Hoàn / Hủy Vé" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        {/* Banner Alert Policy */}
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-300 uppercase tracking-wide font-tech block">
              LƯU Ý CHÍNH SÁCH HOÀN TIỀN
            </span>
            <p className="text-amber-200/80 leading-relaxed font-normal">
              Yêu cầu hoàn vé sẽ được chuyển đến Ban Tổ Chức và HYPETICKET kiểm duyệt trong vòng 24 - 48h. Khi yêu cầu được chấp thuận, mã vé QR sẽ bị vô hiệu hóa và tiền hoàn sẽ được chuyển trực tiếp vào tài khoản ngân hàng của bạn.
            </p>
          </div>
        </div>

        {/* Order Brief Information */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400">Sự kiện:</span>
            <span className="font-bold text-white uppercase font-heading truncate max-w-[280px]">
              {order.eventTitle}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400">Mã đơn vé:</span>
            <span className="font-mono text-zinc-300 font-bold">{order.id}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400">Hạng vé sở hữu:</span>
            <span className="text-emerald-400 font-bold">
              {order.items.map((it) => `${it.ticketName} (×${it.quantity})`).join(", ")}
            </span>
          </div>
        </div>

        {/* 1. Chọn số lượng vé cần hoàn */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 font-heading">
            1. Số lượng vé muốn hoàn / hủy
          </label>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-white/10 bg-white/[0.04] rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
                className="w-10 h-10 flex items-center justify-center text-lg font-bold text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                -
              </button>
              <span className="w-12 text-center text-sm font-black text-white font-mono">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.min(totalTickets, prev + 1))}
                disabled={quantity >= totalTickets}
                className="w-10 h-10 flex items-center justify-center text-lg font-bold text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                +
              </button>
            </div>
            <span className="text-xs text-zinc-400">
              / Tổng cộng <b>{totalTickets}</b> vé trong đơn
            </span>
          </div>
        </div>

        {/* 2. Lý do hoàn vé */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 font-heading">
            2. Lý do yêu cầu hoàn vé <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-[#0D0D14] border border-white/10 rounded-xl px-4 py-3 text-xs text-white appearance-none focus:outline-none focus:border-brand-primary transition-colors cursor-pointer"
            >
              {REFUND_REASONS.map((r, i) => (
                <option key={i} value={r} className="bg-[#0D0D14] text-white py-2">
                  {r}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <textarea
            value={reasonDetail}
            onChange={(e) => setReasonDetail(e.target.value)}
            placeholder="Ghi chú thêm chi tiết lý do (không bắt buộc)..."
            rows={2}
            className="w-full bg-[#0D0D14] border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-primary transition-colors resize-none mt-2"
          />
        </div>

        {/* 3. Thông tin tài khoản ngân hàng nhận tiền hoàn */}
        <div className="space-y-3.5 pt-2 border-t border-white/5">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 font-heading">
            3. Thông tin tài khoản nhận tiền hoàn <span className="text-rose-400">*</span>
          </label>

          <div className="space-y-3">
            {/* Tên ngân hàng */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                Ngân hàng / Ví điện tử
              </span>
              <div className="relative">
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-[#0D0D14] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white appearance-none focus:outline-none focus:border-brand-primary transition-colors cursor-pointer"
                >
                  {POPULAR_BANKS.map((b, idx) => (
                    <option key={idx} value={b} className="bg-[#0D0D14] text-white">
                      {b}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Số tài khoản */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-zinc-500" />
                Số tài khoản / Số điện thoại ví
              </span>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Ví dụ: 190368888888 hoặc 0901234567"
                required
                className="w-full bg-[#0D0D14] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-primary transition-colors font-mono"
              />
            </div>

            {/* Tên chủ tài khoản */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-zinc-500" />
                Tên chủ tài khoản (Viết hoa không dấu)
              </span>
              <input
                type="text"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value.toUpperCase())}
                placeholder="Ví dụ: NGUYEN VAN A"
                required
                className="w-full bg-[#0D0D14] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-primary transition-colors uppercase font-mono"
              />
            </div>
          </div>
        </div>

        {/* Tổng tiền hoàn ước tính */}
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/25 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-tech">
              SỐ TIỀN HOÀN DỰ KIẾN ({quantity} VÉ)
            </span>
            <p className="text-xs text-zinc-400 font-medium">Được hoàn sau khi BTC duyệt</p>
          </div>
          <span className="text-xl font-black text-emerald-400 font-heading tracking-tight">
            {formattedRefundAmount}
          </span>
        </div>

        {/* Checkbox Đồng ý chính sách */}
        <label className="flex items-start gap-3 cursor-pointer select-none pt-1">
          <input
            type="checkbox"
            checked={agreePolicy}
            onChange={(e) => setAgreePolicy(e.target.checked)}
            className="mt-0.5 rounded border-white/20 bg-white/5 text-brand-primary focus:ring-0 cursor-pointer"
          />
          <span className="text-xs text-zinc-400 leading-relaxed font-normal">
            Tôi xác nhận thông tin tài khoản hoàn tiền là chính xác và đồng ý với{" "}
            <a href="/policies#refund-policy" target="_blank" rel="noreferrer" className="text-brand-primary font-bold hover:underline">
              Chính sách Hoàn tiền & Hủy vé
            </a>{" "}
            của HYPETICKET.
          </span>
        </label>

        {/* Error message if any */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            Đóng
          </button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || !agreePolicy}
            className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider font-heading"
          >
            {isSubmitting ? "Đang gửi..." : "Gửi Yêu Cầu Hoàn Vé"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
