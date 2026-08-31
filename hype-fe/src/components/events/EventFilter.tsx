import React from "react";
import { SlidersHorizontal, MapPin, Grid, DollarSign, X } from "lucide-react";
import { categories } from "../../data/categories";

interface EventFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  selectedSort: string;
  onSortChange: (sort: string) => void;
  maxPrice: number;
  onMaxPriceChange: (price: number) => void;
  onReset: () => void;
}

export const EventFilter: React.FC<EventFilterProps> = ({
  selectedCategory,
  onCategoryChange,
  selectedLocation,
  onLocationChange,
  selectedSort,
  onSortChange,
  maxPrice,
  onMaxPriceChange,
  onReset,
}) => {
  const locations = [
    { value: "", label: "Tất cả địa điểm" },
    { value: "TP. Hồ Chí Minh", label: "TP. Hồ Chí Minh" },
    { value: "Hà Nội", label: "Hà Nội" },
    { value: "Đà Nẵng", label: "Đà Nẵng" },
  ];

  const sortOptions = [
    { value: "popular", label: "Phổ biến nhất" },
    { value: "newest", label: "Mới nhất" },
    { value: "priceAsc", label: "Giá thấp đến cao" },
    { value: "priceDesc", label: "Giá cao xuống thấp" },
  ];

  const formattedMaxPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(maxPrice);

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Filter title & reset */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <h4 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-brand-primary" />
          Bộ Lọc Tìm Kiếm
        </h4>
        <button
          onClick={onReset}
          className="text-xs text-zinc-500 hover:text-brand-primary font-bold transition-colors flex items-center gap-1"
        >
          <X className="w-3.5 h-3.5" />
          Xóa bộ lọc
        </button>
      </div>

      {/* Sorting */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 leading-none">
          Sắp xếp theo
        </label>
        <div className="flex flex-col gap-1.5">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSortChange(opt.value)}
              className={`text-left text-xs py-2.5 px-3.5 rounded-xl border transition-all font-semibold ${
                selectedSort === opt.value
                  ? "bg-brand-primary/10 border-brand-primary/30 text-white font-bold"
                  : "bg-bg-surface border-white/5 text-zinc-400 hover:border-white/10 hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 leading-none">
          <Grid className="w-3.5 h-3.5 text-zinc-500" />
          Thể loại
        </label>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => onCategoryChange("")}
            className={`text-left text-xs py-2.5 px-3.5 rounded-xl border transition-all font-semibold ${
              selectedCategory === ""
                ? "bg-brand-primary/10 border-brand-primary/30 text-white font-bold"
                : "bg-bg-surface border-white/5 text-zinc-400 hover:border-white/10 hover:text-white"
            }`}
          >
            Tất cả thể loại
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => onCategoryChange(cat.slug)}
              className={`text-left text-xs py-2.5 px-3.5 rounded-xl border transition-all font-semibold ${
                selectedCategory === cat.slug
                  ? "bg-brand-primary/10 border-brand-primary/30 text-white font-bold"
                  : "bg-bg-surface border-white/5 text-zinc-400 hover:border-white/10 hover:text-white"
              }`}
            >
              {cat.name.split(" / ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Locations */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 leading-none">
          <MapPin className="w-3.5 h-3.5 text-zinc-500" />
          Địa điểm
        </label>
        <div className="flex flex-col gap-1.5">
          {locations.map((loc) => (
            <button
              key={loc.value}
              onClick={() => onLocationChange(loc.value)}
              className={`text-left text-xs py-2.5 px-3.5 rounded-xl border transition-all font-semibold ${
                selectedLocation === loc.value
                  ? "bg-brand-primary/10 border-brand-primary/30 text-white font-bold"
                  : "bg-bg-surface border-white/5 text-zinc-400 hover:border-white/10 hover:text-white"
              }`}
            >
              {loc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Slider */}
      <div className="space-y-3.5">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 leading-none">
            <DollarSign className="w-3.5 h-3.5 text-zinc-500" />
            Giá tối đa
          </label>
          <span className="text-xs font-bold text-[#00F0FF]">{formattedMaxPrice}</span>
        </div>
        <input
          type="range"
          min="180000"
          max="4000000"
          step="50000"
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
          className="w-full h-1 bg-[#181720] rounded-lg appearance-none cursor-pointer accent-[#00F0FF] focus:outline-none"
        />
        <div className="flex justify-between text-[9px] text-zinc-500 font-bold uppercase leading-none">
          <span>180Kđ</span>
          <span>4Mđ</span>
        </div>
      </div>
    </div>
  );
};
