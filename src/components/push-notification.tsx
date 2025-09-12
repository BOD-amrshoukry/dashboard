import { useEffect } from 'react';
import { urlBase64ToUint8Array } from '../shared/utils/notifications';

const PushNotification = ({ userId }: { userId: number }) => {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const subscribeUser = async () => {
      try {
        // Register the service worker
        const registration = await navigator.serviceWorker.register(
          '/service-worker.js',
        );

        // Request notification permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;

        // Subscribe to push
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            'BFcsctsc2L0qYLVQq7_FSNK4bnDsKYscC-NNr52Wog9Dcn3rGGTiZBdGXRhHzjaRLMfhi9DE6IDbDXpyvF1_56Q',
          ),
        });

        // Convert to JSON to access keys safely
        const subscriptionJSON = subscription.toJSON();

        const data = JSON.stringify({
          endpoint: subscriptionJSON.endpoint,
          keys_p256dh: subscriptionJSON.keys?.p256dh,
          keys_auth: subscriptionJSON.keys?.auth,
          user: userId, // attach the userId
        });

        // Send subscription to Strapi
        await fetch('http://localhost:1337/api/push-subscriptions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: {
              endpoint: subscriptionJSON.endpoint,
              keys_p256dh: subscriptionJSON.keys?.p256dh,
              keys_auth: subscriptionJSON.keys?.auth,
              user: userId, // attach the userId
            },
          }),
        });

        console.log(data);
      } catch (error) {
        console.error('Error subscribing to push', error);
      }
    };

    subscribeUser();
  }, [userId]);

  return null;
};

export default PushNotification;

