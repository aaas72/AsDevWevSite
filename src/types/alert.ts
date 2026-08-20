export type AlertType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: AlertType;
  title?: string;
  message: string;
  duration?: number;
}

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info" | "success";
}

export interface AlertContextType {
  toast: {
    success: (message: string, title?: string, duration?: number) => void;
    error: (message: string, title?: string, duration?: number) => void;
    warning: (message: string, title?: string, duration?: number) => void;
    info: (message: string, title?: string, duration?: number) => void;
  };
  showToast: (options: { message: string; type?: AlertType; title?: string; duration?: number }) => string;
  removeToast: (id: string) => void;
  confirm: (options: ConfirmOptions | string) => Promise<boolean>;
}
