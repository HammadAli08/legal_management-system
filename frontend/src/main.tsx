import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import App from './App.tsx'
import './index.css'

// Configure global axios base URL
axios.defaults.baseURL = import.meta.env.PROD
    ? 'https://legal-management-system-x9sc.onrender.com'
    : '';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
