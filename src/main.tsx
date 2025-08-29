import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Home from "./views/Home/Home";
import Details from "./views/Details/Details";
import Compare from "./views/Compare/Compare";
import { PokemonCompareProvider } from "./context/PokemonCompareContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/ErrorFallback";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minut - dane są świeże
      cacheTime: 1000 * 60 * 10, // 10 minut trzymamy w pamięci
      refetchOnWindowFocus: true, // odśwież na focus okna
      refetchOnReconnect: true,   // odśwież po odzyskaniu internetu
      retry: 2,                   // spróbuj ponownie 2x w razie błędu
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <PokemonCompareProvider>
        <BrowserRouter>
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => queryClient.invalidateQueries()}
          >
            <Routes>
              <Route path="/" element={<App />}>
                <Route index element={<Home />} />
                <Route path="details/:id" element={<Details />} />
                <Route path="compare" element={<Compare />} />
              </Route>
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </PokemonCompareProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
