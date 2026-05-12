import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Adopciones from "./pages/Adopciones.tsx";
import Reportar from "./pages/Reportar.tsx";
import Donaciones from "./pages/Donaciones.tsx";
import Nosotros from "./pages/Nosotros.tsx";
import Panel from "./pages/Panel.tsx";
import Mapa from "./pages/Mapa.tsx";
import Auth from "./pages/Auth.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminGate from "./components/AdminGate.tsx";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/adopciones" element={<Adopciones />} />
          <Route path="/reportar" element={<Reportar />} />
          <Route path="/donaciones" element={<Donaciones />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/panel" element={<AdminGate><Panel /></AdminGate>} />
          <Route path="/mapa" element={<Mapa />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
