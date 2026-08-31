import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Cpu, ArrowRight } from "lucide-react";
import { ThreeDTicket } from "../common/ThreeDTicket";

export const Exhibition3DPass: React.FC = () => {
  return (
    <section className="relative w-full py-28 sm:py-36 bg-[#050507] border-b border-[#24242B] text-left overflow-hidden">
      
      <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        
        {/* Header Line */}
        <div className="flex items-center justify-between font-tech text-xs text-[#85858D] uppercase tracking-widest pb-12 border-b border-[#24242B]">
          <div className="flex items-center gap-3 text-[#FF176B]">
            <span>[ 03 ]</span>
            <span>OBJECT 01 — THE HOLOGRAPHIC RELIC</span>
          </div>
          <span className="hidden sm:inline text-[#85858D]">ENCRYPTED DIGITAL PASS</span>
        </div>

        {/* Exhibition Content & Interactive 3D Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center pt-12">
          
          {/* Left Column: Technical Specifications & Editorial Content */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 className="display-title text-[#F5F5F5] uppercase font-black tracking-tight leading-tight sm:leading-[1.15]">
                TẤM VÉ 3D <br />
                <span className="text-[#FF176B]">
                  ĐỘC BẢN
                </span>
              </h2>

              <p className="text-sm sm:text-base text-[#B5B5BC] font-normal leading-relaxed">
                Khi sở hữu vé VIP tại Hype Ticket, toàn bộ dữ liệu vị trí và quyền truy cập được đúc thành một hiện vật kỹ thuật số 3D tương tác. Có thể lưu trữ trong ví số và kích hoạt cửa an ninh không chạm.
              </p>
            </div>

            {/* Technical Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-tech text-xs pt-2">
              <div className="p-4 rounded-xl border border-[#24242B] hover:border-[#34343D] bg-[#0B0B0F] transition-colors duration-300 space-y-1.5">
                <div className="text-[#FF176B] font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[#F5F5F5]">DYNAMIC QR CODE</span>
                </div>
                <p className="text-[#85858D] text-[11px] leading-relaxed">
                  Thuật toán xoay mã bảo mật chống chụp màn hình và sang nhượng trái phép.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#24242B] hover:border-[#34343D] bg-[#0B0B0F] transition-colors duration-300 space-y-1.5">
                <div className="text-[#FF176B] font-bold flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  <span className="text-[#F5F5F5]">SATIN TITANIUM SHADER</span>
                </div>
                <p className="text-[#85858D] text-[11px] leading-relaxed">
                  Phản quang ánh kim satin và hiệu ứng bắt sáng theo con trỏ chuột.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/events"
                viewTransition
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full border border-[#34343D] hover:border-[#FF176B] bg-[#111116] hover:bg-[#FF176B] text-[#F5F5F5] hover:text-[#050507] text-xs font-black tracking-widest uppercase transition-all duration-300 font-heading active:scale-95"
              >
                <span>EXPLORE VIP SHOWS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Expansive 3D Holographic Model Exhibition (Col span 7) */}
          <div className="lg:col-span-7 flex items-center justify-center relative min-h-[460px] sm:min-h-[560px]">
            <div className="w-full h-full flex items-center justify-center">
              <ThreeDTicket 
                title="SUPER ULTRA HYPE PASS"
                subTitle="OFFICIAL VIP ALL-ACCESS"
                date="12.09.2026"
                time="19:30"
                venue="SÂN VẬN ĐỘNG QUÂN KHU 7"
                seatInfo="ZONE VIP-A • ROW 01 • SEAT 42"
                ticketHolder="HỮU ĐÀN • VIP PASS"
                tokenId="HYP-2026-X99420"
                tier="VIP ALL-ACCESS"
                className="scale-95 sm:scale-100 lg:scale-105"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
