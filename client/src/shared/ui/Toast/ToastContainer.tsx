import { Toast, ToastMessage } from './Toast';
import styles from './ToastContainer.module.css';

type ToastContainerProps = {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
};

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}