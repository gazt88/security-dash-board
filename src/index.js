import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';
import { GlobalProvider } from './components/GlobalContext';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <GlobalProvider>
    <App />
  </GlobalProvider>
);
