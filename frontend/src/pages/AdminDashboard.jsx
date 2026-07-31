import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/NewLanding/Navbar';
import Footer from '../components/NewLanding/Footer';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { 
  Users, 
  Mail, 
  Clock, 
  CheckCircle2, 
  Search, 
  Filter, 
  Download,
  LayoutDashboard,
  MessageSquare,
  BellRing,
  ArrowUpRight,
  Plus,
  Edit2,
  Trash2,
  X,
  Eye,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('members');
  const [data, setData] = useState({
    members: [],
    contactInquiries: [],
    newsletterSubscribers: [],
    comingSoonInquiries: [],
    subscriptionPlans: []
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planFormData, setPlanFormData] = useState({
    name: '',
    description: '',
    price: 0,
    duration_months: 12,
    status: 'ACTIVE'
  });

  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);

  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/dashboard');
      setData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch admin data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = async (e) => {
    e.preventDefault();
    try {
      if (editingPlan) {
        await api.patch(`/subscription-plans/${editingPlan.id}`, planFormData);
        toast.success('Plan updated successfully');
      } else {
        await api.post('/subscription-plans', planFormData);
        toast.success('Plan created successfully');
      }
      setShowPlanModal(false);
      setEditingPlan(null);
      setPlanFormData({ name: '', description: '', price: 0, duration_months: 12, status: 'ACTIVE' });
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save plan');
    }
  };

  const openEditPlan = (plan) => {
    setEditingPlan(plan);
    setPlanFormData({
      name: plan.name,
      description: plan.description || '',
      price: plan.price,
      duration_months: plan.duration_months,
      status: plan.status
    });
    setShowPlanModal(true);
  };

  const handleUpdateStatus = async (userId, newStatus) => {
    try {
      await api.patch(`/admin/members/${userId}/status`, { status: newStatus });
      toast.success(`User status updated to ${newStatus}`);
      fetchDashboardData();
    } catch (error) {
      console.error('Update status failed', error);
      toast.error('Failed to update status');
    }
  };

  const handleUpdateInquiryStatus = async (id, status, type) => {
    try {
      await api.patch(`/admin/inquiries/${id}/status`, { status, type });
      toast.success(`Status updated to ${status}`);
      fetchDashboardData();
    } catch (error) {
      console.error('Update inquiry status failed', error);
      toast.error('Failed to update status');
    }
  };

  const handleExport = async (type = 'members') => {
    try {
      const response = await api.get(`/admin/export?type=${type}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      let filename = 'AMMA_Members';
      if (type === 'contactInquiries') filename = 'Contact_Inquiries';
      if (type === 'newsletterSubscribers') filename = 'Newsletter_Subscribers';
      if (type === 'comingSoonInquiries') filename = 'Coming_Soon_Inquiries';
      if (type === 'subscriptionPlans') filename = 'Subscription_Plans';

      link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Data exported successfully');
    } catch (error) {
      console.error('Export failed', error);
      toast.error('Failed to export data');
    }
  };

  const handleBackup = async () => {
    try {
      const response = await api.get('/admin/database/backup', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `AMMA_Backup_${new Date().toISOString().split('T')[0]}.sql`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Database backup downloaded');
    } catch (error) {
      console.error('Backup failed', error);
      toast.error('Failed to download backup');
    }
  };

  const handleDeleteMember = async (id) => {
    if (window.confirm('Are you sure you want to remove this member? This action uses soft delete and will hide the member from the list.')) {
      try {
        await api.delete(`/admin/members/${id}`);
        toast.success('Member removed successfully');
        fetchDashboardData();
      } catch (error) {
        console.error('Delete member failed', error);
        toast.error('Failed to remove member');
      }
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/login" />;
  }

  const filteredData = () => {
    const currentData = data[activeTab] || [];
    if (!searchTerm) return currentData;
    return currentData.filter(item => 
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const TableHeader = ({ columns }) => (
    <thead className="bg-gray-50">
      <tr>
        {columns.map((col, i) => (
          <th key={i} className="px-6 py-4 text-left text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );

  const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex items-center gap-6">
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-[#042C53]">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar onJoinClick={() => {}} />
      
      <main className="flex-1 w-full max-w-[1400px] mx-auto p-6 md:p-10 lg:p-12">
        <div className="flex flex-col gap-10">
          
          {/* Admin Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-[#AD1F23]/10 text-[#AD1F23] text-[10px] font-bold rounded-full uppercase tracking-wider">Control Center</span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-500 text-sm font-medium">Administrator Access</span>
              </div>
              <div className="flex items-center gap-4">
                {activeTab === 'subscriptionPlans' && (
                  <button 
                    onClick={() => {
                      setEditingPlan(null);
                      setPlanFormData({ name: '', description: '', price: 0, duration_months: 12, status: 'ACTIVE' });
                      setShowPlanModal(true);
                    }}
                    className="px-6 py-3 bg-[#AD1F23] text-white rounded-2xl font-bold hover:bg-[#8e191d] transition-all shadow-xl shadow-red-900/10 flex items-center gap-2"
                  >
                    <Plus size={18} />
                    New Plan
                  </button>
                )}
                
                <button 
                  onClick={() => handleExport(activeTab)}
                  className="px-6 py-3 bg-[#042C53] text-white rounded-2xl font-bold hover:bg-[#031d38] transition-all shadow-xl shadow-blue-900/10 flex items-center gap-2"
                >
                  <Download size={18} />
                  Export {activeTab === 'members' ? 'Members' : 'Excel'}
                </button>

                {activeTab === 'members' && (
                  <button 
                    onClick={handleBackup}
                    className="px-6 py-3 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition-all shadow-xl shadow-purple-900/10 flex items-center gap-2"
                  >
                    <Database size={18} />
                    DB Backup
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total Members" value={data.members.length} icon={Users} color="bg-blue-50 text-blue-600" />
            <StatCard label="Contact Inquiries" value={data.contactInquiries.length} icon={MessageSquare} color="bg-purple-50 text-purple-600" />
            <StatCard label="Newsletter" value={data.newsletterSubscribers.length} icon={BellRing} color="bg-green-50 text-green-600" />
            <StatCard label="Subscription Plans" value={data.subscriptionPlans.length} icon={LayoutDashboard} color="bg-orange-50 text-orange-600" />
          </div>

          {/* Table Controls */}
          <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 md:p-8 border-b border-gray-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6 overflow-hidden">
              <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl overflow-x-auto max-w-full scrollbar-hide">
                {[
                  { id: 'members', label: 'All Members', icon: Users },
                  // { id: 'requests', label: 'Requests', icon: Clock },
                  { id: 'contactInquiries', label: 'Inquiries', icon: MessageSquare },
                  { id: 'newsletterSubscribers', label: 'Newsletter', icon: BellRing },
                  { id: 'subscriptionPlans', label: 'Plans', icon: LayoutDashboard },
                  { id: 'comingSoonInquiries', label: 'Coming Soon', icon: ArrowUpRight }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 md:px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap shrink-0 ${
                      activeTab === tab.id 
                      ? 'bg-white text-[#AD1F23] shadow-sm' 
                      : 'text-gray-500 hover:text-[#042C53]'
                    }`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* <div className="relative flex-1 lg:max-w-md">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#AD1F23] focus:bg-white rounded-2xl outline-none transition-all font-medium text-[#042C53]"
                />
              </div> */}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                {activeTab === 'members' && (
                  <>
                    <TableHeader columns={['Name', 'Email', 'Category', 'Profession', 'Status', 'Actions']} />
                    <tbody>
                      {filteredData().map((member, i) => (
                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center font-bold text-[#042C53]">
                                {member.name[0]}
                              </div>
                              <span className="font-bold text-[#042C53]">{member.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-sm text-gray-600">{member.email}</td>
                          <td className="px-6 py-5">
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase">
                                {(member.plan_name || member.package || 'Standard').replace(/\(?\s*free\s*\)?/gi, '').trim() || 'Standard'}
                              </span>
                            </td>
                          <td className="px-6 py-5 text-sm font-medium text-gray-700">{member.profession}</td>
                          <td className="px-6 py-5">
                            <select 
                              value={member.status}
                              onChange={(e) => handleUpdateStatus(member.id, e.target.value)}
                              className={`text-[10px] font-bold rounded-full px-3 py-1 uppercase outline-none border-none cursor-pointer ${
                                member.status === 'APPROVED' ? 'bg-green-50 text-green-600' : 
                                member.status === 'BLOCKED' ? 'bg-red-50 text-red-600' :
                                member.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-600'
                              }`}
                            >
                              <option value="PENDING">Pending</option>
                              <option value="APPROVED">Approved</option>
                              <option value="BLOCKED">Blocked</option>
                            </select>
                          </td>
                          <td className="px-6 py-5 flex items-center gap-2">
                            <button 
                              onClick={() => {
                                setSelectedMember(member);
                                setShowMemberModal(true);
                              }}
                              className="p-2 text-[#AD1F23] hover:bg-red-50 rounded-lg transition-all"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteMember(member.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Remove Member"
                            >
                              <Trash2 size={16} />
                            </button>
                            <span className="text-gray-200">|</span>
                            <span className="text-[10px] text-gray-400 font-medium">
                              {new Date(member.created_at).toLocaleDateString()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {activeTab === 'requests' && (
                  <>
                    <TableHeader columns={['Name', 'Email', 'Category', 'Profession', 'Action']} />
                    <tbody>
                      {data.members.filter(m => m.status === 'PENDING').map((member, i) => (
                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-5 font-bold text-[#042C53]">{member.name}</td>
                          <td className="px-6 py-5 text-sm text-gray-600">{member.email}</td>
                          <td className="px-6 py-5 text-[10px] font-bold text-blue-600 uppercase">{member.package}</td>
                          <td className="px-6 py-5 text-sm text-gray-700">{member.profession}</td>
                          <td className="px-6 py-5 flex gap-2">
                            <button 
                              onClick={() => handleUpdateStatus(member.id, 'APPROVED')}
                              className="px-4 py-2 bg-green-500 text-white rounded-xl text-xs font-bold hover:bg-green-600 transition-all flex items-center gap-1"
                            >
                              <CheckCircle2 size={14} /> Approve
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(member.id, 'BLOCKED')}
                              className="px-4 py-2 bg-red-100 text-red-600 rounded-xl text-xs font-bold hover:bg-red-200 transition-all"
                            >
                              Block
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {activeTab === 'contactInquiries' && (
                  <>
                    <TableHeader columns={['Sender', 'Subject', 'Status', 'Date', 'Actions']} />
                    <tbody>
                      {filteredData().map((iq, i) => (
                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="px-6 py-5">
                            <div className="font-bold text-[#042C53]">{iq.name}</div>
                            <a 
                              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${iq.email}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-500 hover:underline"
                            >
                              {iq.email}
                            </a>
                          </td>
                          <td className="px-6 py-5 text-sm font-bold text-gray-700">{iq.subject}</td>
                          <td className="px-6 py-5">
                            <select 
                              value={iq.status || 'PENDING'}
                              onChange={(e) => handleUpdateInquiryStatus(iq.id, e.target.value, 'contactInquiries')}
                              className={`text-[10px] font-bold rounded-full px-3 py-1 uppercase outline-none border-none cursor-pointer ${
                                iq.status === 'REPLIED' ? 'bg-green-50 text-green-600' : 
                                iq.status === 'CLOSED' ? 'bg-gray-50 text-gray-600' : 'bg-amber-50 text-amber-600'
                              }`}
                            >
                              <option value="PENDING">Pending</option>
                              <option value="REPLIED">Replied</option>
                              <option value="CLOSED">Closed</option>
                            </select>
                          </td>
                          <td className="px-6 py-5 text-sm text-gray-400">
                            {new Date(iq.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-5">
                            <button 
                              onClick={() => {
                                setSelectedInquiry({...iq, type: 'contact'});
                                setShowInquiryModal(true);
                              }}
                              className="p-2 text-[#042C53] hover:bg-gray-100 rounded-lg transition-all"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {activeTab === 'newsletterSubscribers' && (
                  <>
                    <TableHeader columns={['Email', 'Status', 'Subscribed On']} />
                    <tbody>
                      {filteredData().map((sub, i) => (
                        <tr key={i} className="border-b border-gray-50">
                          <td className="px-6 py-5 font-bold text-[#042C53]">
                            <a 
                              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${sub.email}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:underline hover:text-[#AD1F23] transition-all"
                            >
                              {sub.email}
                            </a>
                          </td>
                          <td className="px-6 py-5">
                            <select 
                              value={sub.status || 'ACTIVE'}
                              onChange={(e) => handleUpdateInquiryStatus(sub.id, e.target.value, 'newsletterSubscribers')}
                              className={`text-[10px] font-bold rounded-full px-3 py-1 uppercase outline-none border-none cursor-pointer ${
                                sub.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                              }`}
                            >
                              <option value="ACTIVE">Active</option>
                              <option value="UNSUBSCRIBED">Unsubscribed</option>
                            </select>
                          </td>
                          <td className="px-6 py-5 text-sm text-gray-400">
                            {new Date(sub.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {activeTab === 'subscriptionPlans' && (
                  <>
                    <TableHeader columns={['Plan Name', 'Price', 'Duration', 'Status', 'Actions']} />
                    <tbody>
                      {filteredData().map((plan, i) => (
                        <tr key={i} className="border-b border-gray-50">
                          <td className="px-6 py-5 font-bold text-[#042C53]">{plan.name}</td>
                          <td className="px-6 py-5 text-sm font-bold text-green-600">${plan.price}</td>
                          <td className="px-6 py-5 text-sm text-gray-600">{plan.duration_months} Months</td>
                          <td className="px-6 py-5">
                            <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${
                              plan.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                            }`}>
                              {plan.status}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <button 
                              onClick={() => openEditPlan(plan)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Edit Plan"
                            >
                              <Edit2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {activeTab === 'comingSoonInquiries' && (
                  <>
                    <TableHeader columns={['Email', 'Interest', 'Status', 'Registered On', 'Actions']} />
                    <tbody>
                      {filteredData().map((cs, i) => (
                        <tr key={i} className="border-b border-gray-50">
                          <td className="px-6 py-5 font-bold text-[#042C53]">
                            <a 
                              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${cs.email}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:underline hover:text-[#AD1F23] transition-all"
                            >
                              {cs.email}
                            </a>
                          </td>
                          <td className="px-6 py-5 text-sm text-gray-600">{cs.interest_area || 'General'}</td>
                          <td className="px-6 py-5">
                            <select 
                              value={cs.status || 'PENDING'}
                              onChange={(e) => handleUpdateInquiryStatus(cs.id, e.target.value, 'comingSoonInquiries')}
                              className={`text-[10px] font-bold rounded-full px-3 py-1 uppercase outline-none border-none cursor-pointer ${
                                cs.status === 'REPLIED' ? 'bg-green-50 text-green-600' : 
                                cs.status === 'CLOSED' ? 'bg-gray-50 text-gray-600' : 'bg-amber-50 text-amber-600'
                              }`}
                            >
                              <option value="PENDING">Pending</option>
                              <option value="REPLIED">Replied</option>
                              <option value="CLOSED">Closed</option>
                            </select>
                          </td>
                          <td className="px-6 py-5 text-sm text-gray-400">
                            {new Date(cs.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-5">
                            <button 
                              onClick={() => {
                                setSelectedInquiry({...cs, type: 'comingSoon'});
                                setShowInquiryModal(true);
                              }}
                              className="p-2 text-[#042C53] hover:bg-gray-100 rounded-lg transition-all"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}
              </table>

              {filteredData().length === 0 && !loading && (
                <div className="py-20 text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-gray-300" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-[#042C53]">No records found</h3>
                  <p className="text-gray-400">Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Member Detail Modal */}
      <AnimatePresence>
        {showMemberModal && selectedMember && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowMemberModal(false)}
              className="absolute inset-0 bg-[#042C53]/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#042C53]/5 flex items-center justify-center text-2xl font-bold text-[#042C53]">
                    {selectedMember.name[0]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#042C53]">{selectedMember.name}</h2>
                    <p className="text-sm text-gray-500 font-medium">{selectedMember.email}</p>
                  </div>
                </div>
                <button onClick={() => setShowMemberModal(false)} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {[
                    { label: 'Basic Info', isHeader: true },
                    { label: 'Full Name', value: selectedMember.name },
                    { label: 'Email Address', value: selectedMember.email },
                    { label: 'Phone Number', value: selectedMember.phone },
                    { label: 'Location', value: `${selectedMember.cityState || ''}, ${selectedMember.country || ''}` },
                    
                    { label: 'Membership', isHeader: true },
                    { label: 'Category', value: selectedMember.plan_name || selectedMember.package },
                    { label: 'Role', value: selectedMember.role },
                    { label: 'Status', value: selectedMember.status },
                    { label: 'Joined On', value: new Date(selectedMember.created_at).toLocaleDateString() },
                    
                    { label: 'Professional Profile', isHeader: true },
                    { label: 'Title/Credentials', value: selectedMember.title },
                    { label: 'Profession', value: selectedMember.profession },
                    { label: 'Specialty', value: selectedMember.specialty },
                    { label: 'Current Role', value: selectedMember.job_role },
                    { label: 'Employer', value: selectedMember.employer },
                    
                    { label: 'Verification Info', isHeader: true },
                    ...(selectedMember.plan_name?.includes('Trainee') || selectedMember.package?.includes('Trainee')
                      ? [{ label: 'Training Institution', value: selectedMember.trainingInstitution }]
                      : [
                          { label: 'License Number', value: selectedMember.licenseNumber },
                          { label: 'Licensing State', value: selectedMember.licensingState }
                        ]
                    )
                  ].map((item, i) => (
                    item.isHeader ? (
                      <div key={i} className="col-span-full border-b border-gray-50 pb-2 mt-4 first:mt-0">
                        <h4 className="text-[10px] font-extrabold text-[#AD1F23] uppercase tracking-[0.2em]">{item.label}</h4>
                      </div>
                    ) : (
                      <div key={i} className="space-y-1">
                        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">{item.label}</p>
                        <p className="text-[#042C53] font-bold text-sm">{item.value || 'N/A'}</p>
                      </div>
                    )
                  ))}
                </div>
              </div>
              
              <div className="p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Current Status:</span>
                  <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${
                    selectedMember.status === 'APPROVED' ? 'bg-green-100 text-green-600' : 
                    selectedMember.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {selectedMember.status}
                  </span>
                </div>
                <div className="flex gap-4">
                  {selectedMember.status !== 'APPROVED' && (
                    <button 
                      onClick={() => {
                        handleUpdateStatus(selectedMember.id, 'APPROVED');
                        setShowMemberModal(false);
                      }}
                      className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-all shadow-lg shadow-green-900/10"
                    >
                      Approve Member
                    </button>
                  )}
                  {selectedMember.status !== 'BLOCKED' && (
                    <button 
                      onClick={() => {
                        handleUpdateStatus(selectedMember.id, 'BLOCKED');
                        setShowMemberModal(false);
                      }}
                      className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-all"
                    >
                      Block Access
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Plan Modal */}
      <AnimatePresence>
        {showPlanModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowPlanModal(false)}
              className="absolute inset-0 bg-[#042C53]/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] p-8 md:p-10 shadow-2xl"
            >
              <button onClick={() => setShowPlanModal(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100">
                <X size={24} className="text-gray-400" />
              </button>

              <h2 className="text-2xl font-bold text-[#042C53] mb-8">
                {editingPlan ? 'Edit Subscription Plan' : 'Create New Plan'}
              </h2>

              <form onSubmit={handleSavePlan} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest ml-1">Plan Name</label>
                  <input 
                    type="text" required
                    value={planFormData.name}
                    onChange={(e) => setPlanFormData({...planFormData, name: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#AD1F23] rounded-2xl outline-none transition-all font-medium text-[#042C53]"
                    placeholder="e.g. Premium Member"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea 
                    value={planFormData.description}
                    onChange={(e) => setPlanFormData({...planFormData, description: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#AD1F23] rounded-2xl outline-none transition-all font-medium text-[#042C53] h-24 resize-none"
                    placeholder="Describe the plan benefits..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest ml-1">Price ($)</label>
                    <input 
                      type="number" required min="0"
                      value={planFormData.price}
                      onChange={(e) => setPlanFormData({...planFormData, price: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#AD1F23] rounded-2xl outline-none transition-all font-medium text-[#042C53]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest ml-1">Duration (Months)</label>
                    <input 
                      type="number" required min="1"
                      value={planFormData.duration_months}
                      onChange={(e) => setPlanFormData({...planFormData, duration_months: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#AD1F23] rounded-2xl outline-none transition-all font-medium text-[#042C53]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest ml-1">Status</label>
                  <select 
                    value={planFormData.status}
                    onChange={(e) => setPlanFormData({...planFormData, status: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#AD1F23] rounded-2xl outline-none transition-all font-bold text-[#042C53]"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-[#042C53] text-white rounded-3xl font-bold hover:bg-[#031d38] transition-all shadow-xl shadow-blue-900/10"
                >
                  {editingPlan ? 'Update Plan' : 'Create Plan'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Inquiry Detail Modal */}
      <AnimatePresence>
        {showInquiryModal && selectedInquiry && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowInquiryModal(false)}
              className="absolute inset-0 bg-[#042C53]/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden p-8 md:p-10"
            >
              <button onClick={() => setShowInquiryModal(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100">
                <X size={24} className="text-gray-400" />
              </button>

              <div className="mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                  selectedInquiry.type === 'contact' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                }`}>
                  <MessageSquare size={28} />
                </div>
                <h2 className="text-2xl font-bold text-[#042C53] mb-2">
                  {selectedInquiry.type === 'contact' ? 'Contact Inquiry' : 'Coming Soon Interest'}
                </h2>
                <p className="text-gray-400 text-sm">
                  Received on {new Date(selectedInquiry.created_at).toLocaleDateString()} at {new Date(selectedInquiry.created_at).toLocaleTimeString()}
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-2">Sender Information</label>
                  <div className="bg-gray-50 rounded-2xl p-5">
                    {selectedInquiry.name && (
                      <p className="font-bold text-[#042C53] mb-1">{selectedInquiry.name}</p>
                    )}
                    <p className="text-sm text-gray-600">{selectedInquiry.email}</p>
                  </div>
                </div>

                {selectedInquiry.subject && (
                  <div>
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-2">Subject</label>
                    <p className="font-bold text-[#042C53] px-1">{selectedInquiry.subject}</p>
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-2">
                    {selectedInquiry.type === 'contact' ? 'Message' : 'Interest Area'}
                  </label>
                  <div className="bg-gray-50 rounded-2xl p-5">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedInquiry.type === 'contact' ? selectedInquiry.message : (selectedInquiry.interest_area || 'General interest in upcoming features.')}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <a 
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${selectedInquiry.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-4 bg-[#AD1F23] text-white rounded-2xl font-bold text-center hover:bg-[#8e191d] transition-all shadow-lg shadow-red-900/10 flex items-center justify-center gap-2"
                  >
                    <Mail size={18} />
                    Reply via Gmail
                  </a>
                  <button 
                    onClick={() => setShowInquiryModal(false)}
                    className="px-8 py-4 bg-gray-100 text-[#042C53] rounded-2xl font-bold hover:bg-gray-200 transition-all"
                  >
                    Close
                  </button>
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

// Re-using RefreshCw from previous context if not imported
const RefreshCw = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 18"/>
  </svg>
);

export default AdminDashboard;
