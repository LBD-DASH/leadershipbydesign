import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TeamDiagnostic from "./pages/TeamDiagnostic";
import LeadershipDiagnostic from "./pages/LeadershipDiagnostic";
import Programmes from "./pages/Programmes";
import ProgrammeDetail from "./pages/ProgrammeDetail";
import AlignmentWorkshop from "./pages/workshops/AlignmentWorkshop";
import MotivationWorkshop from "./pages/workshops/MotivationWorkshop";
import LeadershipWorkshop from "./pages/workshops/LeadershipWorkshop";
import ShiftMethodology from "./pages/ShiftMethodology";
import About from "./pages/About";
import Contact from "./pages/Contact";
import HelloCoach from "./pages/HelloCoach";
import Resources from "./pages/Resources";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogAdminList from "./pages/BlogAdminList";
import BlogAdmin from "./pages/BlogAdmin";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/team-diagnostic" element={<TeamDiagnostic />} />
          <Route path="/leadership-diagnostic" element={<LeadershipDiagnostic />} />
          <Route path="/programmes" element={<Programmes />} />
          <Route path="/programmes/:id" element={<ProgrammeDetail />} />
          <Route path="/workshops/alignment" element={<AlignmentWorkshop />} />
          <Route path="/workshops/motivation" element={<MotivationWorkshop />} />
          <Route path="/workshops/leadership" element={<LeadershipWorkshop />} />
          <Route path="/shift-methodology" element={<ShiftMethodology />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/hellocoach" element={<HelloCoach />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/blog-admin"
            element={
              <ProtectedRoute>
                <BlogAdminList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blog-admin/:slug"
            element={
              <ProtectedRoute>
                <BlogAdmin />
              </ProtectedRoute>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
