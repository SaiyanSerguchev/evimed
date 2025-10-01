import React, { useState } from 'react';
import HeaderSection from './components/HeaderSection';
import HeroBanner from './components/HeroBanner';
import ServicesSection from './components/ServicesSection';
import AdvantagesSection from './components/AdvantagesSection';
import InstructionsSection from './components/InstructionsSection';
import SectionDivider from './components/SectionDivider';
import ContactSection from './components/ContactSection';
import FooterSection from './components/FooterSection';
import AdminPanel from './pages/AdminPanel';

function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  // Проверяем URL для показа админ панели
  React.useEffect(() => {
    if (window.location.pathname === '/admin') {
      setShowAdmin(true);
    }
  }, []);

  if (showAdmin) {
    return <AdminPanel />;
  }

  return (
    <div className="App">
      <HeaderSection />
      <HeroBanner />
      <AdvantagesSection />
      <div className="dark-wrapper">
        <ServicesSection />
        <SectionDivider />
        <InstructionsSection />
        <SectionDivider />
        <ContactSection />
      </div>
      <FooterSection />
    </div>
  );
}

export default App;
