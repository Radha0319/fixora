// UI: Fixora Main Application with role-based view orchestration and error boundary
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { NotificationModal } from './components/NotificationModal.jsx';
import { LoadingSpinner } from './components/FeedbackStates.jsx';

// Pages
import { LandingPage } from './pages/LandingPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterCustomerPage } from './pages/RegisterCustomerPage.jsx';
import { RegisterProviderPage } from './pages/RegisterProviderPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';

// Customer Pages
import { CustomerDashboard } from './pages/customer/CustomerDashboard.jsx';
import { TroubleshootingAssistant } from './pages/customer/TroubleshootingAssistant.jsx';
import { CustomerVerification } from './pages/customer/CustomerVerification.jsx';
import { ProviderSearch } from './pages/customer/ProviderSearch.jsx';
import { ServiceRequestsList } from './pages/customer/ServiceRequestsList.jsx';

// Provider Pages
import { ProviderDashboard } from './pages/provider/ProviderDashboard.jsx';
import { ProviderFaceRegistration } from './pages/provider/ProviderFaceRegistration.jsx';
import { ProviderDocuments } from './pages/provider/ProviderDocuments.jsx';
import { ProviderExpertise } from './pages/provider/ProviderExpertise.jsx';
import { ProviderRequests } from './pages/provider/ProviderRequests.jsx';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard.jsx';
import { AdminCustomerReview } from './pages/admin/AdminCustomerReview.jsx';
import { AdminProviderReview } from './pages/admin/AdminProviderReview.jsx';
import { AdminCategories } from './pages/admin/AdminCategories.jsx';
import { AdminRequests } from './pages/admin/AdminRequests.jsx';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('landing');
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchParams, setSearchParams] = useState({});

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner message="Initializing Fixora platform..." />
      </div>
    );
  }

  // Navigation handler
  const handleNavigate = (view, params = {}) => {
    setSearchParams(params);
    if (['landing', 'login', 'register', 'register-provider', 'register-servicer'].includes(view)) {
      setCurrentView(view);
    } else {
      setCurrentView('app');
      setCurrentTab(view);
    }
  };

  // Render view for unauthenticated public flow
  if (!user && currentView !== 'app') {
    return (
      <div>
        <Navbar
          onOpenNotifications={() => setNotificationsOpen(true)}
          onNavigate={handleNavigate}
          currentTab={currentTab}
        />
        {currentView === 'landing' && (
          <LandingPage
            onNavigate={handleNavigate}
            onSelectCategory={(cat) => handleNavigate('chat', { category: cat })}
          />
        )}
        {currentView === 'login' && <LoginPage onNavigate={handleNavigate} />}
        {currentView === 'register' && <RegisterCustomerPage onNavigate={handleNavigate} />}
        {(currentView === 'register-provider' || currentView === 'register-servicer') && (
          <RegisterProviderPage onNavigate={handleNavigate} />
        )}
        {/* Even unauthenticated guests can test AI troubleshooter */}
        {currentView === 'chat' && (
          <TroubleshootingAssistant
            onNavigate={handleNavigate}
            preselectedCategory={searchParams.category}
          />
        )}
      </div>
    );
  }

  // Render Authenticated Dashboard by Role
  const renderRoleContent = () => {
    if (!user) {
      return (
        <TroubleshootingAssistant
          onNavigate={handleNavigate}
          preselectedCategory={searchParams.category}
        />
      );
    }

    // Universal Profile Page for all authenticated roles
    if (currentTab === 'profile') {
      return <ProfilePage onNavigate={handleNavigate} />;
    }

    // 1. CUSTOMER ROLE VIEWS
    if (user.role === 'CUSTOMER') {
      switch (currentTab) {
        case 'dashboard':
          return <CustomerDashboard onNavigate={handleNavigate} />;
        case 'chat':
          return <TroubleshootingAssistant onNavigate={handleNavigate} preselectedCategory={searchParams.category} />;
        case 'verification':
          return <CustomerVerification />;
        case 'providers':
          return <ProviderSearch onNavigate={handleNavigate} searchParams={searchParams} />;
        case 'requests':
          return <ServiceRequestsList onNavigate={handleNavigate} />;
        default:
          return <CustomerDashboard onNavigate={handleNavigate} />;
      }
    }

    // 2. SERVICE PROVIDER ROLE VIEWS
    if (user.role === 'PROVIDER') {
      switch (currentTab) {
        case 'dashboard':
          return <ProviderDashboard onNavigate={handleNavigate} />;
        case 'face':
          return <ProviderFaceRegistration onNavigate={handleNavigate} />;
        case 'documents':
          return <ProviderDocuments />;
        case 'expertise':
          return <ProviderExpertise />;
        case 'requests':
          return <ProviderRequests />;
        default:
          return <ProviderDashboard onNavigate={handleNavigate} />;
      }
    }

    // 3. ADMIN ROLE VIEWS
    if (user.role === 'ADMIN') {
      switch (currentTab) {
        case 'dashboard':
          return <AdminDashboard onNavigate={handleNavigate} />;
        case 'customer-reviews':
          return <AdminCustomerReview />;
        case 'provider-reviews':
          return <AdminProviderReview />;
        case 'categories':
          return <AdminCategories />;
        case 'requests':
          return <AdminRequests />;
        default:
          return <AdminDashboard onNavigate={handleNavigate} />;
      }
    }

    return <div className="page-container">Unknown role session.</div>;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        onOpenNotifications={() => setNotificationsOpen(true)}
        onNavigate={handleNavigate}
        currentTab={currentTab}
      />

      <div className="app-layout">
        {user && (
          <Sidebar currentTab={currentTab} onSelectTab={(tab) => handleNavigate(tab)} />
        )}
        <main className="main-content">
          {renderRoleContent()}
        </main>
      </div>

      <NotificationModal
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
