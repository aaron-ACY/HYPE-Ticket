import React from "react";
import { CreditCard, Landmark, Wallet } from "lucide-react";

interface PaymentMethodOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
}

interface PaymentMethodProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

export const PaymentMethod: React.FC<PaymentMethodProps> = ({
  selectedMethod,
  onMethodChange,
}) => {
  const methods: PaymentMethodOption[] = [
    {
      id: "MoMo",
      name: "Ví điện tử MoMo",
      description: "Thanh toán siêu tốc qua ứng dụng MoMo",
      icon: <Wallet className="w-5 h-5 text-white" />,
      colorClass: "bg-[#A50064]",
    },
    {
      id: "ZaloPay",
      name: "Ví điện tử ZaloPay",
      description: "Thanh toán an toàn qua ZaloPay QR",
      icon: <Wallet className="w-5 h-5 text-white" />,
      colorClass: "bg-[#0070E0]",
    },
    {
      id: "Visa / Mastercard",
      name: "Thẻ Quốc Tế (Visa / Mastercard / JCB)",
      description: "Hỗ trợ mọi loại thẻ thanh toán quốc tế",
      icon: <CreditCard className="w-5 h-5 text-white" />,
      colorClass: "bg-[#1f1d2e]",
    },
    {
      id: "Banking",
      name: "Chuyển khoản Ngân hàng (VietQR)",
      description: "Quét mã chuyển khoản tức thì 24/7",
      icon: <Landmark className="w-5 h-5 text-white" />,
      colorClass: "bg-emerald-600",
    },
  ];

  return (
    <div className="space-y-3.5 text-left">
      <h3 className="font-bold text-base text-white tracking-wide">Phương Thức Thanh Toán</h3>
      <p className="text-xs text-zinc-500 leading-none">Vui lòng lựa chọn một trong các cổng thanh toán giả lập bên dưới.</p>
      
      <div className="grid grid-cols-1 gap-3.5 mt-4">
        {methods.map((method) => {
          const isSelected = selectedMethod === method.id;
          return (
            <label
              key={method.id}
              onClick={() => onMethodChange(method.id)}
              className={`flex items-start gap-4 p-4 border rounded-2xl cursor-pointer select-none transition-all ${
                isSelected
                  ? "border-[#00F0FF] bg-[#00F0FF]/5 shadow-sm"
                  : "border-white/5 bg-bg-surface/90 hover:border-white/10"
              }`}
            >
              {/* Radio Indicator */}
              <div className="flex items-center justify-center h-5 mt-0.5">
                <input
                  type="radio"
                  name="payment_method"
                  value={method.id}
                  checked={isSelected}
                  onChange={() => {}}
                  className="w-4 h-4 text-brand-primary bg-zinc-950 border-white/10 focus:ring-brand-primary/45 focus:ring-2 accent-brand-primary cursor-pointer"
                />
              </div>

              {/* Logo / Icon */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${method.colorClass}`}
              >
                {method.icon}
              </div>

              {/* Text metadata */}
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-white">{method.name}</p>
                <p className="text-xs text-zinc-500 font-semibold">{method.description}</p>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};
