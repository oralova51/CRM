// client/src/features/push-notifications/usePushNotifications.ts

import { useEffect, useState, useCallback } from 'react';
import { useAppSelector } from '@/shared/hooks/useReduxHooks';
import { axiosInstance } from '@/shared/lib/axiosInstance';
import { urlBase64ToUint8Array, isPushSupported, arrayBufferToBase64 } from '@/shared/lib/pushUtils';

interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  userAgent: string;
}

export function usePushNotifications() {
  const { user } = useAppSelector((state) => state.user);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supported] = useState(isPushSupported());

  // Проверяем текущий статус при монтировании
  useEffect(() => {
    if (supported) {
      setPermission(Notification.permission);
      checkSubscription();
    }
  }, [supported, user]);

  // Проверяем, есть ли уже активная подписка
  const checkSubscription = useCallback(async () => {
    if (!user) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  }, [user]);

  // Получаем VAPID ключ с сервера
  const getVapidKey = useCallback(async (): Promise<string | null> => {
    try {
      const { data } = await axiosInstance.get('/push/vapid-public-key');
      return data.data;
    } catch (error) {
      console.error('Error getting VAPID key:', error);
      setError('Не удалось получить ключ для уведомлений');
      return null;
    }
  }, []);

  // Регистрируем Service Worker
  const registerServiceWorker = useCallback(async (): Promise<ServiceWorkerRegistration | null> => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('✅ Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
      setError('Не удалось зарегистрировать сервис');
      return null;
    }
  }, []);

  // Подписываемся на уведомления
  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!user) {
      setError('Необходимо авторизоваться');
      return false;
    }

    if (!supported) {
      setError('Ваш браузер не поддерживает уведомления');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Запрашиваем разрешение, если ещё не дано
      if (permission !== 'granted') {
        const result = await Notification.requestPermission();
        setPermission(result);
        
        if (result !== 'granted') {
          setError('Разрешение на уведомления не получено');
          return false;
        }
      }

      // Регистрируем Service Worker
      const registration = await registerServiceWorker();
      if (!registration) return false;

      // Получаем VAPID ключ
      const vapidKey = await getVapidKey();
      if (!vapidKey) return false;

      // Проверяем, нет ли уже подписки
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        // Создаём новую подписку
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey)
        });
      }

      // Конвертируем ключи в base64 для отправки на сервер
      const subscriptionData: PushSubscriptionData = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
          auth: arrayBufferToBase64(subscription.getKey('auth')!)
        },
        userAgent: navigator.userAgent
      };

      // Отправляем подписку на сервер
      await axiosInstance.post('/push/subscribe', subscriptionData);
      
      setIsSubscribed(true);
      console.log('✅ Successfully subscribed to push notifications');
      return true;

    } catch (error) {
      console.error('❌ Subscription error:', error);
      setError('Ошибка при подписке на уведомления');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, permission, supported, registerServiceWorker, getVapidKey]);

  // Отписываемся от уведомлений
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!user) return false;

    setIsLoading(true);
    setError(null);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Получаем endpoint перед удалением
        const endpoint = subscription.endpoint;

        // Отписываемся в браузере
        await subscription.unsubscribe();

        // Удаляем подписку с сервера
        await axiosInstance.delete('/push/unsubscribe', {
          data: { endpoint }
        });

        setIsSubscribed(false);
        console.log('✅ Successfully unsubscribed from push notifications');
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Unsubscribe error:', error);
      setError('Ошибка при отписке от уведомлений');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Отправляем тестовое уведомление
  const sendTestNotification = useCallback(async (): Promise<boolean> => {
    try {
      await axiosInstance.post('/push/test');
      return true;
    } catch (error) {
      console.error('❌ Test notification error:', error);
      setError('Ошибка при отправке тестового уведомления');
      return false;
    }
  }, []);

  return {
    permission,
    isSubscribed,
    isLoading,
    error,
    supported,
    subscribe,
    unsubscribe,
    sendTestNotification
  };
}