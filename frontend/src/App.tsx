import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from 'sonner';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import AIChatbot from './components/AIChatbot';

// Pages
import Home from './pages/Home';
import Stories from './pages/Stories';
import Workshops from './pages/Workshops';
import Marketplace from './components/Marketplace';
import Forum from './pages/Forum';
import Destinations from './pages/Destinations';
import RecentEvents from './pages/RecentEvents';
import Artists from './pages/Artists';
import Dashboard from './pages/Dashboard';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-[#060A12] text-amber-50 flex flex-col justify-between transition-colors duration-300 selection:bg-amber-500 selection:text-black">
            <div>
              <Toaster position="top-right" richColors />
              <Header onAuthClick={() => setIsAuthModalOpen(true)} />
              <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
              <CartDrawer />
              
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/stories" element={<Stories />} />
                  <Route path="/workshops" element={<Workshops />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/forum" element={<Forum />} />
                  <Route path="/destinations" element={<Destinations />} />
                  <Route path="/recent-events" element={<RecentEvents />} />
                  <Route path="/artists" element={<Artists />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
              </main>
            </div>
            
            <Footer />
          </div>
        </Router>
        <AIChatbot />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;