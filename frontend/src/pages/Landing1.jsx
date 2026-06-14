import React, { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Impact from '../components/Impact';
import Membership from '../components/Membership';
import ValueProposition from '../components/ValueProposition';
import Specialties from '../components/Specialties';
import Events from '../components/Events';
import Chapters from '../components/Chapters';
import Support from '../components/Support';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import MembershipModal from '../components/MembershipModal';
import { MessageCircle } from 'lucide-react';

function Landing1() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);

  const openModal = (tier = null) => {
    setSelectedTier(tier);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTier(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onJoinClick={() => openModal()} />
      <main>
        <Hero onJoinClick={() => openModal()} />
        <Impact />
        <Membership onJoinClick={openModal} />
        <ValueProposition />
        <Specialties />
        <Events />
        <Chapters />
        <Support />
        <Newsletter />
      </main>
      <Footer />

      <MembershipModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        initialTier={selectedTier}
      />

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/community"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-10 right-10 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-50 bg-[var(--amma-emerald)] border-4 border-white"
      >
        <MessageCircle className="text-white" size={32} />
      </a>
    </div>
  );
}

export default Landing1;
