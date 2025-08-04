import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// StrictMode disabled to prevent double API calls in development
// Re-enable for production: wrap <App /> with <React.StrictMode>
createRoot(document.getElementById('root')!).render(
  <App />,
)
