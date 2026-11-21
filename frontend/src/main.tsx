import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from '@/app/router/AppRouter';
import { ThemeProvider, ToastProvider } from '@/shared/components/ui';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import '@/styles/globals.css';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  </BrowserRouter>
);
