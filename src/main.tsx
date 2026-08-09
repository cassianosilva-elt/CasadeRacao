import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import App from './App.tsx';
import './index.css';

const convexUrl = (import.meta.env.VITE_CONVEX_URL as string) || "https://canny-cassowary-557.convex.cloud";
const convex = new ConvexReactClient(convexUrl);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConvexAuthProvider client={convex}>
      <App />
    </ConvexAuthProvider>
  </StrictMode>,
);
