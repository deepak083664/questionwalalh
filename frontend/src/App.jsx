import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes/AppRoutes';

// Load Google Client ID from environment variables (with fallback to test client ID if set to placeholder)
const envClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const googleClientId = (envClientId && envClientId.trim() !== '' && envClientId !== 'your_google_client_id_here')
  ? envClientId
  : '488510973609-quc421jdjdrqc6lse1cuacr0duniil2d.apps.googleusercontent.com';

function App() {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
