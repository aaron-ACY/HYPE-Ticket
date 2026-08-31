import React from "react";
import { ArrowRight, Shield, Sparkles, Key } from "lucide-react";

export const ManifestoLounge: React.FC = () => {
  return (
    <section className="relative w-full py-28 sm:py-36 bg-[#08080d] border-t editorial-border text-left overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Top Header */}
        <div className="flex items-center gap-3 font-tech text-xs text-rose-500 uppercase tracking-widest pb-12">
          <span>[ 05 ]</span>
          <span>THE HYPETICKET MANIFESTO & VIP PRIVILEGES</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Oversized Statement (Col span 7) */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="display-title text-white uppercase font-black tracking-tight leading-tight sm:leading-[1.15]">
              CHUẨN MỰC MỚI <br />
              <span className="text-zinc-500">CỦA NGHỆ THUẬT</span> <br />
              TRÌNH DIỄN TRỰC TIẾP
            </h2>

            <p className="text-base sm:text-lg text-zinc-300 max-w-xl font-normal leading-relaxed">
              Chúng tôi xoá bỏ hoàn toàn nỗi lo vé giả, vé chợ đen bằng công nghệ định danh kỹ thuật số và kiến trúc phân phối bảo mật độc quyền. Mỗi tấm vé là một lời cam kết cho trải nghiệm giải trí hoàn hảo nhất.
            </p>
          </div>

          {/* Right Column: Privilege Points & Drop Access Form (Col span 5) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4 font-tech text-xs divide-y editorial-border border-t border-b editorial-border">
              
              <div className="py-4 flex items-start gap-4">
                <Key className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-white font-bold uppercase">PRIORITY TICKET DROPS</h4>
                  <p className="text-zinc-400 text-[11px]">Đặc quyền mua vé trước 24 giờ cho các tour diễn quốc tế có số lượng giới hạn.</p>
                </div>
              </div>

              <div className="py-4 flex items-start gap-4">
                <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-white font-bold uppercase">VIP LOUNGE & SOUNDCHECK</h4>
                  <p className="text-zinc-400 text-[11px]">Lối đi riêng Fast-track, phòng chờ VIP và vé xem duyệt âm thanh cùng nghệ sĩ.</p>
                </div>
              </div>

              <div className="py-4 flex items-start gap-4">
                <Shield className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-white font-bold uppercase">100% BUYER PROTECTION</h4>
                  <p className="text-zinc-400 text-[11px]">Bảo hiểm hoàn tiền 100% khi sự kiện có thay đổi lịch trình hoặc bị huỷ.</p>
                </div>
              </div>

            </div>

            {/* Newsletter Input for drops */}
            <div className="space-y-2">
              <label className="block font-tech text-xs text-zinc-400 uppercase tracking-wider">
                Đăng ký nhận thông báo đợt mở bán độc quyền
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  placeholder="name@email.com"
                  className="bg-[#050508] border editorial-border rounded-full px-5 py-3.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500 flex-grow font-tech"
                />
                <button className="px-6 py-3.5 rounded-full bg-white hover:bg-rose-500 text-black hover:text-white font-heading font-black text-xs uppercase tracking-widest transition-all duration-300 active:scale-95 cursor-pointer">
                  JOIN
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
