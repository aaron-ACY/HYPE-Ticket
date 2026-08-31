import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Calendar, Sparkles, BookOpen, Ticket, ChevronRight } from "lucide-react";
import { articles } from "../../data/articles";

export const Stories: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "Tất cả bài viết" },
    { id: "behind-the-stage", label: "Hậu trường sân khấu" },
    { id: "artist-spotlight", label: "Phỏng vấn nghệ sĩ" },
    { id: "festival-guide", label: "Cẩm nang Festival" },
    { id: "culture-trends", label: "Xu hướng nghệ thuật" },
  ];

  const filteredArticles = activeCategory === "all"
    ? articles
    : articles.filter((art) => art.category === activeCategory);

  const featuredArticle = articles.find((art) => art.featured) || articles[0];
  const regularArticles = filteredArticles.filter((art) => art.id !== featuredArticle.id || activeCategory !== "all");

  return (
    <div className="min-h-screen bg-[#050507] text-[#F5F5F5] pb-24 text-left">
      
      {/* 1. Header Banner */}
      <section className="relative w-full pt-16 pb-12 px-6 sm:px-10 lg:px-16 max-w-[1500px] mx-auto border-b border-[#24242B]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111116] border border-[#24242B] text-xs font-tech text-[#FF176B]">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-bold uppercase tracking-widest">HYPETICKET EDITORIAL // STORIES</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black uppercase font-heading tracking-tight text-[#F5F5F5]">
              KHÁM PHÁ <br />
              <span className="text-[#FF176B]">GÓC NHÌN & HẬU TRƯỜNG</span>
            </h1>
          </div>

          <p className="text-sm sm:text-base text-[#85858D] max-w-md font-normal leading-relaxed">
            Chuyên trang tạp chí âm nhạc và nghệ thuật trình diễn. Những câu chuyện hậu trường độc quyền, phỏng vấn nghệ sĩ và cẩm nang trải nghiệm show diễn đỉnh cao.
          </p>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pt-10 pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-tech font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-white text-[#050507] shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                  : "bg-[#0D0D10] text-[#85858D] hover:text-[#F5F5F5] border border-[#24242B] hover:border-white/25"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 pt-12 space-y-16">
        
        {/* 2. Hero Featured Cover Story (Visible when viewing All) */}
        {activeCategory === "all" && featuredArticle && (
          <section className="relative w-full rounded-2xl overflow-hidden border border-[#24242B] bg-[#0D0D10] group">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              
              {/* Image Preview Left (Col span 7) */}
              <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto overflow-hidden">
                <img
                  src={featuredArticle.coverImage}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D10] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#0D0D10]" />
                
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-md bg-[#161622] border border-white/20 text-white text-[11px] font-tech font-black tracking-widest uppercase shadow-md">
                    COVER STORY
                  </span>
                </div>
              </div>

              {/* Story Details Right (Col span 5) */}
              <div className="lg:col-span-5 p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-xs font-tech text-[#85858D]">
                    <span className="text-white font-bold uppercase">{featuredArticle.categoryName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {featuredArticle.readTime}</span>
                    <span>•</span>
                    <span>{featuredArticle.publishedDate}</span>
                  </div>

                  <Link to={`/stories/${featuredArticle.slug}`} className="block transition-colors">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase font-heading tracking-tight text-[#F5F5F5] group-hover:text-white transition-colors leading-tight">
                      {featuredArticle.title}
                    </h2>
                  </Link>

                  <p className="text-sm sm:text-base text-[#B5B5BC] line-clamp-3 leading-relaxed font-normal">
                    {featuredArticle.excerpt}
                  </p>
                </div>

                {/* Author & Action */}
                <div className="pt-6 border-t border-[#24242B] space-y-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={featuredArticle.author.avatar}
                      alt={featuredArticle.author.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#24242B]"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-[#F5F5F5]">{featuredArticle.author.name}</h4>
                      <p className="text-xs font-tech text-[#85858D]">{featuredArticle.author.role}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link
                      to={`/stories/${featuredArticle.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#050507] hover:bg-[#E2E8F0] font-bold text-xs uppercase tracking-wider transition-all duration-200"
                    >
                      <span>Đọc bài viết</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    {featuredArticle.relatedEventSlug && (
                      <Link
                        to={`/events/${featuredArticle.relatedEventSlug}`}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1A1A22] hover:bg-white hover:text-[#050507] text-[#F5F5F5] text-xs font-tech border border-[#2A2A35] transition-all duration-200"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>Đặt vé show này</span>
                      </Link>
                    )}
                  </div>
                </div>

              </div>

            </div>
          </section>
        )}

        {/* 3. Grid of Articles */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-[#24242B] pb-4">
            <h3 className="text-xl sm:text-2xl font-black uppercase font-heading text-[#F5F5F5] tracking-wide">
              {activeCategory === "all" ? "Tất Cả Bài Viết Mới Nhất" : categories.find(c => c.id === activeCategory)?.label}
            </h3>
            <span className="font-tech text-xs text-[#85858D]">
              [ {filteredArticles.length} BÀI VIẾT ]
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                className="group flex flex-col justify-between rounded-2xl bg-[#0D0D10] border border-[#24242B] hover:border-white/25 overflow-hidden transition-all duration-300 shadow-lg hover:shadow-2xl"
              >
                <div>
                  {/* Article Thumbnail */}
                  <Link to={`/stories/${article.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-[#050508]">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-[#050508]/85 backdrop-blur-md border border-white/15 text-[10px] font-tech text-[#F5F5F5] font-bold uppercase tracking-wider">
                        {article.categoryName}
                      </span>
                    </div>
                  </Link>

                  {/* Article Body */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 font-tech text-[11px] text-[#85858D]">
                      <span>{article.publishedDate}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
                    </div>

                    <Link to={`/stories/${article.slug}`}>
                      <h4 className="text-lg font-bold text-[#F5F5F5] group-hover:text-white transition-colors line-clamp-2 uppercase font-heading leading-snug">
                        {article.title}
                      </h4>
                    </Link>

                    <p className="text-xs sm:text-sm text-[#85858D] line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer Meta & Action */}
                <div className="p-6 pt-0 space-y-4">
                  <div className="pt-4 border-t border-[#1C1C24] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={article.author.avatar}
                        alt={article.author.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span className="text-xs font-tech text-[#B5B5BC] font-medium">{article.author.name}</span>
                    </div>

                    <Link
                      to={`/stories/${article.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-tech font-bold text-[#F5F5F5] group-hover:translate-x-1 transition-transform"
                    >
                      <span>Đọc tiếp</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {article.relatedEventSlug && (
                    <Link
                      to={`/events/${article.relatedEventSlug}`}
                      className="block text-center py-2 rounded-lg bg-[#14141C] hover:bg-white hover:text-[#050507] text-[#B5B5BC] text-[11px] font-tech font-bold border border-[#242432] transition-colors"
                    >
                      Vé show liên quan: {article.relatedEventTitle?.split(" - ")[0]} →
                    </Link>
                  )}
                </div>

              </article>
            ))}
          </div>
        </section>

      </div>

    </div>
  );
};
