import { useState, useEffect, useCallback } from 'react';

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  data?: {
    url?: string;
    type?: 'gate' | 'quest' | 'achievement' | 'system';
    [key: string]: any;
  };
}

export const usePushNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // التحقق من دعم الإشعارات
    const supported = 'Notification' in window && 'serviceWorker' in navigator;
    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission);
      registerServiceWorker();
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      setSwRegistration(registration);
      console.log('[Push] Service Worker مسجل بنجاح');
      
      // انتظار التفعيل
      if (registration.installing) {
        registration.installing.addEventListener('statechange', (e) => {
          if ((e.target as ServiceWorker).state === 'activated') {
            setSwRegistration(registration);
          }
        });
      }
    } catch (error) {
      console.error('[Push] فشل تسجيل Service Worker:', error);
    }
  };

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      console.warn('[Push] الإشعارات غير مدعومة في هذا المتصفح');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('[Push] فشل طلب الإذن:', error);
      return false;
    }
  }, [isSupported]);

  const sendNotification = useCallback(async (payload: NotificationPayload): Promise<boolean> => {
    if (!isSupported) {
      console.warn('[Push] الإشعارات غير مدعومة');
      return false;
    }

    if (permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return false;
    }

    try {
      // استخدام Service Worker لإرسال الإشعار
      if (swRegistration?.active) {
        swRegistration.active.postMessage({
          type: 'SHOW_NOTIFICATION',
          payload
        });
        return true;
      }

      // Fallback: إشعار مباشر
      new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/favicon.png',
        tag: payload.tag,
      });
      return true;
    } catch (error) {
      console.error('[Push] فشل إرسال الإشعار:', error);
      return false;
    }
  }, [isSupported, permission, swRegistration, requestPermission]);

  // إشعار بوابة جديدة
  const notifyNewGate = useCallback((gateName: string, gateRank: string) => {
    return sendNotification({
      title: '🚨 بوابة جديدة ظهرت!',
      body: `${gateName} - رتبة ${gateRank}`,
      tag: 'new-gate',
      data: {
        type: 'gate',
        url: '/gates'
      }
    });
  }, [sendNotification]);

  // إشعار مهمة جديدة
  const notifyNewQuest = useCallback((questTitle: string, isMain: boolean = false) => {
    return sendNotification({
      title: isMain ? '⚔️ المهمة الأساسية!' : '📜 مهمة جديدة!',
      body: questTitle,
      tag: isMain ? 'main-quest' : 'new-quest',
      data: {
        type: 'quest',
        url: '/quests'
      }
    });
  }, [sendNotification]);

  // إشعار إنجاز
  const notifyAchievement = useCallback((achievementName: string) => {
    return sendNotification({
      title: '🏆 إنجاز جديد!',
      body: achievementName,
      tag: 'achievement',
      data: {
        type: 'achievement',
        url: '/achievements'
      }
    });
  }, [sendNotification]);

  // إشعار نظام
  const notifySystem = useCallback((title: string, body: string) => {
    return sendNotification({
      title,
      body,
      tag: 'system',
      data: {
        type: 'system',
        url: '/'
      }
    });
  }, [sendNotification]);

  return {
    permission,
    isSupported,
    isReady: !!swRegistration,
    requestPermission,
    sendNotification,
    notifyNewGate,
    notifyNewQuest,
    notifyAchievement,
    notifySystem
  };
};
