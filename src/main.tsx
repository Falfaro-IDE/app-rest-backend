import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

// Registra los elementos web de Ionic para habilitar funcionalidades nativas en la PWA
defineCustomElements(window);

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
    <App />
);