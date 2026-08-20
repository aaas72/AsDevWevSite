import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import ToastContainer from "../components/Alert/ToastContainer";
import ConfirmModal from "../components/Alert/ConfirmModal";
import type { AlertType, Toast, ConfirmOptions, AlertContextType } from "../types";

export type { AlertType, Toast, ConfirmOptions, AlertContextType };

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    type: "danger" | "warning" | "info" | "success";
    resolve: (value: boolean) => void;
  } | null>(null);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({
      message,
      type = "info",
      title,
      duration = 4000,
    }: {
      message: string;
      type?: AlertType;
      title?: string;
      duration?: number;
    }) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { id, type, title, message, duration };
      setToasts((prev) => [newToast, ...prev].slice(0, 5)); // Keep max 5 toasts
      return id;
    },
    []
  );

  const toast = {
    success: useCallback(
      (message: string, title?: string, duration?: number) =>
        showToast({ message, type: "success", title: title || "Success", duration }),
      [showToast]
    ),
    error: useCallback(
      (message: string, title?: string, duration?: number) =>
        showToast({ message, type: "error", title: title || "Error", duration }),
      [showToast]
    ),
    warning: useCallback(
      (message: string, title?: string, duration?: number) =>
        showToast({ message, type: "warning", title: title || "Warning", duration }),
      [showToast]
    ),
    info: useCallback(
      (message: string, title?: string, duration?: number) =>
        showToast({ message, type: "info", title: title || "Notice", duration }),
      [showToast]
    ),
  };

  const confirm = useCallback((options: ConfirmOptions | string): Promise<boolean> => {
    return new Promise((resolve) => {
      const opts: ConfirmOptions =
        typeof options === "string" ? { message: options } : options;

      setConfirmDialog({
        isOpen: true,
        title: opts.title || "Confirmation Required",
        message: opts.message,
        confirmText: opts.confirmText || "Confirm",
        cancelText: opts.cancelText || "Cancel",
        type: opts.type || "danger",
        resolve: (result: boolean) => {
          setConfirmDialog(null);
          resolve(result);
        },
      });
    });
  }, []);

  return (
    <AlertContext.Provider value={{ toast, showToast, removeToast, confirm }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      {confirmDialog && (
        <ConfirmModal
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText={confirmDialog.confirmText}
          cancelText={confirmDialog.cancelText}
          type={confirmDialog.type}
          onConfirm={() => confirmDialog.resolve(true)}
          onCancel={() => confirmDialog.resolve(false)}
        />
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
