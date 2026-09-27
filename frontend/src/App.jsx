import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import EmailVerification from './pages/EmailVerification';
import ForgotPassword from './pages/ForgotPassword';
import OTPVerification from './pages/OTPVerification';
import CreateNewPassword from './pages/CreateNewPassword';
import PasswordResetSuccess from './pages/PasswordResetSuccess';

import StudentProfile from './pages/StudentProfile';
import DetailedProfile from './pages/DetailedProfile';
import PersonalizedQuestions from './pages/PersonalizedQuestions';
import ProfileAnalysis from './pages/ProfileAnalysis';
import AIAnalysisResult from './pages/AIAnalysisResult';
import CareerRecommendations from './pages/CareerRecommendations';
import CareerDetails from './pages/CareerDetails';
import SavedCareers from './pages/SavedCareers';
import EligibilityCheck from './pages/EligibilityCheck';
import ExploreOtherOptions from './pages/ExploreOtherOptions';
import ActionPlan from './pages/ActionPlan';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import ScholarshipFinder from './pages/ScholarshipFinder';
import InternshipFinder from './pages/InternshipFinder';
import About from './pages/About';
import Features from './pages/Features';
import Chatbot from './components/Chatbot';

function CareerAssistantLayer() {
  const { pathname: path } = useLocation();
  const publicPaths = new Set([
    '/',
    '/about',
    '/features',
    '/register',
    '/login',
    '/email-verification',
    '/forgot-password',
    '/otp-verification',
    '/create-new-password',
    '/password-reset-success'
  ]);

  return publicPaths.has(path) ? null : <Chatbot />;
}

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Public & Authentication Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/create-new-password" element={<CreateNewPassword />} />
        <Route path="/password-reset-success" element={<PasswordResetSuccess />} />

        {/* Profile & Conversational Discovery Wizard */}
        <Route path="/student-profile" element={<StudentProfile />} />
        <Route path="/detailed-profile" element={<DetailedProfile />} />
        <Route path="/personalized-questions" element={<PersonalizedQuestions />} />

        {/* AI Analysis & Recommendations */}
        <Route path="/profile-analysis" element={<ProfileAnalysis />} />
        <Route path="/ai-analysis-result" element={<AIAnalysisResult />} />
        <Route path="/career-recommendations" element={<CareerRecommendations />} />
        <Route path="/career-details/:id" element={<CareerDetails />} />
        <Route path="/saved-careers" element={<SavedCareers />} />

        {/* Guidance, Eligibility & Action Plan */}
        <Route path="/eligibility-check" element={<EligibilityCheck />} />
        <Route path="/explore-options" element={<ExploreOtherOptions />} />
        <Route path="/action-plan" element={<ActionPlan />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/scholarships" element={<ScholarshipFinder />} />
        <Route path="/internships" element={<InternshipFinder />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <CareerAssistantLayer />
    </Router>
  );
}
