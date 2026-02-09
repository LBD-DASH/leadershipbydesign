import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import TeamDiagnostic from "./pages/TeamDiagnostic";
import TeamDiagnosticLanding from "./pages/TeamDiagnosticLanding";
import LeadershipDiagnostic from "./pages/LeadershipDiagnostic";
import LeadershipDiagnosticLanding from "./pages/LeadershipDiagnosticLanding";

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
import AdminOverviews from "./pages/admin/AdminOverviews";
import ExecutiveCoachingOverview from "./pages/admin/overviews/ExecutiveCoachingOverview";
import ShiftLeadershipOverview from "./pages/admin/overviews/ShiftLeadershipOverview";
import ShiftMethodologyOverview from "./pages/admin/overviews/ShiftMethodologyOverview";
import AlignmentWorkshopOverview from "./pages/admin/overviews/AlignmentWorkshopOverview";
import MotivationWorkshopOverview from "./pages/admin/overviews/MotivationWorkshopOverview";
import LeadershipWorkshopOverview from "./pages/admin/overviews/LeadershipWorkshopOverview";
import LeadershipLevelsOverview from "./pages/admin/overviews/LeadershipLevelsOverview";
import LeadershipWomenOverview from "./pages/admin/overviews/LeadershipWomenOverview";
import GrandMastersOverview from "./pages/admin/overviews/GrandMastersOverview";
import AILeadershipOverview from "./pages/admin/overviews/AILeadershipOverview";
import LeaderAsCoachOverview from "./pages/admin/overviews/LeaderAsCoachOverview";
import AdminAllProgrammes from "./pages/admin/AdminAllProgrammes";
import ProgrammeDetailView from "./pages/admin/programmes/ProgrammeDetailView";
import CaseStudies from "./pages/CaseStudies";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./pages/NotFound";
import LeadershipMistakes from "./pages/LeadershipMistakes";
import LeadershipMistakesChecklist from "./pages/LeadershipMistakesChecklist";
import TeamDevelopmentFramework from "./pages/TeamDevelopmentFramework";
import MarketingDashboard from "./pages/MarketingDashboard";
import AIReadinessDiagnosticLanding from "./pages/AIReadinessDiagnosticLanding";
import AIReadinessDiagnostic from "./pages/AIReadinessDiagnostic";
import LifeOS from "./pages/LifeOS";
import LifeOSAuth from "./pages/LifeOSAuth";
import Podcast from "./pages/Podcast";
import PodcastEpisode from "./pages/PodcastEpisode";
import ChatWidget from "./components/chat/ChatWidget";
import NewManagerKit from "./pages/products/NewManagerKit";
import NewManagerKitSuccess from "./pages/products/NewManagerKitSuccess";
import DifficultConversationsPlaybook from "./pages/products/DifficultConversationsPlaybook";
import DifficultConversationsSuccess from "./pages/products/DifficultConversationsSuccess";
import BundleSuccess from "./pages/products/BundleSuccess";
import Products from "./pages/Products";
import ContagiousIdentityCoaching from "./pages/ContagiousIdentityCoaching";
import ContagiousIdentityWorkbook from "./pages/products/ContagiousIdentityWorkbook";
import ContagiousIdentityWorkbookSuccess from "./pages/products/ContagiousIdentityWorkbookSuccess";
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
          <Route path="/products" element={<Products />} />
          <Route path="/team-diagnostic" element={<TeamDiagnostic />} />
          <Route path="/team-assessment" element={<TeamDiagnosticLanding />} />
          <Route path="/leadership-diagnostic" element={<LeadershipDiagnostic />} />
          <Route path="/leader-assessment" element={<LeadershipDiagnosticLanding />} />
          <Route path="/leadership-levels" element={<Navigate to="/programmes" replace />} />
          <Route path="/programmes" element={<Programmes />} />
          <Route path="/programmes/shift-leadership-development" element={<ShiftLeadershipDevelopment />} />
          <Route path="/programmes/:id" element={<ProgrammeDetail />} />
          <Route path="/workshops/alignment" element={<AlignmentWorkshop />} />
          <Route path="/workshops/motivation" element={<MotivationWorkshop />} />
          <Route path="/workshops/leadership" element={<LeadershipWorkshop />} />
          <Route path="/shift-methodology" element={<ShiftMethodology />} />
          <Route path="/shift-diagnostic" element={<ShiftDiagnostic />} />
          <Route path="/executive-coaching" element={<Navigate to="/contagious-identity" replace />} />
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
          <Route path="/ai-readiness" element={<AIReadinessDiagnosticLanding />} />
          <Route path="/ai-readiness-diagnostic" element={<AIReadinessDiagnostic />} />
          <Route path="/life-os" element={<LifeOS />} />
          <Route path="/life-os/auth" element={<LifeOSAuth />} />
          <Route path="/podcast" element={<Podcast />} />
          <Route path="/podcast/:slug" element={<PodcastEpisode />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/new-manager-kit" element={<NewManagerKit />} />
          <Route path="/new-manager-kit/success" element={<NewManagerKitSuccess />} />
          <Route path="/difficult-conversations" element={<DifficultConversationsPlaybook />} />
          <Route path="/difficult-conversations/success" element={<DifficultConversationsSuccess />} />
          <Route path="/bundle/success" element={<BundleSuccess />} />
          <Route path="/contagious-identity" element={<ContagiousIdentityCoaching />} />
          <Route path="/contagious-identity-workbook" element={<ContagiousIdentityWorkbook />} />
          <Route path="/contagious-identity-workbook/success" element={<ContagiousIdentityWorkbookSuccess />} />
          <Route path="/auth" element={<Navigate to="/marketing" replace />} />
          <Route path="/admin" element={<Navigate to="/marketing" replace />} />
          <Route path="/admin/overviews" element={<AdminOverviews />} />
          <Route path="/admin/overview/executive-coaching" element={<ExecutiveCoachingOverview />} />
          <Route path="/admin/overview/shift-leadership" element={<ShiftLeadershipOverview />} />
          <Route path="/admin/overview/shift-methodology" element={<ShiftMethodologyOverview />} />
          <Route path="/admin/overview/workshop-alignment" element={<AlignmentWorkshopOverview />} />
          <Route path="/admin/overview/workshop-motivation" element={<MotivationWorkshopOverview />} />
          <Route path="/admin/overview/workshop-leadership" element={<LeadershipWorkshopOverview />} />
          <Route path="/admin/overview/leadership-levels" element={<LeadershipLevelsOverview />} />
          <Route path="/admin/overview/leadership-women" element={<LeadershipWomenOverview />} />
          <Route path="/admin/overview/grand-masters" element={<GrandMastersOverview />} />
          <Route path="/admin/overview/ai-leadership" element={<AILeadershipOverview />} />
          <Route path="/admin/overview/leader-as-coach" element={<LeaderAsCoachOverview />} />
          <Route path="/admin/programmes" element={<AdminAllProgrammes />} />
          <Route path="/admin/programmes/:id" element={<ProgrammeDetailView />} />
          <Route path="/marketing" element={<MarketingDashboard />} />
          <Route
            path="/blog-admin"
            element={
              <AdminProtectedRoute>
                <BlogAdminList />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/blog-admin/:slug"
            element={
              <AdminProtectedRoute>
                <BlogAdmin />
              </AdminProtectedRoute>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatWidget />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
