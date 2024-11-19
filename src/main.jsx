// /src/index.js (React 18 setup)
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // Import Devtools
import App from '@/App';
import '@/index.css';
import { Toaster } from "@/components/ui/toaster"

// Create a new instance of QueryClient
const queryClient = new QueryClient();

// Get the root element where React will mount the app
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

// Render the app wrapped in QueryClientProvider and include the React Query Devtools
root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster />
      {/* Add ReactQueryDevtools for debugging */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
