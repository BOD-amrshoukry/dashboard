import api from '../../lib/axios';

export const clearPushToken = async () => {
  if (!('serviceWorker' in navigator)) return;

  // Get the service worker registration
  const registration = await navigator.serviceWorker.ready;

  // Get the current push subscription
  const subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    console.log('No push subscription found');
    return;
  }

  const endpoint = subscription.endpoint;

  return api
    .post('/push-subscriptions/remove-subscription', {
      endpoint: endpoint,
    })
    .then((res) => res.data);
};

