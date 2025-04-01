import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import axios from 'axios';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)



async function subscribe() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      console.error('Permission not granted for notifications');
      return;
    }

    console.log('Service Worker is supported');
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered:', registration);
        return registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array('BFIkOi8IeCBytWkDheacvHlTLvi-Sqa98d_-LYSWLG_mzNapnD9S5zTpplgfMzbIh7VLgaMVFBNhXncXjzYVF6o')
        });
      })
      .then(subscription => {
        console.log('User is subscribed:', subscription);
        axios.post('http://localhost:3000/api/v1/subscribe', {
          subscription: subscription
        })
          .then(response => {
            console.log('Subscription saved:', response.data);
          })
          .catch(err => console.error('Failed to subscribe the user: ', err));
      })
      .catch(err => console.error('Failed to subscribe the user: ', err));
  }
}

subscribe();
// Helper function to convert the base64 public key to a Uint8Array
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
