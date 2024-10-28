import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Router } from "@/router";
import { ThemeProvider } from './components/providers/theme-provider';

import '@/css/index.css';
import '@/css/global.css';

import { Toaster } from "@/components/ui/toaster"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster />
      <Router />
    </ThemeProvider>
  </StrictMode>,
)
