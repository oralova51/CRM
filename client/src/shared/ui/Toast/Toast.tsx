import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import styles from './Toast.module.css';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export type ToastMessage = {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
};

type ToastProps = {
  toast: ToastMessage;
  onRemove: (id: string) => void;
};

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

export function Toast({ toast, onRemove }: ToastProps) {
  const Icon = icons[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <div className={`${styles.toast} ${styles[toast.type]}`}>
      <div className={styles.iconWrapper}>
        <Icon className={styles.icon} />
      </div>
      <p className={styles.message}>{toast.message}</p>
      <button 
        className={styles.closeButton}
        onClick={() => onRemove(toast.id)}
        aria-label="Закрыть"
      >
        <X className={styles.closeIcon} />
      </button>
    </div>
  );
}