import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@/app/style/index.scss';
import AppRouter from '@/app/Router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
);
