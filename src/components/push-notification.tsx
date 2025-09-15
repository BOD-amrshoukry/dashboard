import { useEffect } from 'react';
import { urlBase64ToUint8Array } from '../shared/utils/notifications';

interface PushNotificationProps {
  userId: number;
}

const PushNotification: React.FC<PushNotificationProps> = ({ userId }) => {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const subscribeUser = async () => {
      try {
        // 1. Register the service worker
        const registration = await navigator.serviceWorker.register(
          '/service-worker.js',
        );

        // 2. Request notification permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.log('Push notifications permission denied');
          return;
        }

        // 3. Subscribe to push
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            'BFcsctsc2L0qYLVQq7_FSNK4bnDsKYscC-NNr52Wog9Dcn3rGGTiZBdGXRhHzjaRLMfhi9DE6IDbDXpyvF1_56Q',
          ),
        });

        const subscriptionJSON = subscription.toJSON();
        const endpoint = subscriptionJSON.endpoint;

        console.log('endpoint', endpoint);

        if (!endpoint) {
          console.warn('Push subscription endpoint is undefined, aborting.');
          return;
        }

        // 4. Check if subscription already exists
        const existingRes = await fetch(
          `http://localhost:1337/api/push-subscriptions?populate=user&filters[endpoint][$eq]=${encodeURIComponent(
            endpoint,
          )}`,
        );
        const existingData = await existingRes.json();

        if (existingData.data?.length > 0) {
          const existing = existingData.data[0];

          console.log('existing', existing);

          // Update user if different
          if (existing.user?.id !== userId) {
            await fetch(
              `http://localhost:1337/api/push-subscriptions/${existing.documentId}`,
              {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: { user: userId } }),
              },
            );
            console.log('Updated existing push subscription with new userId');
          } else {
            console.log('Push subscription already exists for this user');
          }
        } else {
          // 5. Create a new subscription
          await fetch('http://localhost:1337/api/push-subscriptions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              data: {
                endpoint,
                keys_p256dh: subscriptionJSON.keys?.p256dh,
                keys_auth: subscriptionJSON.keys?.auth,
                user: userId,
              },
            }),
          });
          console.log('Created new push subscription');
        }
      } catch (error) {
        console.error('Error subscribing to push notifications', error);
      }
    };

    subscribeUser();
  }, [userId]);

  return null;
};

export default PushNotification;

