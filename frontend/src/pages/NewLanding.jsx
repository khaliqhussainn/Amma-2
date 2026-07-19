import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NewLanding/Navbar';
import Hero from '../components/NewLanding/Hero';
import Partnerships from '../components/NewLanding/Partnerships';
import Footer from '../components/NewLanding/Footer';

const NewLanding = () => {
  const navigate = useNavigate();

  const handleJoinClick = (tier = null) => {
    const path = tier ? `/register?tier=${encodeURIComponent(tier)}` : '/register';
    navigate(path);
  };

  const handleBecomeMemberClick = () => {
    navigate('/membership-info#plans');
  };

  return (
    <div className="bg-white font-sans min-h-screen">
      <Navbar onJoinClick={() => handleJoinClick()} />
      <main className="flex flex-col">
        <Hero onJoinClick={handleBecomeMemberClick} />
        <Partnerships />
      </main>
      <Footer />
    </div>
  );
};

export default NewLanding;
