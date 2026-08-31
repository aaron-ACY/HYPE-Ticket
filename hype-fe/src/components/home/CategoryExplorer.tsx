import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { Compass, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Category } from "../../types";
import { CategoryCard } from "../events/CategoryCard";

interface CategoryExplorerProps {
  categories: Category[];
}

export const CategoryExplorer: React.FC<CategoryExplorerProps> = ({ categories }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 350;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="space-y-6 text-left w-full">
      {/* Header */}
      <div className="flex items-end justify-between border-b border-white/10 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-brand-cyan text-xs font-bold uppercase tracking-widest font-heading">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Trải nghiệm đa thể loại</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight flex items-center gap-2.5 font-heading">
            <Compass className="w-6 h-6 text-brand-primary" />
            Khám Phá Theo Thể Loại
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-medium">
            Lựa chọn gu giải trí tiếp theo phù hợp với năng lượng của bạn
          </p>
        </div>

        {/* Scroll Controls */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll Left"
            className="p-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-bg-surface hover:bg-bg-surface-elevated text-zinc-400 hover:text-white transition-all cursor-pointer shadow-md active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll Right"
            className="p-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-bg-surface hover:bg-bg-surface-elevated text-zinc-400 hover:text-white transition-all cursor-pointer shadow-md active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Category Cards Scroll */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth"
      >
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </section>
  );
};
