import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  User,
  LogOut,
  Settings,
  CreditCard,
  Bell,
  LayoutDashboard,
  Users,
  Calendar,
  Briefcase,
  X,
  Save,
  CheckCircle2,
  RefreshCw,
  ChevronDown,
  Search,
  Check,
  Menu,
  Eye,
  ArrowRight
} from 'lucide-react';
import Navbar from '../components/NewLanding/Navbar';
import Footer from '../components/NewLanding/Footer';
import toast from 'react-hot-toast';
import api from '../utils/api';
import pagesData from '../data/pagesData.json';

const SearchableSelect = ({ label, name, options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = React.useRef(null);

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (opt) => {
    onChange({ target: { name, value: opt } });
    setIsOpen(false);
    setSearchTerm("");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <label className="text-[12px] font-extrabold text-[#042C53]/50 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none transition-all font-bold text-[#042C53] text-left ${isOpen ? 'border-[#AD1F23] bg-white' : ''}`}
        >
          <span className={value ? 'text-[#042C53]' : 'text-gray-400'}>
            {value || placeholder}
          </span>
          <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute z-[60] left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-50">
                <div className="relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#AD1F23]/20"
                    placeholder="Search options..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((opt, i) => (
                    <div
                      key={i}
                      onClick={() => handleSelect(opt)}
                      className="px-6 py-3 hover:bg-gray-50 cursor-pointer text-sm font-medium text-[#042C53] flex items-center justify-between"
                    >
                      {opt}
                      {value === opt && <Check size={14} className="text-[#AD1F23]" />}
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-4 text-sm text-gray-400 text-center">No results found</div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const getProfessionsForCategory = (category) => {
  if (!category) return ["Other"];
  if (category.includes("Physicians & Dentists")) return [
    "Physician (MD/DO)", "Dentist (DDS/DMD)", "Podiatrist (DPM)", "Optometrist (OD)", "Veterinarian (DVM)", "International Physician/Dentist", "Other"
  ];
  if (category.includes("Licensed Healthcare")) return [
    "Nurse Practitioner (NP)", "Physician Assistant (PA)", "CRNA", "Registered Nurse (RN/LVN/LPN)", "Pharmacist", "Physical Therapist", "Occupational Therapist", "Speech-Language Pathologist", "Audiologist", "Registered Dietitian", "Psychologist", "Licensed Counselor/Therapist", "Chiropractor", "Respiratory Therapist", "Paramedic/EMT", "Genetic Counselor", "Lactation Consultant", "Perfusionist", "Other"
  ];
  if (category.includes("Allied Staff")) return [
    "Healthcare Administrator", "Epidemiologist", "Public Health Professional", "Medical Assistant", "Technician (Imaging/Lab/Surgical)", "Social Worker", "Chaplain", "Clinical Researcher", "Healthcare IT/Informatics", "Case Manager", "Community Health Worker", "Medical Interpreter", "Hospital Operations/Quality", "Other"
  ];
  if (category.includes("Trainees & Students")) return [
    "Resident", "Fellow", "Medical Student", "Dental Student", "Nursing Student", "PA/NP/Pharmacy Student", "Premedical Student", "Other"
  ];
  return ["Other"];
};

const usStates = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const MemberDashboard = () => {
  const { user, logout, updateProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [activeTab, setActiveTab] = useState('Overview');
  const [plans, setPlans] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [viewingPlan, setViewingPlan] = useState(null);

  const planMetadata = pagesData.membershipInfo.tiers;
  const planImages = [
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=600&auto=format&fit=crop"
  ];

  const fetchPlans = async () => {
    try {
      const response = await api.get('/subscription-plans/active');
      setPlans(response.data.data.plans);
    } catch (error) {
      console.error('Failed to fetch plans', error);
    }
  };

  useEffect(() => {
    if (user) {
      const [city, state] = (user.cityState || '').split(',').map(s => s.trim());
      setEditForm({
        name: user.name || '',
        title: user.title || '',
        profession: user.profession || '',
        specialty: user.specialty || '',
        employer: user.employer || '',
        job_role: user.job_role || '',
        phone: user.phone || '',
        city: city || '',
        state: state || '',
        country: user.country || '',
        licenseNumber: user.licenseNumber || '',
        licensingState: user.licensingState || '',
        trainingInstitution: user.trainingInstitution || '',
      });
    }
    fetchPlans();
  }, [user]);

  // Auth Guard
  useEffect(() => {
    if (!loading && !user) {
      toast.error('Session expired. Please log in again.');
      navigate('/login');
    } else if (user && user.status === 'PENDING' && user.role !== 'ADMIN') {
      navigate('/pending-approval');
    } else if (user && user.status === 'BLOCKED' && user.role !== 'ADMIN') {
      toast.error('Your account is restricted. Please contact support.');
      logout();
      navigate('/login');
    }
  }, [user, loading, navigate, logout]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const { city, state, ...restOfForm } = editForm;
    const finalData = {
      ...restOfForm,
      cityState: city && state ? `${city}, ${state}` : city || state || ''
    };
    try {
      await updateProfile(finalData);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Update failed', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePlan = async (planId) => {
    if (user.plan_id === planId) return;

    setIsUpdating(true);
    try {
      await updateProfile({ plan_id: planId });
      toast.success('Membership plan updated successfully');
    } catch (error) {
      console.error('Update plan failed', error);
      toast.error('Failed to update membership plan');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#AD1F23]"></div>
          <p className="text-gray-500 font-medium animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const NavItems = [
    { icon: LayoutDashboard, label: 'Overview', active: activeTab === 'Overview' },
    { icon: Users, label: 'Community', comingSoon: true },
    { icon: Calendar, label: 'Events', comingSoon: true },
    { icon: Briefcase, label: 'Career Hub', comingSoon: true },
    { icon: CreditCard, label: 'Membership', comingSoon: true },
    { icon: Bell, label: 'Notifications', comingSoon: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar onJoinClick={() => navigate('/register')} />

      <main className="flex-1 w-full p-4 md:p-8 lg:p-12">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-6 md:gap-10">

          {/* Mobile Header Toggle */}
          <div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#042C53]/5 flex items-center justify-center">
                <User size={20} className="text-[#042C53]" />
              </div>
              <div>
                <h4 className="font-bold text-[#042C53] text-sm">{user.name}</h4>
                <p className="text-[10px] text-gray-500 uppercase font-bold">{user.role}</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} className="text-[#AD1F23]" /> : <Menu size={24} className="text-[#042C53]" />}
            </button>
          </div>

          {/* Sidebar (Desktop) */}
          <aside className="hidden lg:block lg:w-80 shrink-0 space-y-6">
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-[#042C53]/5 flex items-center justify-center mb-4 relative">
                <User size={40} className="text-[#042C53]" />
                <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
              </div>
              <h3 className="text-xl font-bold text-[#042C53]">{user.name}</h3>
              <p className="text-sm text-gray-500 font-medium mb-6 uppercase tracking-wider text-[10px]">{user.role}</p>

              <button
                onClick={() => setIsEditModalOpen(true)}
                className="w-full py-3 bg-gray-50 text-[#042C53] rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                <Settings size={16} />
                Edit Profile
              </button>
            </div>

            <nav className="bg-white rounded-[32px] p-4 shadow-sm border border-gray-100 space-y-2">
              {NavItems.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (!item.comingSoon) setActiveTab(item.label);
                  }}
                  className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${item.active
                    ? 'bg-[#AD1F23] text-white shadow-lg shadow-red-900/10'
                    : item.comingSoon
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-[#042C53]'
                    }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                  {item.comingSoon && (
                    <span className="ml-auto text-[8px] font-extrabold bg-gray-100 text-gray-400 px-2 py-1 rounded-md uppercase tracking-tighter whitespace-nowrap">
                      Coming Soon
                    </span>
                  )}
                </button>
              ))}

              <div className="pt-4 mt-4 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm text-[#AD1F23] hover:bg-red-50 transition-all"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </nav>
          </aside>

          {/* Mobile Sidebar (Drawer) */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="fixed inset-0 bg-[#042C53]/40 backdrop-blur-sm z-[90] lg:hidden"
                />
                <motion.aside
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed inset-y-0 left-0 w-[280px] bg-white z-[100] lg:hidden shadow-2xl flex flex-col"
                >
                  <div className="p-8 border-b border-gray-50 flex flex-col items-center text-center">
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="absolute top-4 right-4 p-2 hover:bg-gray-50 rounded-xl"
                    >
                      <X size={20} className="text-gray-400" />
                    </button>
                    <div className="w-16 h-16 rounded-full bg-[#042C53]/5 flex items-center justify-center mb-3">
                      <User size={30} className="text-[#042C53]" />
                    </div>
                    <h3 className="font-bold text-[#042C53]">{user.name}</h3>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{user.role}</p>
                  </div>

                  <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {NavItems.map((item, i) => (
                      <button
                        key={i}
                        disabled={item.comingSoon}
                        onClick={() => {
                          if (!item.comingSoon) {
                            setActiveTab(item.label);
                            setIsMobileMenuOpen(false);
                          }
                        }}
                        className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-sm transition-all ${item.active
                          ? 'bg-[#AD1F23] text-white shadow-lg shadow-red-900/10'
                          : item.comingSoon
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-gray-50'
                          }`}
                      >
                        <item.icon size={18} />
                        <span>{item.label}</span>
                        {item.comingSoon && (
                          <span className="ml-auto text-[8px] font-extrabold bg-gray-100 text-gray-400 px-2 py-1 rounded-md uppercase tracking-tighter whitespace-nowrap">
                            Coming Soon
                          </span>
                        )}
                      </button>
                    ))}
                  </nav>

                  <div className="p-4 border-t border-gray-50">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-sm text-[#AD1F23] hover:bg-red-50"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <section className="flex-1 space-y-6 md:space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#042C53]">Welcome back, {user.name.split(' ')[0]}!</h1>
                <p className="text-sm md:text-base text-gray-500 mt-1">Here is what's happening in the AMMA community today.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] md:text-xs font-bold text-[#AD1F23] bg-red-50 px-4 py-2 rounded-full uppercase tracking-widest">
                  {user.plan_name || user.package || 'Standard Member'}
                </span>
              </div>
            </header>

            {activeTab === 'Overview' && (
              <>
                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {[
                    { label: 'Upcoming Events', value: '0', color: 'bg-blue-50 text-blue-600' },
                    { label: 'New Messages', value: '0', color: 'bg-green-50 text-green-600' },
                    { label: 'Chapter Updates', value: '0', color: 'bg-purple-50 text-purple-600' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-100">
                      <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
                      <div className="text-3xl md:text-4xl font-bold text-[#042C53]">{stat.value}</div>
                    </div>
                  ))}
                </div>

                {/* Profile Overview */}
                <div className="bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-10 shadow-sm border border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <h3 className="text-xl font-bold text-[#042C53]">Professional Profile</h3>
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="sm:hidden text-[#AD1F23] font-bold text-sm flex items-center gap-2"
                    >
                      <Settings size={14} />
                      Edit Details
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 md:gap-y-8 gap-x-12">
                    {[
                      { label: 'Title', value: user.title },
                      { label: 'Profession', value: user.profession },
                      { label: 'Specialty', value: user.specialty },
                      { label: 'Job Role', value: user.job_role },
                      { label: 'Employer', value: user.employer },
                      { label: 'Phone', value: user.phone },
                      { label: 'City/State', value: user.cityState },
                      { label: 'Country', value: user.country },
                      ...(user.plan_name?.includes('Trainees') || user.package?.includes('Trainees')
                        ? [{ label: 'Training Institution', value: user.trainingInstitution }]
                        : [
                          { label: 'License Number', value: user.licenseNumber },
                          { label: 'Licensing State', value: user.licensingState }
                        ]
                      )
                    ].map((item, i) => (
                      <div key={i} className="space-y-1">
                        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">{item.label}</p>
                        <p className="text-[#042C53] font-bold text-sm md:text-base">{item.value || 'Not provided'}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                      <h4 className="font-bold text-[#042C53]">Membership Status</h4>
                      <p className="text-xs md:text-sm text-gray-500">Your membership is active and in good standing.</p>
                    </div>
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="w-full md:w-auto px-8 py-4 bg-[#042C53] text-white rounded-2xl font-bold hover:bg-[#031d38] transition-all shadow-xl shadow-blue-900/10"
                    >
                      Update Profile Details
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'Membership' && (
              <div className="bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-10 shadow-sm border border-gray-100">
                <div className="mb-10">
                  <h3 className="text-2xl font-bold text-[#042C53] mb-2">My Membership</h3>
                  <p className="text-gray-500">View and update your membership category.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <div className="bg-gray-50 p-8 rounded-[32px] border border-gray-100">
                    <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-4">Current Plan</p>
                    <div className="space-y-2">
                      <h4 className="text-3xl font-bold text-[#AD1F23]">{user.plan_name || user.package || 'Standard Member'}</h4>
                      <div className="pt-4 flex items-center gap-2 text-green-600">
                        <CheckCircle2 size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Active</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center space-y-4">
                    <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                      <h5 className="font-bold text-[#042C53] text-sm mb-1">Need to change?</h5>
                      <p className="text-xs text-gray-600">You can update your membership category at any time. Select a new category from the list to update your profile.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="font-bold text-[#042C53]">Available Categories</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
                    {plans.length > 0 ? (
                      plans.map((plan, i) => {
                        const meta = planMetadata.find(m => m.name === plan.name) || {};
                        const planImg = planImages[i % planImages.length];

                        return (
                          <div
                            key={plan.id}
                            className={`bg-white border rounded-[40px] overflow-hidden flex flex-col shadow-lg transition-all duration-300 relative ${user.plan_id === plan.id ? 'border-[#AD1F23] ring-2 ring-[#AD1F23]/20 scale-[1.02]' : 'border-gray-100 hover:scale-[1.01]'
                              }`}
                          >
                            {/* Top Image Section */}
                            <div
                              className="w-full h-[180px] relative flex flex-col items-center justify-center p-6 text-center"
                              style={{
                                backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.85)), url(${planImg})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }}
                            >
                              {user.plan_id === plan.id && (
                                <div className="absolute top-4 right-4 bg-[#AD1F23] text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-1">
                                  <Check size={10} strokeWidth={4} />
                                  CURRENT
                                </div>
                              )}
                              <h3 className="text-xl font-bold text-white leading-tight drop-shadow-md px-2">
                                {plan.name}
                              </h3>
                            </div>

                            {/* Action Button */}
                            <div className="flex justify-center -mt-6 relative z-10 px-6 gap-2">
                              {user.plan_id === plan.id ? (
                                <div className="flex-1 py-3.5 bg-gray-100 text-gray-400 rounded-xl font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-not-allowed">
                                  Active Plan
                                </div>
                              ) : (
                                <button
                                  disabled={isUpdating}
                                  onClick={() => handleUpdatePlan(plan.id)}
                                  className="flex-1 py-3.5 bg-[#05308C] text-white rounded-xl font-bold transition-all text-xs shadow-lg flex items-center justify-center gap-2 hover:bg-[#042C53]"
                                >
                                  Select Category
                                  <ArrowRight size={14} />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setViewingPlan({ ...plan, ...meta, planImg });
                                }}
                                className="px-4 bg-white text-[#042C53] border border-gray-100 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-lg"
                              >
                                <Eye size={18} />
                              </button>
                            </div>

                            <div className="p-6 pt-10 space-y-4 flex-1 flex flex-col items-center text-center">
                              <p className="text-[11px] font-extrabold text-[#AD1F23] uppercase tracking-widest">{meta.bestFor || 'Member Category'}</p>
                              <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2">{plan.description}</p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="col-span-full py-12 text-center bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium">No other categories available at the moment.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-[#042C53]/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col z-10"
            >
              <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-[#042C53]">Edit Profile</h2>
                  <p className="text-gray-500 text-xs md:text-sm">Update your professional information.</p>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 md:p-3 hover:bg-gray-100 rounded-2xl transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] md:text-[12px] font-extrabold text-[#042C53]/50 uppercase tracking-widest ml-1">Full Name</label>
                    <input
                      name="name"
                      value={editForm.name}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border-2 border-transparent focus:border-[#AD1F23] focus:bg-white rounded-2xl outline-none transition-all font-bold text-[#042C53]"
                    />
                  </div>
                  <div className="space-y-4">
                    <SearchableSelect
                      label="Title / Credentials"
                      name="title"
                      options={["MD", "DO", "DDS", "DMD", "RN", "NP", "PharmD", "PA-C", "LCSW", "PhD", "Other"]}
                      value={editForm.title}
                      onChange={handleInputChange}
                      placeholder="Select Credentials"
                    />
                  </div>
                  <div className="space-y-4">
                    <SearchableSelect
                      label="Profession"
                      name="profession"
                      options={getProfessionsForCategory(user.package)}
                      value={editForm.profession}
                      onChange={handleInputChange}
                      placeholder="Select Profession"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] md:text-[12px] font-extrabold text-[#042C53]/50 uppercase tracking-widest ml-1">Specialty</label>
                    <input
                      name="specialty"
                      value={editForm.specialty}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border-2 border-transparent focus:border-[#AD1F23] focus:bg-white rounded-2xl outline-none transition-all font-bold text-[#042C53]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] md:text-[12px] font-extrabold text-[#042C53]/50 uppercase tracking-widest ml-1">Employer</label>
                    <input
                      name="employer"
                      value={editForm.employer}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border-2 border-transparent focus:border-[#AD1F23] focus:bg-white rounded-2xl outline-none transition-all font-bold text-[#042C53]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] md:text-[12px] font-extrabold text-[#042C53]/50 uppercase tracking-widest ml-1">Phone</label>
                    <input
                      name="phone"
                      value={editForm.phone}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border-2 border-transparent focus:border-[#AD1F23] focus:bg-white rounded-2xl outline-none transition-all font-bold text-[#042C53]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] md:text-[12px] font-extrabold text-[#042C53]/50 uppercase tracking-widest ml-1">City</label>
                    <input
                      name="city"
                      value={editForm.city}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border-2 border-transparent focus:border-[#AD1F23] focus:bg-white rounded-2xl outline-none transition-all font-bold text-[#042C53]"
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="space-y-4">
                    <SearchableSelect
                      label="State"
                      name="state"
                      options={usStates}
                      value={editForm.state}
                      onChange={handleInputChange}
                      placeholder="Select State"
                    />
                  </div>

                  {user.package?.includes('Trainees') ? (
                    <div className="space-y-2">
                      <label className="text-[10px] md:text-[12px] font-extrabold text-[#042C53]/50 uppercase tracking-widest ml-1">Training Institution</label>
                      <input
                        name="trainingInstitution"
                        value={editForm.trainingInstitution}
                        onChange={handleInputChange}
                        className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border-2 border-transparent focus:border-[#AD1F23] focus:bg-white rounded-2xl outline-none transition-all font-bold text-[#042C53]"
                        placeholder="University Name"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <label className="text-[10px] md:text-[12px] font-extrabold text-[#042C53]/50 uppercase tracking-widest ml-1">License Number</label>
                        <input
                          name="licenseNumber"
                          value={editForm.licenseNumber}
                          onChange={handleInputChange}
                          className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border-2 border-transparent focus:border-[#AD1F23] focus:bg-white rounded-2xl outline-none transition-all font-bold text-[#042C53]"
                          placeholder="License No."
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] md:text-[12px] font-extrabold text-[#042C53]/50 uppercase tracking-widest ml-1">Licensing State</label>
                        <input
                          name="licensingState"
                          value={editForm.licensingState}
                          onChange={handleInputChange}
                          className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border-2 border-transparent focus:border-[#AD1F23] focus:bg-white rounded-2xl outline-none transition-all font-bold text-[#042C53]"
                          placeholder="State/Country"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4 pb-4">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="order-2 sm:order-1 flex-1 py-4 border-2 border-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="order-1 sm:order-2 flex-[2] py-4 bg-[#AD1F23] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#8e191d] transition-all shadow-xl shadow-red-900/10 disabled:opacity-50"
                  >
                    {isUpdating ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewingPlan && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingPlan(null)}
              className="absolute inset-0 bg-[#042C53]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
            >
              <button
                onClick={() => setViewingPlan(null)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-20 bg-white/80 backdrop-blur-sm shadow-md"
              >
                <X size={24} className="text-gray-400" />
              </button>

              <div className="relative h-64 w-full shrink-0">
                <img src={viewingPlan.planImg} className="w-full h-full object-cover" alt={viewingPlan.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#042C53] via-[#042C53]/40 to-transparent"></div>
                <div className="absolute bottom-8 left-8 md:left-12 right-8">
                  <span className="text-[10px] font-extrabold text-white/70 uppercase tracking-[0.2em]">{viewingPlan.bestFor}</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mt-1 leading-tight">{viewingPlan.name}</h2>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 custom-scrollbar">
                <div>
                  <p className="text-gray-600 leading-relaxed text-lg md:text-xl">
                    {viewingPlan.description}
                  </p>
                </div>

                <div className="space-y-6">
                  <h4 className="text-[11px] font-extrabold text-[#042C53]/40 uppercase tracking-widest">Complete Inclusion List</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {(viewingPlan.inclusions || []).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 text-[14px] text-gray-600">
                        <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                          <Check size={12} className="text-[#AD1F23]" />
                        </div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 pt-10 border-t border-gray-100">
                  <div className="flex-1 w-full">
                    {user.plan_id !== viewingPlan.id ? (
                      <button
                        onClick={() => {
                          handleUpdatePlan(viewingPlan.id);
                          setViewingPlan(null);
                        }}
                        className="w-full py-6 bg-[#042C53] text-white rounded-[24px] font-bold hover:bg-[#031d38] transition-all shadow-xl shadow-blue-900/10 flex items-center justify-center gap-3 text-lg"
                      >
                        Update Membership
                        <ArrowRight size={22} />
                      </button>
                    ) : (
                      <div className="w-full py-6 bg-green-50 text-green-600 rounded-[24px] font-bold flex items-center justify-center gap-3 border border-green-100 text-lg">
                        <CheckCircle2 size={24} />
                        Active Member
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default MemberDashboard;
