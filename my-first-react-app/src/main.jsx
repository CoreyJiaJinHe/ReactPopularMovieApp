import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  
  /*React runs twice. On start up and on clean up. Remove below to stop the 2x duplication*/
  <StrictMode>
    <App />
  </StrictMode>,
)
