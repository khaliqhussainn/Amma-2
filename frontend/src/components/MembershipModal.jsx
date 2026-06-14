import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Upload, Check, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MembershipModal = ({ isOpen, onClose, initialTier }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    firstName: '', middleName: '', lastName: '',
    dob: '', gender: '', nationality: '', title: '',
    email: '', phone: '', altPhone: '',
    street: '', city: '', state: '', zip: '', country: 'USA',
    professionType: '', specialty: '', jobTitle: '', employer: '',
    workSetting: '', experience: '', licenseNumber: '', licensingState: '',
    boardCertified: 'No', boardDetails: '',
    highestDegree: '', school: '', gradYear: '',
    residency: '', certifications: '',
    memberType: '', membershipTier: 'Member',
    interests: [],
    volunteer: 'No', contributions: [], languages: '',
    preferredContact: 'Email', newsletter: true, whatsappConsent: false,
    codeOfConduct: false, privacyConsent: false, liabilityDisclaimer: false,
    signature: '', date: new Date().toISOString().split('T')[0],
    whyJoining: '', howHeard: '', referral: '', donationInterest: 'No'
  });

  useEffect(() => {
    if (initialTier && typeof initialTier === 'string') {
      let tierValue = 'Member';
      let memberType = 'Physician Member';

      if (initialTier.includes('Trainee')) {
        tierValue = 'Trainee';
        memberType = 'Student Member';
      } else if (initialTier.includes('Life Member')) {
        tierValue = 'Life Member';
        memberType = 'Physician Member';
      } else if (initialTier.includes('Member')) {
        tierValue = 'Member';
        memberType = 'Physician Member';
      }

      setFormData(prev => ({
        ...prev,
        membershipTier: tierValue,
        memberType: memberType
      }));
    }
  }, [initialTier, isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleInterestChange = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) 
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleContributionChange = (contribution) => {
    setFormData(prev => ({
      ...prev,
      contributions: prev.contributions.includes(contribution)
        ? prev.contributions.filter(c => c !== contribution)
        : [...prev.contributions, contribution]
    }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    alert('Thank you for your application! Our team will review your documents and get back to you soon.');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#042C53] text-white">
            <div>
              <h2 className="text-2xl font-bold">Become a Member</h2>
              <p className="text-blue-100 text-sm opacity-80">Join the American Muslims Medical Association</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="bg-blue-50 h-1.5 flex">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div 
                key={i} 
                className={`flex-1 transition-all duration-500 ${i + 1 <= step ? 'bg-[#AD1F23]' : 'bg-transparent'}`}
              />
            ))}
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-8">
            <form onSubmit={handleSubmit} id="membership-form">
              {step === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <SectionTitle title="1. Personal Information" icon={<Info size={20} />} />
                  <div className="grid md:grid-cols-3 gap-6">
                    <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                    <InputField label="Middle Name" name="middleName" value={formData.middleName} onChange={handleInputChange} />
                    <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <InputField label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleInputChange} required />
                    <SelectField 
                      label="Gender" name="gender" value={formData.gender} onChange={handleInputChange}
                      options={['Male', 'Female', 'Prefer not to say']} 
                    />
                    <InputField label="Preferred Title" name="title" placeholder="e.g. Dr., RN" value={formData.title} onChange={handleInputChange} required />
                  </div>
                  
                  <SectionTitle title="2. Contact Information" icon={<Info size={20} />} />
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                    <InputField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField label="Street Address" name="street" value={formData.street} onChange={handleInputChange} required />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="City" name="city" value={formData.city} onChange={handleInputChange} required />
                      <InputField label="State" name="state" value={formData.state} onChange={handleInputChange} required />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <SectionTitle title="3. Professional Information" icon={<Info size={20} />} />
                  <div className="grid md:grid-cols-2 gap-6">
                    <SelectField 
                      label="Profession Type" name="professionType" value={formData.professionType} onChange={handleInputChange} required
                      options={['Physician', 'Nurse', 'Pharmacist', 'Allied Health', 'Student', 'Other']} 
                    />
                    <InputField label="Specialty" name="specialty" value={formData.specialty} onChange={handleInputChange} required />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField label="Current Employer" name="employer" value={formData.employer} onChange={handleInputChange} required />
                    <SelectField 
                      label="Work Setting" name="workSetting" value={formData.workSetting} onChange={handleInputChange} required
                      options={['Hospital', 'Clinic', 'Private Practice', 'Academic', 'Industry', 'Other']} 
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <InputField label="License Number" name="licenseNumber" value={formData.licenseNumber} onChange={handleInputChange} />
                    <InputField label="Licensing State" name="licensingState" value={formData.licensingState} onChange={handleInputChange} />
                    <InputField label="Years of Experience" name="experience" type="number" value={formData.experience} onChange={handleInputChange} />
                  </div>

                  <SectionTitle title="4. Education & Training" icon={<Info size={20} />} />
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField label="Highest Degree" name="highestDegree" value={formData.highestDegree} onChange={handleInputChange} required />
                    <InputField label="School/Institution" name="school" value={formData.school} onChange={handleInputChange} required />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField label="Graduation Year" name="gradYear" type="number" value={formData.gradYear} onChange={handleInputChange} required />
                    <InputField label="Additional Certifications" name="certifications" placeholder="e.g. ACLS, BLS" value={formData.certifications} onChange={handleInputChange} />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <SectionTitle title="5. Membership Category" icon={<Info size={20} />} />
                  <div className="grid md:grid-cols-2 gap-6">
                    <SelectField 
                      label="Member Type" name="memberType" value={formData.memberType} onChange={handleInputChange} required
                      options={['Physician Member', 'Nurse Member', 'Pharmacist Member', 'Student Member', 'Resident/Fellow', 'Affiliate']} 
                    />
                    <SelectField 
                      label="Membership Tier" name="membershipTier" value={formData.membershipTier} onChange={handleInputChange} required
                      options={['Trainee', 'Member', 'Life Member']} 
                    />
                  </div>

                  <SectionTitle title="6. Areas of Interest" icon={<Info size={20} />} />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      'Clinical Practice', 'Medical Education', 'Research', 
                      'Public Health', 'Health Policy', 'Community Outreach', 
                      'Islamic Ethics', 'Leadership'
                    ].map(interest => (
                      <label key={interest} className={`flex items-center p-3 rounded-xl border-2 transition-all cursor-pointer ${
                        formData.interests.includes(interest) 
                          ? 'border-[#042C53] bg-blue-50 text-[#042C53]' 
                          : 'border-gray-100 hover:border-blue-200'
                      }`}>
                        <input 
                          type="checkbox" className="hidden" 
                          checked={formData.interests.includes(interest)}
                          onChange={() => handleInterestChange(interest)}
                        />
                        <span className="text-sm font-semibold">{interest}</span>
                        {formData.interests.includes(interest) && <Check size={16} className="ml-auto" />}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <SectionTitle title="7. Skills & Contributions" icon={<Info size={20} />} />
                  <div className="grid md:grid-cols-2 gap-6">
                    <SelectField 
                      label="Willing to Volunteer?" name="volunteer" value={formData.volunteer} onChange={handleInputChange}
                      options={['Yes', 'No']} 
                    />
                    <InputField label="Languages Spoken" name="languages" value={formData.languages} onChange={handleInputChange} />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {['Teaching', 'Mentorship', 'Committee Work', 'Events', 'Research Collab'].map(c => (
                      <label key={c} className={`flex items-center p-3 rounded-xl border-2 transition-all cursor-pointer ${
                        formData.contributions.includes(c) 
                          ? 'border-[#042C53] bg-blue-50 text-[#042C53]' 
                          : 'border-gray-100 hover:border-blue-200'
                      }`}>
                        <input 
                          type="checkbox" className="hidden" 
                          checked={formData.contributions.includes(c)}
                          onChange={() => handleContributionChange(c)}
                        />
                        <span className="text-sm font-semibold">{c}</span>
                      </label>
                    ))}
                  </div>

                  <SectionTitle title="8. Communication" icon={<Info size={20} />} />
                  <div className="grid md:grid-cols-3 gap-6">
                    <SelectField 
                      label="Preferred Contact" name="preferredContact" value={formData.preferredContact} onChange={handleInputChange}
                      options={['Email', 'Phone', 'SMS']} 
                    />
                    <CheckboxField label="Newsletter Subscription" name="newsletter" checked={formData.newsletter} onChange={handleInputChange} />
                    <CheckboxField label="WhatsApp Consent" name="whatsappConsent" checked={formData.whatsappConsent} onChange={handleInputChange} />
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <SectionTitle title="9. Document Upload" icon={<Upload size={20} />} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <UploadBox label="CV / Resume" />
                    <UploadBox label="Professional License" />
                  </div>

                  <SectionTitle title="10. Agreement" icon={<Check size={20} />} />
                  <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <CheckboxField label="I agree to the Code of Conduct" name="codeOfConduct" checked={formData.codeOfConduct} onChange={handleInputChange} required />
                    <CheckboxField label="I consent to Data Privacy policy" name="privacyConsent" checked={formData.privacyConsent} onChange={handleInputChange} required />
                    <CheckboxField label="I accept the Liability Disclaimer" name="liabilityDisclaimer" checked={formData.liabilityDisclaimer} onChange={handleInputChange} required />
                    
                    <div className="pt-4 grid md:grid-cols-2 gap-6">
                      <InputField label="Digital Signature" name="signature" value={formData.signature} onChange={handleInputChange} required />
                      <InputField label="Date" name="date" type="date" value={formData.date} disabled />
                    </div>
                  </div>

                  <SectionTitle title="11. Optional" icon={<Info size={20} />} />
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField label="How did you hear about us?" name="howHeard" value={formData.howHeard} onChange={handleInputChange} />
                    <SelectField 
                      label="Donation Interest?" name="donationInterest" value={formData.donationInterest} onChange={handleInputChange}
                      options={['Yes', 'No']} 
                    />
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <button 
              onClick={prevStep}
              disabled={step === 1}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                step === 1 ? 'opacity-0' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <ChevronLeft size={20} />
              Back
            </button>

            {step < totalSteps ? (
              <button 
                onClick={nextStep}
                className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-[#042C53] text-white font-bold shadow-lg shadow-blue-900/10 hover:opacity-90"
              >
                Next Step
                <ChevronRight size={20} />
              </button>
            ) : (
              <button 
                form="membership-form"
                type="submit"
                className="flex items-center gap-2 px-10 py-2.5 rounded-xl bg-[#AD1F23] text-white font-bold shadow-lg shadow-red-900/10 hover:opacity-90"
              >
                Submit Application
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Sub-components for cleaner code
const SectionTitle = ({ title, icon }) => (
  <div className="flex items-center gap-2 pb-2 border-b border-gray-100 mb-6">
    <div className="text-[#AD1F23]">{icon}</div>
    <h3 className="text-lg font-bold text-[#042C53] uppercase tracking-wide">{title}</h3>
  </div>
);

const InputField = ({ label, name, type = "text", ...props }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-bold text-gray-700">{label}</label>
    <input 
      type={type} 
      name={name}
      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#042C53] focus:ring-4 focus:ring-blue-50 transition-all outline-none text-gray-900 font-medium"
      {...props} 
    />
  </div>
);

const SelectField = ({ label, name, options, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-bold text-gray-700">{label}</label>
    <select 
      name={name}
      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#042C53] focus:ring-4 focus:ring-blue-50 transition-all outline-none text-gray-900 font-medium bg-white"
      {...props}
    >
      <option value="">Select Option</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const CheckboxField = ({ label, name, checked, ...props }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
      checked ? 'bg-[#042C53] border-[#042C53]' : 'border-gray-300 group-hover:border-blue-500'
    }`}>
      {checked && <Check size={14} className="text-white" strokeWidth={3} />}
    </div>
    <input type="checkbox" name={name} checked={checked} className="hidden" {...props} />
    <span className="text-sm font-semibold text-gray-700">{label}</span>
  </label>
);

const UploadBox = ({ label }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-bold text-gray-700">{label}</label>
    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 hover:border-blue-300 transition-colors bg-gray-50/50 cursor-pointer group">
      <Upload className="text-gray-400 group-hover:text-[#042C53] transition-colors" />
      <span className="text-xs font-bold text-gray-500 group-hover:text-blue-700">Click to upload or drag & drop</span>
    </div>
  </div>
);

export default MembershipModal;
