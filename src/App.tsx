import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { AccessibilityWidget } from './components/AccessibilityWidget';
import { LandingPage } from './pages/LandingPage';
import { ChatbotPage } from './pages/ChatbotPage';

const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./pages/TermsOfService').then(m => ({ default: m.TermsOfService })));

// Component to handle scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function FaviconByRoute() {
  const { pathname } = useLocation();
  useEffect(() => {
    const isChatbot = pathname === '/chatbot' || pathname === '/chatbot/';
    const href = isChatbot ? '/logo-ute.png' : '/logo.png';

    let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.type = 'image/png';
    link.href = href;
  }, [pathname]);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <FaviconByRoute />
      <AccessibilityWidget />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/chatbot/" element={<ChatbotPage />} />
          <Route path="/privacidad" element={<PrivacyPolicy />} />
          <Route path="/terminos" element={<TermsOfService />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
