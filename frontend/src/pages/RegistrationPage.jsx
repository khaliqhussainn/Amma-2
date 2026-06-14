import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, Award, CheckCircle2, ArrowRight, ChevronRight, Globe, ChevronDown, Search, Check, ShieldCheck } from 'lucide-react';
import Navbar from '../components/NewLanding/Navbar';
import Footer from '../components/NewLanding/Footer';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const SearchableSelect = ({ label, name, options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = React.useRef(null);
  const [isCustom, setIsCustom] = useState(false);

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (opt) => {
    if (opt === "Other") {
      setIsCustom(true);
      onChange({ target: { name, value: "" } });
    } else {
      onChange({ target: { name, value: opt } });
    }
    setIsOpen(false);
    setSearchTerm("");
  };

  const cancelCustom = () => {
    setIsCustom(false);
    onChange({ target: { name, value: "" } });
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isCustom) {
    return (
      <div className="space-y-2">
        <label className="text-[11px] font-extrabold text-[#042C53]/50 uppercase tracking-widest ml-1">{label} (Custom)</label>
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="relative group">
          <input
            autoFocus
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-6 py-4 bg-gray-50 border-2 border-[#AD1F23] rounded-2xl outline-none transition-all font-medium text-[#042C53] pr-12 shadow-sm"
            placeholder={`Enter custom ${label.toLowerCase()}...`}
          />
          <button
            type="button"
            onClick={cancelCustom}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#AD1F23] p-1 bg-white rounded-full shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-2 relative" ref={dropdownRef}>
      <label className="text-[11px] font-extrabold text-[#042C53]/50 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-6 py-4 bg-gray-50 border-2 rounded-2xl cursor-pointer transition-all flex items-center justify-between ${isOpen ? "border-[#AD1F23] bg-white shadow-lg" : "border-transparent hover:border-gray-200"}`}
        >
          <span className={`font-medium ${value ? "text-[#042C53]" : "text-gray-400"}`}>
            {value || placeholder}
          </span>
          <ChevronDown size={18} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute z-[100] top-full mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-3 border-b border-gray-50">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    autoFocus
                    type="text"
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#AD1F23]"
                    placeholder="Search..."
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
                      className="px-6 py-3 hover:bg-gray-50 cursor-pointer text-sm font-medium text-[#042C53] flex items-center justify-between group"
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

const RegistrationPage = () => {
  const navigate = useNavigate();
  const { user, register } = useAuth();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [otpSent, setOtpSent] = useState(null);
  const [userOtp, setUserOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState({
    plan_id: '',
    package: '',
    fullName: '',
    title: '',
    otherTitle: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    state: '',
    country: 'United States',
    profession: '',
    otherProfession: '',
    specialty: '',
    employer: '',
    job_role: '',
    licenseNumber: '',
    licensingState: '',
    trainingInstitution: '',
    attestation: false
  });

  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.status === 'PENDING') navigate('/pending-approval');
      else navigate('/member/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchPlans();
  }, [location.pathname, step]);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/subscription-plans/active');
      setPlans(response.data.data.plans);
    } catch (error) {
      console.error('Failed to fetch plans', error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tier = params.get('tier');

    if (tier && plans.length > 0) {
      const t = tier.toLowerCase();
      const matchedPlan = plans.find(p => p.name.toLowerCase().includes(t.includes('student') || t.includes('trainee') ? 'trainee' : t.split(' ')[0]));
      
      if (matchedPlan) {
        setFormData(prev => ({ 
          ...prev, 
          plan_id: matchedPlan.id,
          package: matchedPlan.name 
        }));
      }
    }
  }, [location.search, plans]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSendOtp = async () => {
    if (!formData.email || !formData.fullName || !formData.password) {
      toast.error("Please fill in all basic information first");
      return;
    }
    
    setIsVerifying(true);
    try {
      const response = await api.post('/auth/send-registration-otp', { email: formData.email });
      if (response.data.success) {
        setOtpSent(response.data.otp); // Note: In production we wouldn't receive this, but here we do for simplicity
        setStep(2);
        toast.success("Verification code sent to your email");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send verification code");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyOtp = () => {
    if (userOtp === otpSent?.toString()) {
      setStep(3);
      toast.success("Email verified successfully");
    } else {
      toast.error("Invalid verification code");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      handleSendOtp();
    } else if (step === 2) {
      handleVerifyOtp();
    } else if (step === 3) {
      try {
        const { city, state, ...restOfData } = formData;
        const payload = {
          ...restOfData,
          cityState: city && state ? `${city}, ${state}` : city || state || '',
          role: 'MEMBER'
        };
        await register(payload);
        navigate('/member/dashboard');
      } catch (error) {
        console.error('Registration failed:', error);
      }
    }
  };

  const packages = [
    "Physicians & Dentists",
    "Other Licensed Healthcare Professionals",
    "Allied Staff",
    "Trainees & Students"
  ];

  const usStates = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ];

  const getProfessionsForCategory = (category) => {
    if (!category) return ["Please select a category first"];
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

  const professions = getProfessionsForCategory(formData.package);

  const credentials = ["MD", "DO", "DDS", "DMD", "RN", "NP", "PharmD", "PA-C", "LCSW", "PhD", "Other"];

  // Mapping of Membership Categories to CharityStack Form IDs
  // const CHARITY_STACK_FORMS = {
  //   "Physicians & Dentists": "90cef333-277d-47f7-831e-f844e650d459",
  //   "Other Licensed Healthcare Professionals": "90cef333-277d-47f7-831e-f844e650d459",
  //   "Allied Staff": "90cef333-277d-47f7-831e-f844e650d459",
  //   "Trainees & Students": "90cef333-277d-47f7-831e-f844e650d459"
  // };

  // const currentFormId = CHARITY_STACK_FORMS[formData.package] || "90cef333-277d-47f7-831e-f844e650d459";

  const isTrainee = formData.package.includes("Trainees");
  const isLicensed = formData.package.includes("Physicians") || formData.package.includes("Licensed Healthcare");
  const isAllied = formData.package.includes("Allied Staff");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar onJoinClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />

      <main className="flex-1 flex items-center justify-center p-4 md:p-8 lg:p-12 relative">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#042C53]/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#AD1F23]/5 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[1300px] bg-white rounded-[40px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col lg:flex-row relative z-10 min-h-[700px]"
        >
          {/* Left Side: Branding */}
          <div className="hidden lg:flex lg:w-[35%] bg-[#042C53] p-12 flex-col justify-between relative overflow-hidden rounded-l-[40px]">
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?q=60&w=600&auto=format&fit=crop"
                className="w-full h-full object-cover opacity-20"
                alt="Medical Team"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#042C53] via-[#042C53]/95 to-[#AD1F23]/30"></div>
            </div>

            <div className="relative z-10">
            </div>

            <div className="relative z-10 space-y-6">
              <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight">
                {step === 1 ? "Step 1: Your Foundation" : step === 2 ? "Step 2: Email Verification" : "Step 3: Professional Profile"}
              </h1>
              <p className="text-blue-100/70 leading-relaxed">
                {step === 1
                  ? "Let's start by selecting your category and basic contact information."
                  : step === 2
                  ? "We've sent a verification code to your email. Please enter it below to confirm your identity."
                  : "Almost there! Provide your professional background to complete your registration."}
              </p>

              <div className="pt-4 flex flex-col gap-3">
                <div className={`flex items-center gap-3 font-bold transition-all ${step === 1 ? "text-white" : "text-white/40"}`}>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step === 1 ? "border-[#AD1F23] bg-[#AD1F23]" : "border-white/20"}`}>1</div>
                  Basic Info
                </div>
                <div className={`flex items-center gap-3 font-bold transition-all ${step === 2 ? "text-white" : "text-white/40"}`}>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step === 2 ? "border-[#AD1F23] bg-[#AD1F23]" : "border-white/20"}`}>2</div>
                  Verification
                </div>
                <div className={`flex items-center gap-3 font-bold transition-all ${step === 3 ? "text-white" : "text-white/40"}`}>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step === 3 ? "border-[#AD1F23] bg-[#AD1F23]" : "border-white/20"}`}>3</div>
                  Professional Info
                </div>
              </div>
            </div>

            <div className="relative z-10 text-xs text-blue-100/40 font-medium">
              © 2026 AMMA. Excellence Guided by Faith.
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="w-full lg:w-[65%] p-8 md:p-12 lg:p-16 flex flex-col">
            <div className="mb-10">
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-3xl font-bold text-[#042C53]">
                  {step === 1 ? "Basic Information" : step === 2 ? "Verify Email" : "Professional Details"}
                </h2>
                <span className="text-sm font-bold text-[#AD1F23] uppercase tracking-widest">Step {step} of 3</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "33%" }}
                  animate={{ width: step === 1 ? "33%" : step === 2 ? "66%" : "100%" }}
                  className="h-full bg-[#AD1F23]"
                />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2 mb-6 pb-6 border-b border-gray-100">
                      <label className="text-[11px] font-extrabold text-[#AD1F23] uppercase tracking-widest ml-1">Select Category</label>
                      <select
                        name="plan_id" required value={formData.plan_id} onChange={(e) => {
                          const selectedPlan = plans.find(p => p.id === parseInt(e.target.value));
                          setFormData(prev => ({ 
                            ...prev, 
                            plan_id: e.target.value,
                            package: selectedPlan ? selectedPlan.name : '',
                            profession: '' 
                          }));
                        }}
                        className="w-full px-6 py-4 bg-red-50/50 border-2 border-transparent focus:border-[#AD1F23] rounded-2xl outline-none transition-all font-bold text-[#042C53] appearance-none"
                      >
                        <option value="">Select a Category</option>
                        {plans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 items-start">
                      <div className="space-y-2">
                        <label className="text-[11px] font-extrabold text-[#042C53]/50 uppercase tracking-widest ml-1">Full Name</label>
                        <input
                          type="text" name="fullName" required value={formData.fullName} onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#AD1F23] focus:bg-white rounded-2xl outline-none transition-all font-medium text-[#042C53]"
                          placeholder="Sarah Ahmed"
                        />
                      </div>

                      <div className="space-y-4">
                        <SearchableSelect
                          label="Title / Credentials"
                          name="title"
                          options={credentials}
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="Select Credentials"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-extrabold text-[#042C53]/50 uppercase tracking-widest ml-1">Email Address</label>
                        <input
                          type="email" name="email" required value={formData.email} onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#AD1F23] focus:bg-white rounded-2xl outline-none transition-all font-medium text-[#042C53]"
                          placeholder="sarah@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-extrabold text-[#042C53]/50 uppercase tracking-widest ml-1">Password</label>
                        <input
                          type="password" name="password" required value={formData.password} onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#AD1F23] focus:bg-white rounded-2xl outline-none transition-all font-medium text-[#042C53]"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-extrabold text-[#042C53]/50 uppercase tracking-widest ml-1">Mobile Phone</label>
                        <input
                          type="tel" name="phone" required value={formData.phone} onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#AD1F23] focus:bg-white rounded-2xl outline-none transition-all font-medium text-[#042C53]"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-extrabold text-[#042C53]/50 uppercase tracking-widest ml-1">City</label>
                        <input
                          type="text" name="city" required value={formData.city} onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#AD1F23] focus:bg-white rounded-2xl outline-none transition-all font-medium text-[#042C53]"
                          placeholder="Chicago"
                        />
                      </div>
                      <div className="space-y-4">
                        <SearchableSelect
                          label="State"
                          name="state"
                          options={usStates}
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="Select State"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-extrabold text-[#042C53]/50 uppercase tracking-widest ml-1">Country</label>
                        <input
                          type="text" name="country" value={formData.country} disabled
                          className="w-full px-6 py-4 bg-gray-100 border-2 border-transparent rounded-2xl outline-none font-medium text-gray-400 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : step === 2 ? (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8 py-10"
                  >
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-[#AD1F23]/10 rounded-full flex items-center justify-center mx-auto text-[#AD1F23]">
                        <Mail size={40} />
                      </div>
                      <h3 className="text-2xl font-bold text-[#042C53]">Check your email</h3>
                      <p className="text-gray-500 max-w-2xl mx-auto">
                        We've sent a 6-digit verification code to <span className="font-bold text-[#042C53]">{formData.email}</span>
                      </p>
                      <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50 max-w-2xl mx-auto">
                        <p className="text-sm text-[#042C53] font-medium italic">
                          "Please check you Junk box too and make our address as Non Junk in your inbox"
                        </p>
                      </div>
                    </div>

                    <div className="max-w-2xl mx-auto">
                      <input
                        type="text"
                        maxLength="6"
                        value={userOtp}
                        onChange={(e) => setUserOtp(e.target.value)}
                        className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:border-[#AD1F23] focus:bg-white rounded-2xl outline-none transition-all font-bold text-3xl text-center tracking-[0.5em] text-[#042C53]"
                        placeholder="000000"
                      />
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-400">
                        Didn't receive the code?{' '}
                        <button type="button" onClick={handleSendOtp} className="text-[#AD1F23] font-bold hover:underline">Resend</button>
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid md:grid-cols-2 gap-6 items-start">
                      <div className="space-y-4">
                        <SearchableSelect
                          label="Profession"
                          name="profession"
                          options={professions}
                          value={formData.profession}
                          onChange={handleInputChange}
                          placeholder="Select Profession"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-extrabold text-[#042C53]/50 uppercase tracking-widest ml-1">Specialty / Field (Optional)</label>
                        <input
                          type="text" name="specialty" value={formData.specialty} onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#AD1F23] focus:bg-white rounded-2xl outline-none transition-all font-medium text-[#042C53]"
                          placeholder="Cardiology"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-extrabold text-[#042C53]/50 uppercase tracking-widest ml-1">Employer / Institution</label>
                        <input
                          type="text" name="employer" required value={formData.employer} onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#AD1F23] focus:bg-white rounded-2xl outline-none transition-all font-medium text-[#042C53]"
                          placeholder="Northwestern Memorial Hospital"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-extrabold text-[#042C53]/50 uppercase tracking-widest ml-1">Current Position / Role</label>
                        <input
                          type="text" name="job_role" required value={formData.job_role} onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#AD1F23] focus:bg-white rounded-2xl outline-none transition-all font-medium text-[#042C53]"
                          placeholder="Senior Attending Physician"
                        />
                      </div>
                    </div>

                    {/* Dynamic Fields Based on Package */}
                    <AnimatePresence mode="popLayout">
                      {(isLicensed || isTrainee) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-100"
                        >
                          {isLicensed && (
                            <>
                              <div className="space-y-2">
                                <label className="text-[11px] font-extrabold text-[#042C53]/50 uppercase tracking-widest ml-1">License No.</label>
                                <input
                                  type="text" name="licenseNumber" required value={formData.licenseNumber} onChange={handleInputChange}
                                  className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent focus:border-[#AD1F23] focus:bg-white rounded-2xl outline-none transition-all font-medium text-[#042C53]"
                                  placeholder="0123456789"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[11px] font-extrabold text-[#042C53]/50 uppercase tracking-widest ml-1">Licensing State/Country</label>
                                <input
                                  type="text" name="licensingState" required value={formData.licensingState} onChange={handleInputChange}
                                  className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent focus:border-[#AD1F23] focus:bg-white rounded-2xl outline-none transition-all font-medium text-[#042C53]"
                                  placeholder="Illinois, USA"
                                />
                              </div>
                            </>
                          )}

                          {isTrainee && (
                            <div className="space-y-2 col-span-2 md:col-span-1">
                              <label className="text-[11px] font-extrabold text-[#042C53]/50 uppercase tracking-widest ml-1">Training Institution</label>
                              <input
                                type="text" name="trainingInstitution" required value={formData.trainingInstitution} onChange={handleInputChange}
                                className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent focus:border-[#AD1F23] focus:bg-white rounded-2xl outline-none transition-all font-medium text-[#042C53]"
                                placeholder="University Name"
                              />
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="pt-4">
                      <label className="flex items-start gap-4 cursor-pointer group">
                        <div className="relative flex items-center pt-1">
                          <input
                            type="checkbox" name="attestation" required checked={formData.attestation} onChange={handleInputChange}
                            className="w-6 h-6 rounded-lg border-2 border-gray-200 text-[#AD1F23] focus:ring-[#AD1F23] transition-all cursor-pointer"
                          />
                        </div>
                        <span className="text-gray-600 text-sm font-medium leading-relaxed group-hover:text-[#042C53] transition-colors">
                          I attest that the information provided is accurate and I agree to abide by the principles of AMMA.
                        </span>
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-auto pt-10 flex gap-4">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      setStep(step - 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex-1 py-5 border-2 border-gray-100 text-[#042C53] rounded-3xl font-bold hover:bg-gray-50 transition-all"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="flex-[2] py-5 bg-[#042C53] text-white rounded-3xl font-bold flex items-center justify-center gap-3 hover:bg-[#031d38] transition-all shadow-xl shadow-blue-900/10 active:scale-[0.98] disabled:opacity-50"
                >
                  {isVerifying ? (
                    "Sending..."
                  ) : (
                    <>
                      {step === 1 ? "Verify Email" : step === 2 ? "Continue" : "Complete Registration"}
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-gray-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="font-extrabold text-[#AD1F23] hover:underline">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default RegistrationPage;
