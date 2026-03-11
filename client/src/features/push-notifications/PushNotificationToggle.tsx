// client/src/features/push-notifications/PushNotificationToggle.tsx

import { useState } from 'react';
import { Bell, BellOff, Loader2 } from 'lucide-react';
import { usePushNotifications } from './usePushNotifications';
import styles from './PushNotificationToggle.module.css';

export function PushNotificationToggle() {
  const {
    permission,
    isSubscribed,
    isLoading,
    error,
    supported,
    subscribe,
    unsubscribe,
    sendTestNotification
  } = usePushNotifications();

  const [showTest, setShowTest] = useState(false);

  if (!supported) {
    return (
      <div className={styles.container}>
        <div className={styles.notSupported}>
          <BellOff className={styles.icon} />
          <span>Ваш браузер не поддерживает уведомления</span>
        </div>
      </div>
    );
  }

  const handleToggle = async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
  };

  const handleTest = async () => {
    await sendTestNotification();
  };

  const isEnabled = isSubscribed && permission === 'granted';

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Bell className={styles.headerIcon} />
          <h3 className={styles.title}>Push-уведомления</h3>
        </div>

        <p className={styles.description}>
          Получайте уведомления о предстоящих процедурах за 2 часа, 1 час и 30 минут
        </p>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <button
          className={`${styles.toggleButton} ${isEnabled ? styles.enabled : ''}`}
          onClick={handleToggle}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className={`${styles.buttonIcon} ${styles.spinning}`} />
              <span>Загрузка...</span>
            </>
          ) : isEnabled ? (
            <>
              <Bell className={styles.buttonIcon} />
              <span>Уведомления включены</span>
            </>
          ) : (
            <>
              <BellOff className={styles.buttonIcon} />
              <span>Включить уведомления</span>
            </>
          )}
        </button>

        {isEnabled && (
          <div className={styles.actions}>
            <button
              className={styles.testButton}
              onClick={() => {
                setShowTest(!showTest);
                if (!showTest) handleTest();
              }}
            >
              {showTest ? '✓ Отправлено' : '📨 Тестовое уведомление'}
            </button>
          </div>
        )}

        <div className={styles.footer}>
          <p className={styles.note}>
            Уведомления будут приходить даже когда сайт закрыт
          </p>
        </div>
      </div>
    </div>
  );
}