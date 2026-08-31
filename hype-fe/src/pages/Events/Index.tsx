import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Sliders, Grid } from "lucide-react";
import { events } from "../../data/events";
import { categories } from "../../data/categories";
import { EventGrid } from "../../components/events/EventGrid";
import { EventFilter } from "../../components/events/EventFilter";
import { Drawer } from "../../components/common/Drawer";
import { Button } from "../../components/common/Button";

export const Events: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // States matching filters
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get("location") || "");
  const [selectedSort, setSelectedSort] = useState("popular");
  const [maxPrice, setMaxPrice] = useState(4000000);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Sync category and location state if URL parameters change
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    setSelectedCategory(categoryParam || "");

    const locationParam = searchParams.get("location");
    setSelectedLocation(locationParam || "");
  }, [searchParams]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category) {
      searchParams.set("category", category);
    } else {
      searchParams.delete("category");
    }
    setSearchParams(searchParams);
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    if (location) {
      searchParams.set("location", location);
    } else {
      searchParams.delete("location");
    }
    setSearchParams(searchParams);
  };

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
  };

  const handleResetFilters = () => {
    setSelectedCategory("");
    setSelectedLocation("");
    setSelectedSort("popular");
    setMaxPrice(4000000);
    setSearchParams({});
  };

  // Filter & Sort Logic
  const filteredEvents = events
    .filter((evt) => {
      if (selectedCategory && evt.category !== selectedCategory) return false;
      if (selectedLocation && evt.location !== selectedLocation) return false;
      if (evt.priceFrom > maxPrice) return false;
      return true;
    })
    .sort((a, b) => {
      if (selectedSort === "newest") {
        return b.id.localeCompare(a.id);
      }
      if (selectedSort === "priceAsc") {
        return a.priceFrom - b.priceFrom;
      }
      if (selectedSort === "priceDesc") {
        return b.priceFrom - a.priceFrom;
      }
      if (selectedSort === "popular") {
        return b.featured ? 1 : -1;
      }
      return 0;
    });

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-16 text-left bg-bg-main">
      
      {/* Title Header Section */}
      <div className="flex flex-col gap-2 pb-6 border-b border-white/5 mb-10">
        <h1 className="text-3.5xl sm:text-5xl font-black text-white uppercase tracking-tight font-heading">
          Khám Phá Sự Kiện
        </h1>
        <p className="text-sm text-zinc-450 font-semibold leading-relaxed">Tìm kiếm các chương trình nghệ thuật, đêm nhạc & workshop lớn nhất</p>
      </div>

      {/* Category Pills horizontal scroll (Very premium UX) */}
      <div className="mb-10">
        <div className="flex gap-2.5 overflow-x-auto pb-3 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => handleCategoryChange("")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold font-heading uppercase tracking-wider transition-all border ${
              selectedCategory === ""
                ? "bg-brand-primary border-transparent text-white shadow-md shadow-brand-primary/10"
                : "bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white hover:border-white/10"
            }`}
          >
            Tất cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold font-heading uppercase tracking-wider transition-all border whitespace-nowrap ${
                selectedCategory === cat.slug
                  ? "bg-brand-primary border-transparent text-white shadow-md shadow-brand-primary/10"
                  : "bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white hover:border-white/10"
              }`}
            >
              {cat.name.split(" / ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar row */}
      <div className="flex items-center justify-between gap-4 mb-8 bg-bg-secondary border border-white/5 p-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider pl-1.5 font-heading">
          <Grid className="w-4 h-4 text-zinc-550" />
          <span>{filteredEvents.length} kết quả phù hợp</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-white/10 bg-bg-surface text-white hover:bg-white/5 font-heading uppercase text-xs tracking-wider font-bold"
          onClick={() => setIsFilterDrawerOpen(true)}
          leftIcon={<Sliders className="w-4 h-4 text-zinc-400" />}
        >
          Lọc & Sắp xếp
        </Button>
      </div>

      {/* Main grid (3 Columns desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-12">
          <EventGrid events={filteredEvents} />
        </div>
      </div>

      {/* Sidebar Filters Drawer (collapsible drawer keeps layout neat) */}
      <Drawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        title="Bộ Lọc Tìm Kiếm"
        position="right"
      >
        <div className="py-2">
          <EventFilter
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            selectedLocation={selectedLocation}
            onLocationChange={handleLocationChange}
            selectedSort={selectedSort}
            onSortChange={handleSortChange}
            maxPrice={maxPrice}
            onMaxPriceChange={setMaxPrice}
            onReset={handleResetFilters}
          />
        </div>
      </Drawer>
    </div>
  );
};
