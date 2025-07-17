const VAPID_PUBLIC_KEY = "BB8XZ16m7PDlgyWJwA5Db4e9UCShMcJmsjp1ma_Ef2WZMficbWuYU_p8UUE-dL25OYYdvNvSAYr1SPC-R2TqNK8";

// Convert base64 public key to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    return await navigator.serviceWorker.register("/sw.js");
  }
  throw new Error("Service workers are not supported in this browser.");
}

export async function subscribeUserToPush() {
  const registration = await registerServiceWorker();
  if (!registration.pushManager) {
    throw new Error("Push manager unavailable.");
  }
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
  });
  // Send subscription to backend
  await fetch("/api/push-subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription)
  });
  return subscription;
}

export async function unsubscribeUserFromPush() {
  const registration = await navigator.serviceWorker.getRegistration("/sw.js");
  if (!registration) return;
  const subscription = await registration.pushManager.getSubscription();
  if (subscription) {
    await fetch("/api/push-unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endpoint: subscription.endpoint })
    });
    await subscription.unsubscribe();
  }
}

export async function isPushSubscribed() {
  const registration = await navigator.serviceWorker.getRegistration("/sw.js");
  if (!registration) return false;
  const subscription = await registration.pushManager.getSubscription();
  return !!subscription;
}
