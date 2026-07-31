import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Calendar, MapPin, Clock, User, Video,
  CheckCircle, ChevronRight, Loader2, Users, Tag
} from 'lucide-react';
import toast from 'react-hot-toast';

const professions = [
  'Physician (MD/DO)',
  'Dentist (DDS/DMD)',
  'Resident / Fellow',
  'Medical Student',
  'Dental Student',
  'Nurse / NP / PA',
  'Other Healthcare Professional',
  'Non-Healthcare Professional',
];

const specialties = [
  'Internal Medicine',
  'Family Medicine',
  'Surgery',
  'Pediatrics',
  'Obstetrics & Gynecology',
  'Psychiatry',
  'Cardiology',
  'Neurology',
  'Emergency Medicine',
  'Radiology',
  'Anesthesiology',
  'Orthopedics',
  'Oncology',
  'Infectious Disease',
  'Other / Not Applicable',
];

const membershipOptions = [
  'Active AMMA Member',
  'AMMA Student Member',
  'Not a Member (Interested)',
  'Non-Member (Not Interested)',
];

const FORM_STEPS = ['Your Info', 'Professional', 'Confirm'];

const EventRegistrationModal = ({ event, onClose, onSuccess }) => {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmCode, setConfirmCode] = useState('');

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profession: '',
    specialty: '',
    institution: '',
    membership: '',
    dietary: '',
    questions: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});

  // Lock background scroll when open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 0) {
      if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!form.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email';
      if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    }
    if (step === 1) {
      if (!form.profession) newErrors.profession = 'Please select your profession';
      if (!form.membership) newErrors.membership = 'Please select your membership status';
    }
    if (step === 2) {
      if (!form.agreeToTerms) newErrors.agreeToTerms = 'You must agree to continue';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep(s => s + 1);
  };

  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1800));
    const code = `AMMA-${event.id}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setConfirmCode(code);
    setSubmitting(false);
    setSubmitted(true);
    onSuccess(event.id);
    toast.success(`Registered for ${event.title}!`);
  };

  const inputClass = (field) =>
    `w-full h-11 px-4 rounded-xl border font-sans text-sm text-[#042C53] placeholder-gray-400 focus:outline-none focus:ring-2 transition-all bg-white ${
      errors[field]
        ? 'border-red-400 focus:ring-red-200 bg-red-50'
        : 'border-[#E5E7EB] focus:ring-[#042C53]/20 focus:border-[#042C53]'
    }`;

  const selectClass = (field) =>
    `w-full h-11 px-4 rounded-xl border font-sans text-sm text-[#042C53] focus:outline-none focus:ring-2 transition-all bg-white appearance-none cursor-pointer ${
      errors[field]
        ? 'border-red-400 focus:ring-red-200 bg-red-50'
        : 'border-[#E5E7EB] focus:ring-[#042C53]/20 focus:border-[#042C53]'
    }`;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(4, 44, 83, 0.65)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      >
        {/* Modal */}
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          className="relative w-full max-w-2xl max-h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="bg-[#042C53] px-6 pt-6 pb-5 shrink-0">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold tracking-widest uppercase text-white/50 font-sans">
                  Event Registration
                </span>
                <h2 className="font-display font-bold text-lg text-white leading-snug line-clamp-2 pr-4">
                  {event.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="mt-0.5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Event Quick Info */}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-white/70 text-xs font-sans">
              <span className="flex items-center gap-1.5">
                <Calendar size={12} className="text-[#AD1F23]" />
                {event.dateText}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={12} />
                {event.timeText}
              </span>
              <span className="flex items-center gap-1.5">
                {event.isVirtual ? <Video size={12} /> : <MapPin size={12} />}
                {event.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={12} />
                {event.spotsLeft} spots left
              </span>
            </div>

            {/* Step Indicator, only when not submitted */}
            {!submitted && (
              <div className="flex items-center gap-2 mt-5">
                {FORM_STEPS.map((label, i) => (
                  <React.Fragment key={label}>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                        i < step ? 'bg-emerald-500 text-white' :
                        i === step ? 'bg-white text-[#042C53]' :
                        'bg-white/20 text-white/50'
                      }`}>
                        {i < step ? <CheckCircle size={12} /> : i + 1}
                      </div>
                      <span className={`text-[11px] font-sans font-semibold transition-all duration-300 ${
                        i === step ? 'text-white' : 'text-white/40'
                      }`}>
                        {label}
                      </span>
                    </div>
                    {i < FORM_STEPS.length - 1 && (
                      <div className={`flex-1 h-px transition-all duration-300 ${i < step ? 'bg-emerald-500' : 'bg-white/20'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {submitted ? (
                /* ─── Success State ─── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  className="flex flex-col items-center justify-center text-center py-16 px-8 space-y-6"
                >
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center">
                      <CheckCircle className="w-12 h-12 text-emerald-500" strokeWidth={1.5} />
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: 'spring', stiffness: 400, damping: 20 }}
                      className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center"
                    >
                      <CheckCircle className="w-5 h-5 text-white" />
                    </motion.div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-2xl text-[#042C53]">You're Registered!</h3>
                    <p className="text-gray-500 font-sans text-sm max-w-sm">
                      A confirmation email has been sent to <strong>{form.email}</strong>. We look forward to seeing you there!
                    </p>
                  </div>
                  <div className="bg-[#f8f9ff] rounded-2xl border border-[#E5E7EB] px-6 py-4 space-y-1 w-full max-w-sm">
                    <p className="text-xs text-gray-400 font-sans font-bold uppercase tracking-wider">Confirmation Code</p>
                    <p className="font-display font-bold text-[#042C53] text-lg tracking-widest">{confirmCode}</p>
                  </div>
                  <div className="text-left w-full max-w-sm bg-white rounded-2xl border border-[#E5E7EB] p-4 space-y-2">
                    <p className="text-xs font-bold font-sans text-gray-400 uppercase tracking-wide">Event Details</p>
                    <p className="font-display font-semibold text-[#042C53] text-sm">{event.title}</p>
                    <p className="text-xs text-gray-500 font-sans flex items-center gap-1.5">
                      <Calendar size={12} className="text-[#AD1F23]" /> {event.dateText} · {event.timeText}
                    </p>
                    <p className="text-xs text-gray-500 font-sans flex items-center gap-1.5">
                      <MapPin size={12} /> {event.location}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-full max-w-sm py-3 bg-[#042C53] hover:bg-[#0a3d72] rounded-xl text-white font-bold text-sm transition-all cursor-pointer"
                  >
                    Done
                  </button>
                </motion.div>
              ) : step === 0 ? (
                /* ─── Step 1: Personal Info ─── */
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                  className="p-6 space-y-5"
                >
                  <div>
                    <h3 className="font-display font-bold text-[#042C53] text-base mb-0.5">Personal Information</h3>
                    <p className="text-xs text-gray-400 font-sans">Fill in your contact details for registration.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold font-sans text-[#042C53]">First Name <span className="text-[#AD1F23]">*</span></label>
                      <input
                        type="text"
                        placeholder="e.g. Ahmad"
                        value={form.firstName}
                        onChange={e => updateField('firstName', e.target.value)}
                        className={inputClass('firstName')}
                      />
                      {errors.firstName && <p className="text-red-500 text-[11px] font-sans">{errors.firstName}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold font-sans text-[#042C53]">Last Name <span className="text-[#AD1F23]">*</span></label>
                      <input
                        type="text"
                        placeholder="e.g. Al-Rasheed"
                        value={form.lastName}
                        onChange={e => updateField('lastName', e.target.value)}
                        className={inputClass('lastName')}
                      />
                      {errors.lastName && <p className="text-red-500 text-[11px] font-sans">{errors.lastName}</p>}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold font-sans text-[#042C53]">Email Address <span className="text-[#AD1F23]">*</span></label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={e => updateField('email', e.target.value)}
                      className={inputClass('email')}
                    />
                    {errors.email && <p className="text-red-500 text-[11px] font-sans">{errors.email}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold font-sans text-[#042C53]">Phone Number <span className="text-[#AD1F23]">*</span></label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={form.phone}
                      onChange={e => updateField('phone', e.target.value)}
                      className={inputClass('phone')}
                    />
                    {errors.phone && <p className="text-red-500 text-[11px] font-sans">{errors.phone}</p>}
                  </div>
                </motion.div>
              ) : step === 1 ? (
                /* ─── Step 2: Professional Info ─── */
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                  className="p-6 space-y-5"
                >
                  <div>
                    <h3 className="font-display font-bold text-[#042C53] text-base mb-0.5">Professional Background</h3>
                    <p className="text-xs text-gray-400 font-sans">Help us tailor the event experience to your background.</p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold font-sans text-[#042C53]">Profession <span className="text-[#AD1F23]">*</span></label>
                    <div className="relative">
                      <select
                        value={form.profession}
                        onChange={e => updateField('profession', e.target.value)}
                        className={selectClass('profession')}
                      >
                        <option value="">Select your profession</option>
                        {professions.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" />
                    </div>
                    {errors.profession && <p className="text-red-500 text-[11px] font-sans">{errors.profession}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold font-sans text-[#042C53]">Specialty / Department</label>
                    <div className="relative">
                      <select
                        value={form.specialty}
                        onChange={e => updateField('specialty', e.target.value)}
                        className={selectClass('specialty')}
                      >
                        <option value="">Select specialty (optional)</option>
                        {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold font-sans text-[#042C53]">Hospital / University / Institution</label>
                    <input
                      type="text"
                      placeholder="e.g. Johns Hopkins Medical Center"
                      value={form.institution}
                      onChange={e => updateField('institution', e.target.value)}
                      className={inputClass('institution')}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold font-sans text-[#042C53]">AMMA Membership Status <span className="text-[#AD1F23]">*</span></label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {membershipOptions.map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => updateField('membership', opt)}
                          className={`text-left px-4 py-3 rounded-xl border text-xs font-sans font-semibold transition-all cursor-pointer ${
                            form.membership === opt
                              ? 'bg-[#042C53] border-[#042C53] text-white'
                              : 'bg-white border-[#E5E7EB] text-[#042C53] hover:border-[#042C53]/30 hover:bg-[#f8f9ff]'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {errors.membership && <p className="text-red-500 text-[11px] font-sans">{errors.membership}</p>}
                  </div>
                  {!event.isVirtual && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold font-sans text-[#042C53]">Dietary Requirements</label>
                      <input
                        type="text"
                        placeholder="e.g. Halal, Vegetarian, Vegan, Allergies..."
                        value={form.dietary}
                        onChange={e => updateField('dietary', e.target.value)}
                        className={inputClass('dietary')}
                      />
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold font-sans text-[#042C53]">Questions for Organizers</label>
                    <textarea
                      rows={3}
                      placeholder="Any questions, comments, or special requests for the organizing committee..."
                      value={form.questions}
                      onChange={e => updateField('questions', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-2 focus:ring-[#042C53]/20 focus:border-[#042C53] font-sans text-sm text-[#042C53] placeholder-gray-400 focus:outline-none transition-all bg-white resize-none"
                    />
                  </div>
                </motion.div>
              ) : (
                /* ─── Step 3: Confirm & Review ─── */
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                  className="p-6 space-y-5"
                >
                  <div>
                    <h3 className="font-display font-bold text-[#042C53] text-base mb-0.5">Review & Confirm</h3>
                    <p className="text-xs text-gray-400 font-sans">Please review your details before completing registration.</p>
                  </div>

                  {/* Summary Cards */}
                  <div className="bg-[#f8f9ff] rounded-2xl border border-[#E5E7EB] p-4 space-y-3">
                    <p className="text-[10px] font-bold font-sans text-gray-400 uppercase tracking-wide">Personal</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-[11px] text-gray-400 font-sans">Name</p>
                        <p className="font-sans font-semibold text-[#042C53] text-sm">{form.firstName} {form.lastName}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-gray-400 font-sans">Email</p>
                        <p className="font-sans font-semibold text-[#042C53] text-sm truncate">{form.email}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-gray-400 font-sans">Phone</p>
                        <p className="font-sans font-semibold text-[#042C53] text-sm">{form.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#f8f9ff] rounded-2xl border border-[#E5E7EB] p-4 space-y-3">
                    <p className="text-[10px] font-bold font-sans text-gray-400 uppercase tracking-wide">Professional</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-[11px] text-gray-400 font-sans">Profession</p>
                        <p className="font-sans font-semibold text-[#042C53] text-sm">{form.profession}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-gray-400 font-sans">Specialty</p>
                        <p className="font-sans font-semibold text-[#042C53] text-sm">{form.specialty || 'N/A'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[11px] text-gray-400 font-sans">Institution</p>
                        <p className="font-sans font-semibold text-[#042C53] text-sm">{form.institution || 'N/A'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[11px] text-gray-400 font-sans">Membership</p>
                        <p className="font-sans font-semibold text-[#042C53] text-sm">{form.membership}</p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Info */}
                  <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                    <Tag size={14} className="text-amber-600 shrink-0" />
                    <p className="text-xs font-sans font-semibold text-amber-800">{event.price}</p>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => updateField('agreeToTerms', !form.agreeToTerms)}
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer ${
                        form.agreeToTerms
                          ? 'bg-[#042C53] border-[#042C53]'
                          : errors.agreeToTerms
                          ? 'border-red-400'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {form.agreeToTerms && <CheckCircle size={12} className="text-white" />}
                    </button>
                    <label
                      onClick={() => updateField('agreeToTerms', !form.agreeToTerms)}
                      className="text-xs text-gray-500 font-sans leading-relaxed cursor-pointer select-none"
                    >
                      I confirm that the information provided is accurate and I agree to the AMMA event attendance policies, including the cancellation and refund terms.
                    </label>
                  </div>
                  {errors.agreeToTerms && <p className="text-red-500 text-[11px] font-sans -mt-3">{errors.agreeToTerms}</p>}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Modal Footer */}
          {!submitted && (
            <div className="px-6 py-4 border-t border-[#F2F2F7] bg-white flex items-center justify-between shrink-0">
              <button
                onClick={step === 0 ? onClose : handleBack}
                className="h-11 px-5 rounded-xl border border-[#E5E7EB] text-sm font-bold font-sans text-[#042C53] hover:bg-[#f8f9ff] transition-all cursor-pointer"
              >
                {step === 0 ? 'Cancel' : 'Back'}
              </button>

              {step < FORM_STEPS.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="h-11 px-7 rounded-xl bg-[#042C53] hover:bg-[#0a3d72] text-white font-bold text-sm font-sans transition-all flex items-center gap-2 cursor-pointer"
                >
                  Continue <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="h-11 px-7 rounded-xl bg-[#AD1F23] hover:bg-[#911a1d] text-white font-bold text-sm font-sans transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <><Loader2 size={16} className="animate-spin" /> Registering...</>
                  ) : (
                    <><CheckCircle size={16} /> Complete Registration</>
                  )}
                </button>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EventRegistrationModal;
