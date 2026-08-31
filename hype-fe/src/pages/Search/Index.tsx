import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search as SearchIcon, ArrowLeft } from "lucide-react";
import { events } from "../../data/events";
import { EventGrid } from "../../components/events/EventGrid";
import { EmptyState } from "../../components/common/EmptyState";

export const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState(events);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const filtered = events.filter(
      (evt) =>
        evt.title.toLowerCase().includes(query.toLowerCase()) ||
        evt.description.toLowerCase().includes(query.toLowerCase()) ||
        evt.venueName.toLowerCase().includes(query.toLowerCase()) ||
        evt.location.toLowerCase().includes(query.toLowerCase()) ||
        evt.category.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-16 text-left min-h-[65vh] flex flex-col bg-bg-main">
      {/* Return button */}
      <Link
        to="/events"
        className="flex items-center gap-2 text-xs font-bold text-zinc-550 hover:text-white transition-colors mb-6 w-fit font-heading uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại Khám phá
      </Link>

      {/* Query Header */}
      <div className="pb-6 border-b border-white/5 mb-8 flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3.5xl font-black text-white uppercase tracking-tight flex items-center gap-3 font-heading">
          <SearchIcon className="w-7 h-7 text-brand-primary" />
          Kết Quả Tìm Kiếm
        </h1>
        <p className="text-sm text-zinc-400 font-semibold">
          Tìm thấy <span className="text-brand-primary font-black">{results.length}</span> kết quả phù hợp cho từ khóa:{" "}
          <span className="text-[#E879F9] font-black italic bg-white/5 border border-white/10 px-2 py-1 rounded font-heading">"{query}"</span>
        </p>
      </div>

      {/* Grid view / Empty view */}
      {results.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-10">
          <div className="w-full max-w-lg">
            <EmptyState
              title={`Không tìm thấy kết quả cho "${query}"`}
              description="Hãy kiểm tra lỗi chính tả hoặc thử lại bằng các từ khóa chung chung hơn như 'concert', 'hà nội', 'rap'."
              actionText="Xem tất cả sự kiện"
              onActionClick={() => window.location.href = "/events"}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1">
          <EventGrid events={results} />
        </div>
      )}
    </div>
  );
};
