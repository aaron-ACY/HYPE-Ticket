import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "../common/Button";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-bg-secondary border-t border-white/5 pt-20 pb-10 px-4 sm:px-6 lg:px-12 text-zinc-400 mt-auto text-left">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Branding Column */}
        <div className="flex flex-col gap-5">
          <Link to="/" className="flex items-center gap-2.5 w-fit">
            <div className="w-9 h-9 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="logo-gradient-foot" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D946EF" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
                <rect x="15" y="15" width="14" height="70" rx="3" fill="url(#logo-gradient-foot)" />
                <rect x="71" y="15" width="14" height="70" rx="3" fill="url(#logo-gradient-foot)" />
                <rect x="29" y="47" width="42" height="6" rx="1.5" fill="url(#logo-gradient-foot)" />
              </svg>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white font-heading uppercase">
              HYPE<span className="text-brand-primary">TICKET</span>
            </span>
          </Link>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-semibold">
            Discover events. Live the moment. Nền tảng kết nối trực tiếp những người yêu nghệ thuật, âm nhạc và trải nghiệm sống động tại Việt Nam.
          </p>
          <div className="flex items-center gap-3 mt-2">
            <a href="#" className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-zinc-400 hover:text-white hover:border-white/15 transition-all" title="Instagram">
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="#" className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-zinc-400 hover:text-white hover:border-white/15 transition-all" title="Facebook">
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a href="#" className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-zinc-400 hover:text-white hover:border-white/15 transition-all" title="Youtube">
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.002 3.002 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            <a href="#" className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-zinc-400 hover:text-white hover:border-white/15 transition-all" title="TikTok">
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.525.02c1.31 0 2.57.37 3.66 1.05.24.15.46.32.67.51a6.82 6.82 0 0 0 .5-1.54C17.7.04 18 .02 18.3.02h2.9c.12 0 .22.06.28.16a.43.43 0 0 1 .05.34c-.23 1.34-.87 2.56-1.84 3.49A6.97 6.97 0 0 1 17.5 5.5v5.8c0 4.14-3.36 7.5-7.5 7.5S2.5 15.44 2.5 11.3s3.36-7.5 7.5-7.5c.34 0 .68.02 1 .07V7.24a3.86 3.86 0 0 0-1-.14 3.76 3.76 0 0 0-3.75 3.75 3.76 3.76 0 0 0 3.75 3.75 3.76 3.76 0 0 0 3.75-3.75V0c-.08 0-.15.02-.23.02Z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Explore Links */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6 font-heading">Khám phá</h4>
          <ul className="flex flex-col gap-3.5 text-xs sm:text-sm font-semibold text-zinc-400">
            <li>
              <Link to="/events" className="hover:text-[#D946EF] transition-all">Ca nhạc & Concerts</Link>
            </li>
            <li>
              <Link to="/events" className="hover:text-[#D946EF] transition-all">Lễ hội âm nhạc EDM</Link>
            </li>
            <li>
              <Link to="/events" className="hover:text-[#D946EF] transition-all">Kịch nói & Sân khấu</Link>
            </li>
            <li>
              <Link to="/events" className="hover:text-[#D946EF] transition-all">Hội thảo & Workshop</Link>
            </li>
            <li>
              <Link to="/events" className="hover:text-[#D946EF] transition-all">Thi đấu Thể thao</Link>
            </li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6 font-heading">Quy Trình & Chính Sách</h4>
          <ul className="flex flex-col gap-3.5 text-xs sm:text-sm font-semibold text-zinc-400">
            <li>
              <Link to="/policies?tab=sales-process" className="hover:text-[#D946EF] transition-all">Quy trình mua & bán vé</Link>
            </li>
            <li>
              <Link to="/policies?tab=refund" className="hover:text-[#D946EF] transition-all">Chính sách hoàn tiền & hủy vé</Link>
            </li>
            <li>
              <Link to="/policies?tab=privacy" className="hover:text-[#D946EF] transition-all">Chính sách bảo mật dữ liệu</Link>
            </li>
            <li>
              <Link to="/policies?tab=terms" className="hover:text-[#D946EF] transition-all">Điều khoản sử dụng dịch vụ</Link>
            </li>
            <li>
              <Link to="/become-organizer" className="hover:text-[#D946EF] transition-all">Dành cho Ban Tổ Chức</Link>
            </li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2 font-heading">Cập nhật sự kiện</h4>
          <p className="text-xs sm:text-sm text-zinc-450 leading-relaxed font-semibold">
            Đăng ký nhận tin để không bỏ lỡ các mã giảm giá đặc quyền và các show diễn sớm nhất.
          </p>
          <div className="flex gap-2 mt-2">
            <input
              type="email"
              placeholder="Email của bạn..."
              className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-xs text-white placeholder-zinc-500 transition-colors focus:outline-none focus:border-[#D946EF]/50"
            />
            <Button variant="primary" className="p-3 w-11 h-11 flex items-center justify-center rounded-xl bg-brand-primary">
              <Send className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-semibold">
        <p>&copy; {new Date().getFullYear()} Hype Ticket. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link to="/policies?tab=terms" className="hover:text-white transition-colors">Điều khoản dịch vụ</Link>
          <Link to="/policies?tab=privacy" className="hover:text-white transition-colors">Chính sách bảo mật</Link>
          <Link to="/policies?tab=refund" className="hover:text-white transition-colors">Chính sách hoàn tiền</Link>
        </div>
      </div>
    </footer>
  );
};
