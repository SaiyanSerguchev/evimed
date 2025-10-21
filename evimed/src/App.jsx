import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HeaderSection from './components/HeaderSection';
import HeroBanner from './components/HeroBanner';
import ServicesSection from './components/ServicesSection';
import AdvantagesSection from './components/AdvantagesSection';
import InstructionsSection from './components/InstructionsSection';
import SectionDivider from './components/SectionDivider';
import ContactSection from './components/ContactSection';
import FooterSection from './components/FooterSection';
import AdminPanel from './pages/AdminPanel';
import AppointmentModal from './components/AppointmentModal';

function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

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
      <HeroBanner onOpenAppointment={() => setShowAppointmentModal(true)} />
      <AdvantagesSection />
      <div className="dark-wrapper">
        <ServicesSection />
        <SectionDivider />
        <InstructionsSection />
        <SectionDivider />
        <ContactSection />
      </div>
      <FooterSection />
      
      <AppointmentModal 
        isOpen={showAppointmentModal} 
        onClose={() => setShowAppointmentModal(false)} 
      />
      
      {/* Toast уведомления */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
