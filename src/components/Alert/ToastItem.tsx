import React, { useEffect, useState } from "react";
import { FiCheckCircle, FiAlertCircle, FiAlertTriangle, FiInfo, FiX } from "react-icons/fi";
import Button from "../Button";
import type { Toast } from "../../types";

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!toast.duration || toast.duration <= 0) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / toast.duration!) * 100);
      setProgress(remaining);

      if (elapsed >= toast.duration!) {
        clearInterval(interval);
        handleClose();
      }
    }, 16);

    return () => clearInterval(interval);
  }, [toast.id, toast.duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 250);
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <FiCheckCircle className="w-5 h-5 text-[#c5c5c5]" />;
      case "error":
        return <FiAlertCircle className="w-5 h-5 text-[#c5c5c5]" />;
      case "warning":
        return <FiAlertTriangle className="w-5 h-5 text-[#c5c5c5]" />;
      case "info":
      default:
        return <FiInfo className="w-5 h-5 text-[#c5c5c5]" />;
    }
  };

  return (
    <div
      className={`pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-2xl bg-[#141414]/95 backdrop-blur-2xl border border-white/10 hover:border-white/20 shadow-2xl transition-all duration-300 transform ${
        isExiting ? "opacity-0 translate-y-2 scale-95" : "opacity-100 translate-y-0 scale-100"
      }`}
      style={{
        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.9), 0 0 20px 0 rgba(255, 255, 255, 0.03)",
      }}
    >
      <div className="p-4 flex items-start gap-3.5">
        <div className="mt-0.5 p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0 pr-1">
          {toast.title && (
            <h4 className="text-sm font-bold text-white tracking-wide truncate mb-1">
              {toast.title}
            </h4>
          )}
          <p className="text-xs text-[#919191] leading-relaxed break-words font-medium">
            {toast.message}
          </p>
        </div>

        <Button
          variant="ghost"
          size="xs"
          icon
          onClick={handleClose}
          className="text-[#919191]"
          aria-label="Close notification"
        >
          <FiX className="w-4 h-4" />
        </Button>
      </div>

      {toast.duration && toast.duration > 0 && (
        <div className="h-[2px] w-full bg-white/5 overflow-hidden">
          <div
            className="h-full bg-[#c5c5c5] transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default ToastItem;
