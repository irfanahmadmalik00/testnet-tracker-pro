
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/globals.css';
import { getApiUrl } from './lib/env';

// Log the API URL (remove in production)
if (import.meta.env.DEV) {
  console.log('API URL:', getApiUrl());
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} else {
  console.error('Root element not found');
}
