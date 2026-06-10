import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import CustomCursor from "@/components/CustomCursor";
import PageTransition from "@/components/PageTransition";
import NotFoundPage from "@/components/NotFoundPage";

// Pages
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ServicesPage from "@/pages/ServicesPage";
import ContactPage from "@/pages/ContactPage";
import CareersPage from "@/pages/CareersPage";
import CaseStudiesPage from "@/pages/CaseStudiesPage";
import CaseStudyDetailPage from "@/pages/CaseStudyDetailPage";
import InsightsPage from "@/pages/InsightsPage";
import PrivacyPage from "@/pages/PrivacyPage";
import TermsPage from "@/pages/TermsPage";

export default function App() {
  return (
    <BrowserRouter>
      <CustomCursor />
      <Toaster position="bottom-right" richColors />
      <PageTransition>
        <Routes>
          <Route path="/"                        element={<HomePage />} />
          <Route path="/about"                   element={<AboutPage />} />
          <Route path="/services"                element={<ServicesPage />} />
          <Route path="/contact"                 element={<ContactPage />} />
          <Route path="/careers"                 element={<CareersPage />} />
          <Route path="/case-studies"            element={<CaseStudiesPage />} />
          <Route path="/case-studies/:slug"      element={<CaseStudyDetailPage />} />
          <Route path="/insights"                element={<InsightsPage />} />
          <Route path="/privacy"                 element={<PrivacyPage />} />
          <Route path="/terms"                   element={<TermsPage />} />
          <Route path="*"                        element={<NotFoundPage />} />
        </Routes>
      </PageTransition>
    </BrowserRouter>
  );
}
