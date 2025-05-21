import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from "./context/AuthContext";
import { WorkoutProvider } from './context/WorkoutContext.tsx';

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <WorkoutProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </WorkoutProvider>
  </AuthProvider>
)
