import React from "react";
import ToastItem from "./ToastItem";
import type { Toast } from "../../types";

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[99999] flex flex-col gap-3 pointer-events-none max-w-sm w-[calc(100vw-3rem)] sm:w-96"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

export default ToastContainer;
