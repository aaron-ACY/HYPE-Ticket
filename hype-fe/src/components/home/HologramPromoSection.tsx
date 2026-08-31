import React, { Suspense, lazy } from "react";
import { Sparkles, ShieldCheck, QrCode, Cpu, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../common/Button";

const Hero3DCanvas = lazy(() =>
  import("./Hero3DCanvas").then((mod) => ({ default: mod.Hero3DCanvas }))
);

export const HologramPromoSection: React.FC = () => {
  return (
    <section className="relative w-full rounded-3xl overflow-hidden glass-card p-8 sm:p-12 lg:p-14 border border-white/10 shadow-2xl text-left">
      {/* Background Neon Spotlights */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-secondary/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
        
        {/* Left Info Column (Col span 6) */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          
          <div className="inline-flex items-center gap-2 p-1.5 px-3.5 bg-brand-primary/15 border border-brand-primary/30 rounded-full w-fit">
            <Sparkles className="w-4 h-4 text-brand-primary animate-pulse" />
            <span className="text-[11px] font-bold text-white uppercase tracking-widest font-heading">
              Công Nghệ Vé Tương Tác 3D
            </span>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight leading-tight font-heading">
              Sở Hữu Tấm Vé <span className="gradient-text">Holographic 3D</span> Độc Bản
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
              Trải nghiệm đặt vé công nghệ thế hệ mới. Khi mua vé VIP tại Hype Ticket, bạn nhận ngay phiên bản vé 3D Hologram độc quyền được bảo chứng bằng mã định danh kỹ thuật số.
            </p>
          </div>

          {/* Feature List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/5">
              <div className="p-2 rounded-xl bg-brand-primary/20 text-brand-primary">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-white uppercase font-heading">Chống Vé Giả</h4>
                <p className="text-[11px] text-zinc-400 font-medium">Mã hoá QR động thay đổi liên tục</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/5">
              <div className="p-2 rounded-xl bg-brand-cyan/20 text-brand-cyan">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-white uppercase font-heading">WebGL Phản Quang</h4>
                <p className="text-[11px] text-zinc-400 font-medium">Xoay và đổi màu theo góc nhìn</p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link to="/events" viewTransition>
              <Button
                variant="gradient"
                size="lg"
                className="px-8 font-heading uppercase text-xs tracking-wider font-bold shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Trải Nghiệm Đặt Vé VIP
              </Button>
            </Link>
          </div>

        </div>

        {/* Right 3D Interactive Model (Col span 6) */}
        <div className="lg:col-span-6 flex items-center justify-center relative">
          <div className="w-full max-w-[480px] aspect-square flex items-center justify-center">
            <Suspense
              fallback={
                <div className="w-full h-80 rounded-3xl bg-white/5 border border-white/10 animate-pulse flex items-center justify-center">
                  <span className="text-xs text-zinc-500">Đang khởi tạo WebGL 3D...</span>
                </div>
              }
            >
              <Hero3DCanvas
                ticketTitle="HYPE WORLD TOUR 2026"
                ticketSub="VIP ALL-ACCESS PASS"
                className="w-full h-full"
              />
            </Suspense>
          </div>
        </div>

      </div>
    </section>
  );
};
