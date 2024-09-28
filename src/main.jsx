import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AppProvider } from './context/AppContext.jsx'
import { AudioProvider } from './context/AudioContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <AudioProvider>
        <App />
      </AudioProvider>
    </AppProvider>
  </StrictMode>,
)
