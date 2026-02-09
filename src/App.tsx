import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AssessmentProvider } from "@/contexts/AssessmentContext";
import HomePage from "./pages/HomePage";
import ConsentPage from "./pages/ConsentPage";
import CapturePage from "./pages/CapturePage";
import ResultsPage from "./pages/ResultsPage";
import RemediesPage from "./pages/RemediesPage";
import HospitalMapPage from "./pages/HospitalMapPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AssessmentProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/consent" element={<ConsentPage />} />
              <Route path="/capture" element={<CapturePage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/remedies" element={<RemediesPage />} />
              <Route path="/hospitals" element={<HospitalMapPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AssessmentProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
