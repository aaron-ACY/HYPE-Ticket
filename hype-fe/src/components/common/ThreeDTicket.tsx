import React, { useState, useRef, useEffect } from "react";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";

interface ThreeDTicketProps {
  className?: string;
  title?: string;
  subTitle?: string;
  date?: string;
  time?: string;
  venue?: string;
  seatInfo?: string;
  ticketHolder?: string;
  tokenId?: string;
  tier?: string;
}

export const ThreeDTicket: React.FC<ThreeDTicketProps> = ({
  className = "",
  title = "SUPER ULTRA HYPE PASS",
  subTitle = "OFFICIAL TITANIUM VIP ACCESS",
  date = "12.09.2026",
  time = "19:30",
  venue = "SÂN VẬN ĐỘNG QUÂN KHU 7",
  seatInfo = "ZONE VIP-A • ROW 01 • SEAT 42",
  ticketHolder = "HỮU ĐÀN • VIP PASS",
  tokenId = "HYP-2026-TITANIUM-01",
  tier = "TITANIUM ALL-ACCESS",
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [inView, setInView] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // IntersectionObserver for Scroll Entrance & Security Scanline Sweep
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !inView) {
          setInView(true);
          setIsScanning(true);
          const timer = setTimeout(() => setIsScanning(false), 2000);
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, [inView]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Natural, tactile 3D tilt: rotX max ±10deg, rotY max ±12deg
    const rotX = -((y - centerY) / centerY) * 10;
    const rotY = ((x - centerX) / centerX) * 12;

    const glX = (x / rect.width) * 100;
    const glY = (y / rect.height) * 100;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({ x: glX, y: glY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlarePos({ x: 50, y: 50 });
  };

  return (
    <div
      className={`relative flex items-center justify-center py-6 select-none cursor-pointer ${className}`}
      style={{ perspective: 1000 }}
    >
      {/* 3D Ticket Outer Wrapper with Elevation & Parallax */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative w-[340px] sm:w-[560px] md:w-[620px] aspect-[1.9/1] rounded-2xl will-change-transform"
        style={{
          transformStyle: "preserve-3d",
          opacity: inView ? 1 : 0,
          transform: reducedMotion
            ? "none"
            : inView
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${isHovered ? "scale(1.025)" : "scale(1)"}`
            : "translateY(45px) rotateX(16deg) scale(0.92)",
          transition: isHovered
            ? "transform 0.08s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.25s ease-out"
            : "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out, box-shadow 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
          boxShadow: isHovered
            ? `${-rotateY * 1.5}px ${25 + rotateX * 1.5}px 60px -10px rgba(0, 0, 0, 0.95), 0 0 25px rgba(255, 255, 255, 0.08)`
            : "0 25px 50px -12px rgba(0, 0, 0, 0.9)",
        }}
      >
        {/* Holographic Laser Scanline Sweep on Scroll Entrance */}
        {isScanning && (
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none z-50">
            <div className="w-[140px] h-full bg-gradient-to-r from-transparent via-white/25 via-[#FF176B]/30 to-transparent animate-scanline shadow-[0_0_20px_rgba(255,255,255,0.4)]" />
          </div>
        )}

        {/* ========================================================
            LAYER 0: DARK SATIN TITANIUM BASE & ATMOSPHERIC LIGHTING
            ======================================================== */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden bg-[#0D0D10] border border-[#2A2A30]">
          
          {/* Base Dark Titanium Gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 80% 60% at ${glarePos.x}% ${glarePos.y}%, rgba(27, 27, 33, 0.7) 0%, rgba(20, 20, 25, 0.5) 45%, rgba(9, 9, 12, 0.95) 100%),
                linear-gradient(135deg, #09090C 0%, #0D0D10 35%, #141419 65%, #09090C 100%)
              `,
            }}
          />

          {/* Precision Micro-Grid (Titanium Milling Texture) */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
              `,
              backgroundSize: "24px 24px",
            }}
          />

          {/* Diagonal Satin Sheen Streak */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              background:
                "linear-gradient(105deg, transparent 25%, rgba(255, 255, 255, 0.08) 45%, rgba(27, 27, 33, 0.2) 55%, transparent 75%)",
            }}
          />

          {/* Dynamic Satin Titanium Specular Highlight (Active ONLY on hover) */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: isHovered ? 0.9 : 0,
              background: `
                radial-gradient(circle 280px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.14) 0%, rgba(27, 27, 33, 0.3) 40%, transparent 70%)
              `,
            }}
          />

          {/* ========================================================
              PERFORATION NOTCHES & DOTTED STUB DIVIDER
              ======================================================== */}
          {/* Vertical Perforation Line */}
          <div className="absolute top-0 bottom-0 left-[70%] sm:left-[72%] border-r border-dashed border-[#2A2A30] z-20 pointer-events-none" />

          {/* Top Notch Cutout */}
          <div className="absolute -top-3 left-[70%] sm:left-[72%] -translate-x-1/2 w-6 h-6 rounded-full bg-[#050507] border border-[#2A2A30] shadow-inner z-30" />

          {/* Bottom Notch Cutout */}
          <div className="absolute -bottom-3 left-[70%] sm:left-[72%] -translate-x-1/2 w-6 h-6 rounded-full bg-[#050507] border border-[#2A2A30] shadow-inner z-30" />

          {/* Refined Metallic Inset Rim Border (Clean Silver/Titanium) */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
            style={{
              padding: "1px",
              background: isHovered
                ? "linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, #3A3A42 40%, #2A2A30 70%, rgba(255, 255, 255, 0.3) 100%)"
                : "linear-gradient(135deg, #3A3A42 0%, #2A2A30 60%, #3A3A42 100%)",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />
        </div>

        {/* ========================================================
            LAYER 1: MIDGROUND TITANIUM FOIL (translateZ 25px)
            ======================================================== */}
        <div
          className="absolute inset-0 p-5 sm:p-7 flex flex-col justify-between pointer-events-none"
          style={{ transform: "translateZ(25px)" }}
        >
          {/* Top Satin Titanium Foil Bar */}
          <div className="w-full h-[2px] rounded-full bg-gradient-to-r from-[#2A2A30] via-[#4A4A55] to-[#2A2A30] opacity-80" />

          {/* Ambient Corner Crosshairs */}
          <div className="absolute top-4 right-4 text-[9px] font-mono text-[#85858D] opacity-80">
            + TITANIUM 99.9% // RFID +
          </div>
        </div>

        {/* ========================================================
            LAYER 2: MAIN CONTENT & EVENT TYPOGRAPHY (translateZ 45px)
            ======================================================== */}
        <div
          className="absolute inset-0 p-5 sm:p-7 flex flex-col justify-between pointer-events-auto"
          style={{ transform: "translateZ(45px)" }}
        >
          {/* TOP SECTION: Branding & Security Badge */}
          <div className="flex items-center justify-between">
            {/* Left Brand Identity */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-[#3A3A42] to-[#2A2A30] p-[1px] shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                <div className="w-full h-full bg-[#141419] rounded-[7px] flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-[#FF176B] fill-[#FF176B]" />
                </div>
              </div>

              <div className="flex flex-col text-left">
                <span className="font-extrabold text-sm sm:text-base text-[#F2F2F2] tracking-widest leading-none font-heading flex items-center gap-1">
                  HYPETICKET
                </span>
                <span className="font-mono text-[9px] font-bold text-[#85858D] tracking-wider leading-none mt-0.5">
                  TITANIUM '26
                </span>
              </div>
            </div>

            {/* Top Right Tier Pill */}
            <div className="pr-[30%] sm:pr-[28%] flex items-center">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#141419]/90 border border-[#2A2A30] text-[#F2F2F2] text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider shadow-[0_2px_6px_rgba(0,0,0,0.4)]">
                <Sparkles className="w-3 h-3 text-[#FF176B] animate-pulse" />
                <span>{tier}</span>
              </div>
            </div>
          </div>

          {/* CENTER SECTION: Event Title & Venue Information */}
          <div className="text-left space-y-1.5 pr-[30%] sm:pr-[28%] my-auto">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-[#B5B5BC] uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF176B]" />
                {subTitle}
              </span>
            </div>

            <h2 className="text-lg sm:text-2xl md:text-[26px] font-black text-[#F2F2F2] leading-tight uppercase tracking-tight font-heading line-clamp-2 drop-shadow-sm">
              {title}
            </h2>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-[11px] sm:text-xs font-semibold text-[#B5B5BC] font-heading">
              <span className="text-[#F2F2F2] font-mono font-bold">{date} • {time}</span>
              <span className="text-[#3A3A42]">•</span>
              <span className="truncate max-w-[200px] sm:max-w-none text-[#B5B5BC]">{venue}</span>
            </div>
          </div>

          {/* BOTTOM SECTION: Seat & Token Meta */}
          <div className="flex items-end justify-between pr-[30%] sm:pr-[28%] pt-2 border-t border-[#2A2A30]">
            <div className="text-left space-y-0.5">
              <p className="text-[9px] font-mono uppercase text-[#85858D] tracking-wider">
                VỊ TRÍ / TỌA ĐỘ
              </p>
              <p className="text-xs sm:text-sm font-black text-[#F2F2F2] font-mono tracking-wide">
                {seatInfo}
              </p>
            </div>

            <div className="text-right space-y-0.5 hidden sm:block">
              <p className="text-[9px] font-mono uppercase text-[#85858D] tracking-wider">
                CHỦ SỞ HỮU
              </p>
              <p className="text-xs font-bold text-[#B5B5BC] uppercase font-heading truncate max-w-[140px]">
                {ticketHolder}
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================
            LAYER 3: FOREGROUND STUB & ELEVATED QR CODE (translateZ 65px)
            ======================================================== */}
        <div
          className="absolute top-0 bottom-0 right-0 w-[30%] sm:w-[28%] p-4 sm:p-5 flex flex-col justify-between items-center text-center pointer-events-auto"
          style={{ transform: "translateZ(65px)" }}
        >
          {/* Stub Header */}
          <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-black text-[#B5B5BC] uppercase tracking-widest font-heading pt-1">
            <span>ADMIT ONE</span>
          </div>

          {/* Elevated High-Contrast QR Code Container */}
          <div className="relative group/qr p-2 rounded-xl bg-[#0D0D10] border border-[#2A2A30] shadow-[0_4px_16px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center my-auto transition-transform duration-300 hover:scale-105">
            {/* Ambient Subtle QR Glow */}
            <div className="absolute inset-0 rounded-xl bg-white/[0.03] filter blur-sm pointer-events-none" />

            {/* Crisp High-Contrast White QR Matrix */}
            <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 bg-[#F2F2F2] rounded-lg p-1.5 flex flex-col justify-between shadow-sm">
              {/* Top Row Markers */}
              <div className="flex justify-between w-full">
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[#09090C] p-0.5 rounded-xs flex items-center justify-center">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#F2F2F2] flex items-center justify-center">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#09090C]" />
                  </div>
                </div>
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[#09090C] p-0.5 rounded-xs flex items-center justify-center">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#F2F2F2] flex items-center justify-center">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#09090C]" />
                  </div>
                </div>
              </div>

              {/* Center Decorative Data Blocks */}
              <div className="grid grid-cols-4 gap-0.5 px-0.5">
                <div className="h-1 bg-[#09090C] rounded-xs" />
                <div className="h-1 bg-transparent" />
                <div className="h-1 bg-[#09090C] rounded-xs" />
                <div className="h-1 bg-[#09090C] rounded-xs" />
              </div>

              {/* Bottom Row Marker & Block */}
              <div className="flex justify-between items-end w-full">
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[#09090C] p-0.5 rounded-xs flex items-center justify-center">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#F2F2F2] flex items-center justify-center">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#09090C]" />
                  </div>
                </div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#B5B5BC] rounded-xs" />
              </div>
            </div>

            <div className="mt-1 flex items-center gap-1 text-[8px] font-mono text-[#85858D] font-bold">
              <ShieldCheck className="w-2.5 h-2.5 text-[#FF176B]" />
              <span>ENCRYPTED</span>
            </div>
          </div>

          {/* Clean High-Contrast Titanium Barcode & Token ID */}
          <div className="w-full flex flex-col items-center gap-1 pb-1">
            <div className="flex items-center justify-center gap-[2px] h-5 sm:h-6 w-full max-w-[100px] overflow-hidden opacity-80">
              {Array.from({ length: 28 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-full bg-[#F2F2F2] ${
                    i % 4 === 0 ? "w-[3px]" : i % 2 === 0 ? "w-[1.5px]" : "w-[1px]"
                  }`}
                />
              ))}
            </div>
            <span className="text-[8px] font-mono text-[#85858D] tracking-wider truncate max-w-full">
              {tokenId}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
