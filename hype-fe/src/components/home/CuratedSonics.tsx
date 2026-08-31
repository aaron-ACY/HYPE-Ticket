import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Category } from "../../types";

interface CuratedSonicsProps {
  categories: Category[];
}

export const CuratedSonics: React.FC<CuratedSonicsProps> = ({ categories }) => {
  const [activeCategory, setActiveCategory] = useState<Category | null>(categories[0] || null);

  return (
    <section className="relative w-full py-24 sm:py-32 px-6 sm:px-10 lg:px-16 max-w-[1500px] mx-auto text-left">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Cohesive Editorial Manifesto & Interactive Preview Card (Col span 5) */}
        <div className="lg:col-span-5 flex flex-col space-y-6 lg:sticky lg:top-28">
          <div className="space-y-4">
            <div className="flex items-center gap-3 font-tech text-xs text-[#FF176B] uppercase tracking-widest">
              <span>[ 01 ]</span>
              <span>CURATED GENRES & EXPERIENCES</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-[46px] xl:text-[54px] text-[#F5F5F5] uppercase font-black tracking-tight leading-tight sm:leading-[1.18] font-heading select-none whitespace-nowrap">
              <span className="block text-[#F5F5F5]">THỂ LOẠI</span>
              <span className="block pl-6 sm:pl-10 text-[#F5F5F5]">TRẢI NGHIỆM</span>
            </h2>

            <p className="text-sm sm:text-base text-[#B5B5BC] max-w-md font-normal leading-relaxed">
              Tuyển tập các danh mục sự kiện và không gian trình diễn trực tiếp đỉnh cao. Từ những đại nhạc hội quy mô lớn đến các sân khấu nghệ thuật đương đại độc bản.
            </p>
          </div>

          {/* Interactive Floating Preview Card (Luxury Editorial Titanium Frame) */}
          <div className="relative w-full rounded-2xl p-1.5 bg-[#0D0D10] border border-[#24242B] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
            <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-[#050508]">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`absolute inset-0 transition-all duration-700 ease-out ${
                    activeCategory?.id === cat.id ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
                  }`}
                >
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover filter brightness-[0.88] contrast-[1.08]"
                  />
                  {/* Subtle Dark Titanium Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090C] via-transparent to-[#09090C]/35" />
                </div>
              ))}

              {/* Top Glassmorphism Meta Bar */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#050508]/80 border border-white/10 backdrop-blur-md text-[10px] font-tech text-[#F5F5F5]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF176B] animate-ping" />
                  <span className="font-bold tracking-wider">{activeCategory?.slug.toUpperCase()}</span>
                </div>
                <span className="text-[10px] font-tech text-[#85858D] bg-[#050508]/70 px-2 py-0.5 rounded border border-white/5 backdrop-blur-md">
                  STAGE RECORD // '26
                </span>
              </div>

              {/* Bottom Glassmorphism Details Bar */}
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between pointer-events-none z-10">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-tech text-[#FF176B] uppercase tracking-widest block font-bold">
                    CURATED GENRE
                  </span>
                  <h4 className="text-base font-black text-[#F5F5F5] uppercase tracking-tight font-heading leading-tight drop-shadow-md">
                    {activeCategory?.name}
                  </h4>
                </div>

                <div className="text-right">
                  <span className="text-[9px] font-tech text-[#85858D] block tracking-wider">STATUS</span>
                  <span className="text-[11px] font-tech text-[#F5F5F5] font-bold">ACTIVE SHOWS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Giant Typography Interactive List (Col span 7) */}
        <div className="lg:col-span-7 flex flex-col divide-y divide-[#24242B] border-t border-b border-[#24242B]">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id}
              to={`/events?category=${cat.slug}`}
              viewTransition
              onMouseEnter={() => setActiveCategory(cat)}
              className="group py-7 sm:py-9 flex items-center justify-between transition-colors duration-300 hover:text-white cursor-pointer"
            >
              <div className="flex items-baseline gap-6 sm:gap-10">
                <span className="font-tech text-xs text-[#85858D] group-hover:text-white transition-colors">
                  0{idx + 1}
                </span>
                <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#85858D] group-hover:text-[#F5F5F5] group-hover:translate-x-3 transition-all duration-300 uppercase font-heading">
                  {cat.name.split(" / ")[0]}
                </h3>
              </div>

              <div className="flex items-center gap-4">
                <span className="hidden sm:inline font-tech text-xs text-[#85858D] group-hover:text-[#F5F5F5] uppercase tracking-widest">
                  EXPLORE
                </span>
                <div className="w-10 h-10 rounded-full border border-[#24242B] group-hover:border-white group-hover:bg-white text-[#85858D] group-hover:text-[#050507] flex items-center justify-center transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
