import React from "react";
import { Inbox } from "lucide-react";
import { Button } from "./Button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onActionClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Không tìm thấy kết quả nào",
  description = "Hãy thử thay đổi điều kiện tìm kiếm hoặc từ khóa lọc của bạn.",
  icon,
  actionText,
  onActionClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/10">
      <div className="p-4 bg-zinc-900/80 rounded-full border border-zinc-800 text-zinc-500 mb-4 shadow-xl">
        {icon || <Inbox className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-zinc-400 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionText && onActionClick && (
        <Button variant="outline" size="sm" onClick={onActionClick}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
