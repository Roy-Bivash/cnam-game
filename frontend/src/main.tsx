import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Router } from "@/router";

import '@/css/index.css';
import '@/css/global.css';

import { Toaster } from "@/components/ui/toaster"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster />
    <Router />
  </StrictMode>,
)
