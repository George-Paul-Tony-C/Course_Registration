import { useContext, useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { AuthCtx } from '../../context/AuthContext';
import { API_PATHS } from '../../utils/api_paths';
import { 
  Loader2, 
  KeyRound, 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Clock, 
  X, 
  AlertCircle,
  Settings,
  LogOut,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';
import DashboardLayout from '../../components/Layouts/dashboardLayout';

/* utility functions */
const prettify = s => s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
const fmtDate = iso => new Date(iso).toLocaleString();

/* main component */
export default function AdminProfilePage() {
  const { user } = useContext(AuthCtx);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pwdDialog, setPwdDialog] = useState(false);
  const [pwd, setPwd] = useState({ old: '', pass: '', confirm: '' });
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [showPassword, setShowPassword] = useState({old: false, pass: false, confirm: false});

  /* fetch profile */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosInstance.get(API_PATHS.AUTH.ME);
        setInfo(data);
      } catch (e) {
        showToast('Failed to load profile', 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false }), 3000);
  };

  const handleChangePassword = async () => {
    if (pwd.pass !== pwd.confirm) return showToast('Passwords do not match', 'error');
    try {
      setBusy(true);
      await axiosInstance.put(API_PATHS.AUTH.PASSWORD, { oldPassword: pwd.old, newPassword: pwd.pass });
      showToast('Password updated successfully');
      setPwd({ old: '', pass: '', confirm: '' });
      setTimeout(() => setPwdDialog(false), 1500);
    } catch (err) {
      showToast(err.response?.data?.message || 'Password update failed', 'error');
    } finally {
      setBusy(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({...prev, [field]: !prev[field]}));
  };

  if (!user || user.role !== 'ADMIN') return <AccessDenied />;
  if (loading) return <LoadingScreen />;

  const profile = info.user;

  return (
    <DashboardLayout>
      {toast.show && <Toast {...toast} />}

      <div className="max-w-7xl mx-auto p-1">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Profile</h1>
          <p className="text-gray-500 mt-2">Manage your account information and security settings</p>
        </header>

        <div className="grid grid-cols-12 gap-8">
          {/* Left sidebar with user info */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-blue-600 py-6 px-6 text-center">
                <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-white p-2 mb-2">
                  <User size={64} className="text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-white mt-2">{profile.username}</h2>
                <div className="flex items-center justify-center gap-1 text-blue-100">
                  <Mail size={14} />
                  <span className="text-sm">{profile.email}</span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="py-2 px-4 bg-blue-50 rounded-lg inline-flex items-center w-full">
                  <Shield className="text-blue-600 mr-2" size={16} />
                  <span className="text-sm font-medium text-blue-700">{profile.role}</span>
                </div>
                
                <div className="mt-4 text-sm text-gray-500">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Account Created</span>
                    <span className="font-medium text-gray-700">{fmtDate(profile.created_at).split(',')[0]}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Last Login</span>
                    <span className="font-medium text-gray-700">{info.lastLogin ? fmtDate(info.lastLogin).split(',')[0] : '—'}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setPwdDialog(true)}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                >
                  <KeyRound size={16} />
                  Change Password
                </button>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="mt-6 space-y-4">
              <StatCard 
                title="Account Age" 
                value={`${Math.floor((new Date() - new Date(profile.created_at)) / (1000*60*60*24))} days`} 
                icon={<Calendar size={20} className="text-emerald-500" />} 
                color="emerald"
              />
              <StatCard 
                title="Access Level" 
                value={profile.role} 
                icon={<Shield size={20} className="text-purple-500" />} 
                color="purple"
              />
              <StatCard 
                title="Activity Log" 
                value={`${info.logs.length} entries`} 
                icon={<Clock size={20} className="text-amber-500" />} 
                color="amber"
                onClick={() => window.alert('Activity log feature coming soon!')}
              />
            </div>
          </div>
          
          {/* Main content area - profile details */}
          <div className="col-span-12 md:col-span-8 lg:col-span-9">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
                <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
                  <Settings size={16} />
                  Edit Profile
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {Object.entries(profile)
                  .filter(([k]) => !['id', 'role', 'is_deleted'].includes(k))
                  .map(([k, v]) => (
                    <ProfileField 
                      key={k} 
                      label={prettify(k)} 
                      value={k.endsWith('_at') ? fmtDate(v) : v.toString()} 
                    />
                  ))}
              </div>
            </div>
            
            {/* Security Section */}
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Security Settings</h2>
              
              <div className="space-y-4">
                <SecurityOption 
                  title="Two-Factor Authentication"
                  description="Add an extra layer of security to your account"
                  action="Enable"
                />
                <SecurityOption 
                  title="Login History"
                  description="View your recent login activities"
                  action="View"
                />
                <SecurityOption 
                  title="Session Management"
                  description="Manage your active sessions"
                  action="Manage"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {pwdDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => !busy && setPwdDialog(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Change Password</h2>
              <button 
                onClick={() => !busy && setPwdDialog(false)}
                className="text-blue-100 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {['old', 'pass', 'confirm'].map((field) => (
                <div key={field} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field === 'old' ? 'Current Password' : field === 'pass' ? 'New Password' : 'Confirm Password'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword[field] ? "text" : "password"}
                      value={pwd[field]}
                      onChange={(e) => setPwd({ ...pwd, [field]: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(field)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword[field] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => !busy && setPwdDialog(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                  disabled={busy}
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={busy}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/50 flex items-center"
                >
                  {busy ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

/* Supporting Components */
const LoadingScreen = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="text-center">
      <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
      <p className="text-gray-500">Loading profile data...</p>
    </div>
  </div>
);

const AccessDenied = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="text-center">
      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-100">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
      <p className="text-gray-500">You don't have permission to view this page.</p>
    </div>
  </div>
);

const Toast = ({ message, type }) => (
  <div 
    className={`fixed right-4 top-4 z-50 flex items-center gap-2 rounded-lg px-4 py-3 text-white shadow-lg ${
      type === 'error' ? 'bg-red-600' : 'bg-green-600'
    }`}
  >
    {type === 'error' ? <AlertCircle size={16} /> : <Check size={16} />}
    {message}
  </div>
);

const StatCard = ({ title, value, icon, color, onClick }) => {
  const colorClass = {
    blue: "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
    purple: "bg-purple-50 text-purple-700", 
    amber: "bg-amber-50 text-amber-700"
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-gray-100 p-4 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="text-lg font-semibold text-gray-800 mt-1">{value}</p>
        </div>
        <div className={`rounded-full p-2 ${colorClass[color] || colorClass.blue}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-base text-gray-800">{value}</p>
  </div>
);

const SecurityOption = ({ title, description, action }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100">
    <div>
      <h3 className="text-sm font-medium text-gray-800">{title}</h3>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
    <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
      {action}
      <ChevronRight size={16} />
    </button>
  </div>
);