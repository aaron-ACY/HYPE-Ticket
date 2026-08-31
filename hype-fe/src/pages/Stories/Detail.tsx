import React, { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, Share2, Ticket, ChevronRight, Sparkles, User } from "lucide-react";
import { articles } from "../../data/articles";
import { events } from "../../data/events";

export const StoryDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find((art) => art.slug === slug);

  useEffect(() => {
    if (article) {
      document.title = `${article.title} | HYPETICKET Editorial`;
    }
  }, [article]);

  if (!article) {
    return <Navigate to="/stories" replace />;
  }

  const relatedEvent = article.relatedEventSlug
    ? events.find((ev) => ev.slug === article.relatedEventSlug)
    : null;

  const moreArticles = articles
    .filter((art) => art.id !== article.id)
    .slice(0, 3);

  const formattedEventPrice = relatedEvent
    ? new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }).format(relatedEvent.priceFrom)
    : null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Đã sao chép liên kết bài viết vào clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-[#F5F5F5] pb-24 text-left">
      
      {/* 1. Top Navigation Bar */}
      <div className="w-full border-b border-[#24242B] bg-[#09090C]/80 backdrop-blur-md sticky top-[76px] z-30">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 py-3.5 flex items-center justify-between">
          <Link
            to="/stories"
            className="inline-flex items-center gap-2 text-xs font-tech text-[#85858D] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>TẤT CẢ BÀI VIẾT</span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14141C] border border-[#24242B] hover:border-white/20 text-xs font-tech text-[#B5B5BC] hover:text-white transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>CHIA SẺ</span>
          </button>
        </div>
      </div>

      <article className="max-w-[1000px] mx-auto px-6 sm:px-10 pt-12 space-y-10">
        
        {/* 2. Article Header */}
        <header className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111116] border border-[#24242B] text-xs font-tech text-[#FF176B]">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-bold uppercase tracking-widest">{article.categoryName}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase font-heading tracking-tight text-[#F5F5F5] leading-tight">
            {article.title}
          </h1>

          <p className="text-base sm:text-xl text-[#B5B5BC] font-normal leading-relaxed">
            {article.subtitle}
          </p>

          {/* Author & Publication Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#24242B]">
            <div className="flex items-center gap-3">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-11 h-11 rounded-full object-cover border border-[#24242B]"
              />
              <div>
                <h4 className="text-sm font-bold text-[#F5F5F5]">{article.author.name}</h4>
                <p className="text-xs font-tech text-[#85858D]">{article.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-tech text-[#85858D]">
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {article.publishedDate}</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {article.readTime}</span>
            </div>
          </div>
        </header>

        {/* 3. Hero Cover Image */}
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-[#24242B] bg-[#0D0D10] shadow-2xl">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover filter brightness-95"
          />
        </div>

        {/* 4. Article Body Content */}
        <div className="space-y-8 pt-4">
          {article.content.map((block, idx) => {
            if (block.type === "paragraph") {
              return (
                <p key={idx} className="text-base sm:text-lg text-[#D1D5DB] leading-relaxed font-normal">
                  {block.value}
                </p>
              );
            }
            if (block.type === "heading") {
              return (
                <h3 key={idx} className="text-xl sm:text-2xl font-bold text-[#F5F5F5] uppercase font-heading pt-6 tracking-wide">
                  {block.value}
                </h3>
              );
            }
            if (block.type === "quote") {
              return (
                <blockquote
                  key={idx}
                  className="my-8 p-6 sm:p-8 rounded-2xl bg-[#0D0D14] border-l-4 border-[#FF176B] space-y-3 shadow-inner"
                >
                  <p className="text-lg sm:text-xl italic font-body text-[#F5F5F5] leading-relaxed">
                    {block.value}
                  </p>
                  {block.caption && (
                    <cite className="block text-xs font-mono text-[#85858D] uppercase tracking-wider not-italic">
                      {block.caption}
                    </cite>
                  )}
                </blockquote>
              );
            }
            return null;
          })}
        </div>

        {/* 5. Direct Ticket Booking Banner for the Related Event */}
        {relatedEvent && (
          <div className="mt-16 p-6 sm:p-8 rounded-2xl bg-[#0D0D14] border border-[#24242B] relative overflow-hidden shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-tech text-[#FF176B] font-bold uppercase tracking-widest">
                  <Ticket className="w-4 h-4" />
                  <span>SỰ KIỆN LIÊN KẾT TRỰC TIẾP</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#F5F5F5] uppercase font-heading">
                  {relatedEvent.title}
                </h3>
                <p className="text-xs font-tech text-[#85858D]">
                  {relatedEvent.date} • {relatedEvent.venueName}, {relatedEvent.location}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-tech text-[#85858D] block uppercase">GIÁ VÉ TỪ</span>
                  <span className="text-lg font-black text-[#FF176B] font-mono">{formattedEventPrice}</span>
                </div>

                <Link
                  to={`/events/${relatedEvent.slug}`}
                  className="px-6 py-3 rounded-full bg-white hover:bg-[#FF176B] text-[#050507] hover:text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg whitespace-nowrap"
                >
                  ĐẶT VÉ SHOW NÀY →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 6. More Stories */}
        <div className="pt-16 border-t border-[#24242B] space-y-6">
          <h3 className="text-xl sm:text-2xl font-black uppercase font-heading text-[#F5F5F5]">
            Bài Viết Liên Quan Khác
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {moreArticles.map((art) => (
              <Link
                key={art.id}
                to={`/stories/${art.slug}`}
                className="group p-4 rounded-xl bg-[#0D0D10] border border-[#24242B] hover:border-[#3A3A45] transition-all space-y-3"
              >
                <div className="aspect-[16/10] rounded-lg overflow-hidden bg-[#050508]">
                  <img
                    src={art.coverImage}
                    alt={art.title}
                    className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-[10px] font-tech text-[#FF176B] font-bold uppercase">{art.categoryName}</span>
                <h4 className="text-sm font-bold text-[#F5F5F5] group-hover:text-[#FF176B] transition-colors line-clamp-2 uppercase font-heading">
                  {art.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>

      </article>

    </div>
  );
};
