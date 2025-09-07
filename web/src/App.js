import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ExpertisePage from './pages/ExpertisePage';
import TechnologiesPage from './pages/TechnologiesPage';
import OffshoreDeveloperPage from './pages/OffshoreDeveloperPage';
import ProductsPage from './pages/ProductsPage';
import AboutPage from './pages/AboutPage';
import ResourcesPage from './pages/ResourcesPage';
import BlogPage from './pages/BlogPage';
import ProfilePage from './pages/ProfilePage';
import PortfolioPage from './pages/PortfolioPage';
import PortfolioDetailPage from "./pages/PortfolioDetailPage";
import ContactPage from './pages/ContactPage';
import SoftwareDevelopmentPage from './pages/SoftwareDevelopmentPage';
import MobileAppDevelopmentPage from './pages/MobileAppDevelopmentPage';
import ApplicationModernizationPage from './pages/ApplicationModernizationPage';
import HireDedicatedDevelopersPage from './pages/HireDedicatedDevelopersPage';
import UIUXServicesPage from './pages/UIUXServicesPage';
import SaaSDevelopmentPage from './pages/SaaSDevelopmentPage';
import WebAppDevelopmentPage from './pages/WebAppDevelopmentPage';
import APIIntegrationPage from './pages/ApiIntegrationPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/expertise" element={<ExpertisePage />} />
        <Route path="/technologies" element={<TechnologiesPage />} />
        <Route path="/offshore-developer" element={<OffshoreDeveloperPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/resources/blogs" element={<BlogPage />} />
        <Route path="/resources/profile" element={<ProfilePage />} />
        <Route path="/resources/portfolio" element={<PortfolioPage />} />
        <Route path="/portfolio/:slug" element={<PortfolioDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/services/software-development" element={<SoftwareDevelopmentPage />} />
        <Route path="/services/mobile-app-development" element={<MobileAppDevelopmentPage />} />
        <Route path="/services/application-modernization" element={<ApplicationModernizationPage />} />
        <Route path="/services/hire-dedicated-developers" element={<HireDedicatedDevelopersPage />} />
        <Route path="/services/ui-ux-services" element={<UIUXServicesPage />} />
        <Route path="/services/saas-development" element={<SaaSDevelopmentPage />} />
        <Route path="/services/web-app-development" element={<WebAppDevelopmentPage />} />
        <Route path="/services/api-integration" element={<APIIntegrationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
