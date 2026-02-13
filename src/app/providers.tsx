import { type ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoadScript } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_LIBRARIES } from '../config/env';
import { ToastProvider } from '../components/ui/Toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min
      retry: 1,
    },
  },
});

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <LoadScript
          googleMapsApiKey={GOOGLE_MAPS_API_KEY}
          libraries={GOOGLE_MAPS_LIBRARIES}
          loadingElement={
            <div className="flex h-screen w-full items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Carregando mapa...
                </p>
              </div>
            </div>
          }
        >
          <ToastProvider>{children}</ToastProvider>
        </LoadScript>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
