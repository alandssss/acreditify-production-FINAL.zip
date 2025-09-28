import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import MainDashboard from './pages/main-dashboard';
import ComplianceVerification from './pages/compliance-verification';
import RefundStatusTracking from './pages/refund-status-tracking';
import LoginAuthentication from './pages/login-authentication';
import RefundRequestWizard from './pages/refund-request-wizard';
import UserRegistration from './pages/user-registration';
import SubmissionPreparation from './pages/submission-preparation';
import DocumentUploadManager from './pages/document-upload-manager';
import RefundHistory from './pages/refund-history';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<LoginAuthentication />} />
        <Route path="/main-dashboard" element={<MainDashboard />} />
        <Route path="/dashboard" element={<MainDashboard />} />
        <Route path="/compliance-verification" element={<ComplianceVerification />} />
        <Route path="/refund-status-tracking" element={<RefundStatusTracking />} />
        <Route path="/login-authentication" element={<LoginAuthentication />} />
        <Route path="/refund-request-wizard" element={<RefundRequestWizard />} />
        <Route path="/user-registration" element={<UserRegistration />} />
        <Route path="/submission-preparation" element={<SubmissionPreparation />} />
        <Route path="/document-upload-manager" element={<DocumentUploadManager />} />
        <Route path="/refund-history" element={<RefundHistory />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
