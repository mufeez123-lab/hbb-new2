import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { LocomotiveProvider } from './components/utils/LocomotiveProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LocomotiveProvider>
      <App />
      </LocomotiveProvider>
    </BrowserRouter>
  </StrictMode>
);