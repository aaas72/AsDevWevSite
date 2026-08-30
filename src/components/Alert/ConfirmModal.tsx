import React, { useEffect } from "react";
import { FiAlertCircle, FiX } from "react-icons/fi";
import Button from "../Button";
import type { ConfirmOptions } from "../../types";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  type?: ConfirmOptions["type"];
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  type,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-md bg-[#141414] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden transform transition-all duration-300 scale-100"
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 30px 0 rgba(255, 255, 255, 0.02)",
        }}
      >
        {/* Close Button */}
        <Button
          variant="ghost"
          size="xs"
          icon
          onClick={onCancel}
          className="absolute top-6 right-6 text-[#919191]"
        >
          <FiX className="w-5 h-5" />
        </Button>

        <div className="flex flex-col items-center text-center">
          {/* Icon Circle */}
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 bg-white/5 border border-white/10 shadow-lg">
            <FiAlertCircle className="w-6 h-6 text-[#C5C5C5]" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-[#C5C5C5] mb-2">{title}</h3>

          {/* Message */}
          <p className="text-sm text-[#919191] leading-relaxed mb-8 max-w-xs">{message}</p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full">
            <Button
              variant="secondary"
              onClick={onCancel}
              className="flex-1"
            >
              {cancelText}
            </Button>
            <Button
              variant={type === "danger" ? "danger" : "primary"}
              onClick={onConfirm}
              className="flex-1"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
