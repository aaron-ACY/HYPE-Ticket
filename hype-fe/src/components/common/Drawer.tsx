import React, { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  position?: "bottom" | "right";
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = "bottom",
}) => {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isBottom = position === "bottom";

  const drawerVariants = {
    hidden: isBottom ? { y: "100%" } : { x: "100%" },
    visible: isBottom ? { y: 0 } : { x: 0 },
    exit: isBottom ? { y: "100%" } : { x: "100%" },
  };

  const layoutClasses = isBottom
    ? "bottom-0 inset-x-0 max-h-[85vh] rounded-t-2xl border-t border-white/5"
    : "top-0 right-0 h-full w-full max-w-sm border-l border-white/5";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xs"
          />

          {/* Drawer container */}
          <div className="absolute inset-0 pointer-events-none flex items-end justify-end">
            <motion.div
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className={`absolute pointer-events-auto bg-zinc-950 flex flex-col overflow-hidden shadow-2xl ${layoutClasses}`}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 flex-shrink-0">
                <h3 className="text-base font-bold text-white tracking-wide">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-5">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
