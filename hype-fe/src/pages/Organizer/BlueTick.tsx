import React, { useState } from "react";
import {
  BadgeCheck,
  Zap,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Lock,
  Send,
  Building2,
  Award,
} from "lucide-react";
import { OrganizerLayout } from "../../components/organizer/OrganizerLayout";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { useToast } from "../../context/ToastContext";

export const OrganizerBlueTick: React.FC = () => {
  const { showToast } = useToast();
  const [completedEventsCount] = useState<number>(3);
  const [targetCount] = useState<number>(5);
  const [hasSubmittedRequest, setHasSubmittedRequest] = useState<boolean>(false);
  const [portfolioLink, setPortfolioLink] = useState<string>("");

  const isEligible = completedEventsCount >= targetCount;

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEligible) {
      showToast("Bạn cần hoàn thành tối thiểu 5 sự kiện trước khi gửi yêu cầu!", "error");
      return;
    }

    setHasSubmittedRequest(true);
    showToast("Đã gửi yêu cầu cấp Tích Xanh tới Admin thành công! Kết quả sẽ phản hồi trong 24h.", "success");
  };

  return (
    <OrganizerLayout
      title="Nâng Hạng Tích Xanh Uy Tín"
      subtitle="Chương trình công nhận Ban tổ chức chiến lược với đặc quyền ưu tiên duyệt vé và huy hiệu xác thực"
    >
      <div className="max-w-4xl space-y-8">
        {/* Milestone Tracker Hero */}
        <div className="p-8 sm:p-10 rounded-2xl bg-white border border-slate-200/80 shadow-sm relative overflow-hidden space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-slate-100 pb-8">
            <div className="w-20 h-20 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 flex-shrink-0">
              <BadgeCheck className="w-10 h-10 text-cyan-600" />
            </div>
            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-bold uppercase font-heading tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Tiêu chuẩn đối tác chất lượng cao
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase font-heading">
                Tiến Trình Cấp Tích Xanh: {completedEventsCount} / {targetCount} Sự Kiện
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Ban tổ chức cần <strong className="text-slate-900">tổ chức thành công 5 hoạt động</strong> (Concert, EDM, Fan Meeting, Workshop...) để chứng minh năng lực vận hành trước khi gửi yêu cầu cấp huy hiệu Tích Xanh.
              </p>
            </div>
          </div>

          {/* Progress Bar with Steps */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-bold font-heading">
              <span className="text-slate-500 uppercase">
                Tiến độ: <strong className="text-indigo-600 font-bold">{completedEventsCount}/{targetCount} show diễn</strong>
              </span>
              <span className="text-indigo-600 font-mono font-bold">{((completedEventsCount / targetCount) * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-700"
                style={{ width: `${(completedEventsCount / targetCount) * 100}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {isEligible ? (
                <span className="text-emerald-600 font-bold">
                  ✓ Bạn đã đạt đủ điều kiện! Hãy gửi yêu cầu xét duyệt ở biểu mẫu bên dưới.
                </span>
              ) : (
                <span>
                  Còn thiếu <strong className="text-slate-900 font-bold">{targetCount - completedEventsCount} sự kiện</strong> thành công nữa để mở khóa gửi yêu cầu cấp Tích Xanh.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Perks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-base font-extrabold text-slate-900 font-heading uppercase">Ưu Tiên Duyệt Vé Thần Tốc</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Tất cả sự kiện của bạn tự động được xếp vào <strong>Hàng đợi ưu tiên VIP</strong> của Admin để duyệt trước.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <BadgeCheck className="w-5 h-5 text-indigo-600" />
            </div>
            <h4 className="text-base font-extrabold text-slate-900 font-heading uppercase">Huy Hiệu Tích Xanh Uy Tín</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Hiển thị tích xanh xác thực cạnh tên Ban tổ chức trên trang chủ và trang chi tiết sự kiện.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="text-base font-extrabold text-slate-900 font-heading uppercase">Tăng 300% Niềm Tin Khán Giả</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Khán giả hoàn toàn an tâm khi đặt vé từ đơn vị được Hype Ticket chứng nhận thương hiệu.
            </p>
          </div>
        </div>

        {/* Submission Form */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900 uppercase font-heading flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              Gửi Đơn Yêu Cầu Cấp Tích Xanh
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Gửi kèm thông tin profile hoặc link chứng minh hoạt động sự kiện trước đó của đơn vị
            </p>
          </div>

          <form onSubmit={handleSubmitRequest} className="space-y-4">
            <Input
              label="Link Hồ Sơ Năng Lực / Fanpage / Video Sự Kiện Đã Tổ Chức"
              placeholder="https://facebook.com/your_events_portfolio hoặc link Google Drive"
              value={portfolioLink}
              onChange={(e) => setPortfolioLink(e.target.value)}
              leftIcon={<Building2 className="w-4 h-4 text-slate-400" />}
            />

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                Hội đồng thẩm định sẽ xét duyệt và cấp Tích Xanh trong 24h
              </p>

              <Button
                type="submit"
                variant={isEligible ? "primary" : "outline"}
                disabled={!isEligible || hasSubmittedRequest}
                className={`font-heading uppercase text-xs tracking-wider font-extrabold px-8 py-3.5 ${
                  isEligible ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "border-slate-300 text-slate-400 cursor-not-allowed"
                }`}
                rightIcon={isEligible ? <Send className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              >
                {hasSubmittedRequest
                  ? "Đã Gửi Yêu Cầu Chờ Duyệt"
                  : isEligible
                  ? "Gửi Yêu Cầu Cấp Tích Xanh"
                  : "Chưa Đủ Tiêu Chí (3/5 Show)"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </OrganizerLayout>
  );
};
