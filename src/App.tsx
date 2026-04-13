import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import Categories from "./pages/Categories";
import Topics from "./pages/Topics";
import Speakers from "./pages/Speakers";
import Types from "./pages/Types";
import Sources from "./pages/Sources";
import TranscriptDetail from "./pages/TranscriptDetail";
import ConferenceArchive from "./pages/ConferenceArchive";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./admin/AuthContext";
import { AdminLayout } from "./admin/AdminLayout";
import LoginPage from "./admin/pages/LoginPage";
import DashboardPage from "./admin/pages/DashboardPage";
import TranscriptsPage from "./admin/pages/TranscriptsPage";
import HealthPage from "./admin/pages/HealthPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public site */}
            <Route element={<Layout><Routes><Route path="*" element={null} /></Routes></Layout>}>
            </Route>
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/categories" element={<Layout><Categories /></Layout>} />
            <Route path="/topics" element={<Layout><Topics /></Layout>} />
            <Route path="/speakers" element={<Layout><Speakers /></Layout>} />
            <Route path="/types" element={<Layout><Types /></Layout>} />
            <Route path="/sources" element={<Layout><Sources /></Layout>} />
            <Route path="/transcript/:id" element={<Layout><TranscriptDetail /></Layout>} />
            <Route path="/conferences" element={<Layout><ConferenceArchive /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />

            {/* Admin panel */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="transcripts" element={<TranscriptsPage />} />
              <Route path="health" element={<HealthPage />} />
            </Route>

            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
