import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TeamDiagnostic from "./pages/TeamDiagnostic";
import TeamDiagnosticLanding from "./pages/TeamDiagnosticLanding";
import LeadershipDiagnostic from "./pages/LeadershipDiagnostic";
import LeadershipDiagnosticLanding from "./pages/LeadershipDiagnosticLanding";
import LeadershipLevels from "./pages/LeadershipLevels";
import Programmes from "./pages/Programmes";
import ProgrammeDetail from "./pages/ProgrammeDetail";
import AlignmentWorkshop from "./pages/workshops/AlignmentWorkshop";
import MotivationWorkshop from "./pages/workshops/MotivationWorkshop";
import LeadershipWorkshop from "./pages/workshops/LeadershipWorkshop";
import ShiftMethodology from "./pages/ShiftMethodology";
import ShiftDiagnostic from "./pages/ShiftDiagnostic";
import ShiftLeadershipDevelopment from "./pages/ShiftLeadershipDevelopment";
import ExecutiveCoaching from "./pages/ExecutiveCoaching";
import About from "./pages/About";
import Contact from "./pages/Contact";
import HelloCoach from "./pages/HelloCoach";
import Resources from "./pages/Resources";
import Book from "./pages/Book";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogAdminList from "./pages/BlogAdminList";
import BlogAdmin from "./pages/BlogAdmin";
import AdminDashboard from "./pages/AdminDashboard";
import Auth from "./pages/Auth";
import CaseStudies from "./pages/CaseStudies";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./pages/NotFound";
import LeadershipMistakes from "./pages/LeadershipMistakes";
import LeadershipMistakesChecklist from "./pages/LeadershipMistakesChecklist";
import TeamDevelopmentFramework from "./pages/TeamDevelopmentFramework";

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
          <Route path="/team-assessment" element={<TeamDiagnosticLanding />} />
          <Route path="/leadership-diagnostic" element={<LeadershipDiagnostic />} />
          <Route path="/leader-assessment" element={<LeadershipDiagnosticLanding />} />
          <Route path="/leadership-levels" element={<LeadershipLevels />} />
          <Route path="/programmes" element={<Programmes />} />
          <Route path="/programmes/shift-leadership-development" element={<ShiftLeadershipDevelopment />} />
          <Route path="/programmes/:id" element={<ProgrammeDetail />} />
          <Route path="/workshops/alignment" element={<AlignmentWorkshop />} />
          <Route path="/workshops/motivation" element={<MotivationWorkshop />} />
          <Route path="/workshops/leadership" element={<LeadershipWorkshop />} />
          <Route path="/shift-methodology" element={<ShiftMethodology />} />
          <Route path="/shift-diagnostic" element={<ShiftDiagnostic />} />
          <Route path="/executive-coaching" element={<ExecutiveCoaching />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/hellocoach" element={<HelloCoach />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/book" element={<Book />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/leadership-mistakes" element={<LeadershipMistakes />} />
          <Route path="/leadership-mistakes-checklist" element={<LeadershipMistakesChecklist />} />
          <Route path="/team-development-framework" element={<TeamDevelopmentFramework />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<AdminDashboard />} />
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
