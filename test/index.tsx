import React from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import App from './app'

createRoot(document.getElementById('root') as HTMLElement).render(<App />)
