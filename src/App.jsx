import React from 'react';
import HeaderSection from './components/HeaderSection';
import HeroBanner from './components/HeroBanner';
import ServicesSection from './components/ServicesSection';
import AdvantagesSection from './components/AdvantagesSection';
import InstructionsSection from './components/InstructionsSection';
import ContactSection from './components/ContactSection';
import FooterSection from './components/FooterSection';

function App() {
  return (
    <div className="App">
      <HeaderSection />
      <HeroBanner />
      <ServicesSection />
      <AdvantagesSection />
      <InstructionsSection />
      <ContactSection />
      <FooterSection />
    </div>
  );
}

export default App;
