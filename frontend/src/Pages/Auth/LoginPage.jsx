import { useContext, useState, useEffect } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { AuthCtx } from '../../context/AuthContext';
import { Mail, Lock, LogIn, Check, X, EyeOff, Eye } from 'lucide-react';

// Wave animation component
const WaveAnimation = () => (
  <svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg" className="animate-pulse">
    <path d="M0,100 C150,200 350,0 500,100 L500,200 L0,200 Z" fill="rgba(255,255,255,0.3)">
      <animate attributeName="d" 
        values="M0,100 C150,200 350,0 500,100 L500,200 L0,200 Z;
                M0,110 C150,180 350,20 500,110 L500,200 L0,200 Z;
                M0,100 C150,200 350,0 500,100 L500,200 L0,200 Z" 
        dur="10s" repeatCount="indefinite" />
    </path>
    <path d="M0,125 C125,225 375,25 500,125 L500,200 L0,200 Z" fill="rgba(255,255,255,0.2)">
      <animate attributeName="d" 
        values="M0,125 C125,225 375,25 500,125 L500,200 L0,200 Z;
                M0,135 C125,205 375,45 500,135 L500,200 L0,200 Z;
                M0,125 C125,225 375,25 500,125 L500,200 L0,200 Z" 
        dur="13s" repeatCount="indefinite" />
    </path>
    <path d="M0,150 C150,250 350,50 500,150 L500,200 L0,200 Z" fill="rgba(255,255,255,0.1)">
      <animate attributeName="d" 
        values="M0,150 C150,250 350,50 500,150 L500,200 L0,200 Z;
                M0,160 C150,230 350,70 500,160 L500,200 L0,200 Z;
                M0,150 C150,250 350,50 500,150 L500,200 L0,200 Z" 
        dur="15s" repeatCount="indefinite" />
    </path>
  </svg>
);

// Floating particles animation
const ParticlesAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <div 
          key={i}
          className="absolute bg-white rounded-full opacity-20"
          style={{
            width: `${Math.random() * 8 + 4}px`,
            height: `${Math.random() * 8 + 4}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${Math.random() * 8 + 10}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`
          }}
        ></div>
      ))}
    </div>
  );
};

// Water flow animation for success state
const WaterFlowAnimation = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
    <div className="absolute -left-full top-0 w-full h-full bg-blue-600 animate-flow-right">
      <ParticlesAnimation />
      <div className="absolute inset-0 flex items-center justify-center text-white z-30">
        <div className="flex flex-col items-center gap-4 animate-bounce-in">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center animate-scale-in">
            <Check size={32} className="text-blue-600" />
          </div>
          <p className="text-xl font-medium animate-fade-in-up">Login successful!</p>
          <p className="animate-fade-in-up delay-150">Welcome back!</p>
          <p className="animate-fade-in-up delay-300">Redirecting you...</p>
        </div>
      </div>
    </div>
  </div>
);

export default function LoginPage() {

  const { login , loggedIn } = useContext(AuthCtx);
  const nav = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleshowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Mount animation
  useEffect(() => {
    setMounted(true);
  }, []);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); 
    setError('');
    
    try {
      const role = await login(form);
      setSuccess(true);
      // Delay navigation to allow animation to complete
      setTimeout(() => {
        nav(`/${role.toLowerCase()}`, { replace: true });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally { 
      if (!success) setBusy(false); 
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 transition-all duration-700 relative overflow-hidden">
      {/* Animated sidebar */}
      <div 
        className={`hidden lg:flex lg:w-1/2 bg-blue-600 text-white flex-col justify-center items-center p-12 order-1
                   ${mounted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000 relative overflow-hidden`}
      >
        <ParticlesAnimation />
        
        <div className={`max-w-md text-center transform transition-all duration-1000 ${mounted ? 'translate-y-0' : 'translate-y-10'} z-10`}>
          <h1 className="text-4xl font-bold mb-6">Welcome Back!</h1>
          <p className="text-lg mb-8">Log in to access your personalized dashboard and continue your journey with us.</p>
          
          {/* Illustration */}
          <div className="w-full max-w-sm mx-auto">
            <WaveAnimation />
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-blue-700 opacity-20 transform -skew-y-3"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-indigo-400 rounded-full filter blur-2xl opacity-20"></div>
      </div>
      
      {/* Form container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 order-2 relative">
        {/* Success water animation overlay */}
        {success && <WaterFlowAnimation />}
        
        <div className={`w-full max-w-md transform transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} relative z-10`}>
          <form 
            onSubmit={submit} 
            className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden transition-all duration-500"
          >
            {/* Background animated gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-80 pointer-events-none"></div>
            
            <div className="relative z-1">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Log In</h2>
                <div className="h-1 w-16 bg-blue-600 mx-auto rounded-full mb-3"></div>
                <p className="text-gray-500">Enter your credentials to access your account</p>
              </div>
              
              <div className="space-y-6">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail 
                      size={18} 
                      className={`transition-colors duration-300 ${focusedField === 'email' ? 'text-blue-500' : 'text-gray-400'}`} 
                    />
                  </div>
                  <input 
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg transition-all duration-300
                              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                              group-hover:border-blue-300
                              ${focusedField === 'email' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    name="email" 
                    type="email"
                    placeholder="Email" 
                    value={form.email} 
                    onChange={handle} 
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required 
                  />
                  <div 
                    className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-500 ease-out
                              ${focusedField === 'email' ? 'w-full' : 'w-0'}`}
                  ></div>
                </div>
                
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock 
                      size={18} 
                      className={`transition-colors duration-300 ${focusedField === 'password' ? 'text-blue-500' : 'text-gray-400'}`} 
                    />
                  </div>
                  <input 
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg transition-all duration-300
                              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                              group-hover:border-blue-300
                              ${focusedField === 'password' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    name="password" 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password" 
                    value={form.password} 
                    onChange={handle} 
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    required 
                  />
                  <div className='absolute right-0 top-1 cursor-pointer'>
                      {showPassword ? <Eye size={18} className="absolute right-3 top-3 text-gray-400" onClick={handleshowPassword} /> : <EyeOff size={18} className="absolute right-3 top-3 text-gray-400" onClick={handleshowPassword} />}
                  </div>
                  <div 
                    className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-500 ease-out
                              ${focusedField === 'password' ? 'w-full' : 'w-0'}`}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center group">
                    <input 
                      id="remember" 
                      type="checkbox" 
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-all duration-300" 
                    />
                    <label htmlFor="remember" className="ml-2 text-gray-600 group-hover:text-blue-600 transition-colors duration-300">Remember me</label>
                  </div>
                  <a href="#" className="text-blue-600 hover:text-blue-800 font-medium relative group">
                    Forgot password?
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                  </a>
                </div>
                
                {error && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm flex items-center animate-shake">
                    <X size={18} className="text-red-500 mr-2 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}
                
                <button 
                  disabled={busy || success}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg 
                            transition-all duration-300 transform hover:-translate-y-0.5 
                            flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {busy && !success ? (
                    <div className="flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <>
                      <LogIn size={18} />
                      <span>Sign In</span>
                    </>
                  )}
                </button>
              </div>
              
              <div className="mt-8 text-center relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative">
                  <span className="px-2 bg-white text-sm text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-3">
                {/* Social login buttons */}
                {[
                  { name: 'Google'},
                  { name: 'Github'},
                  { name: 'Facebook' }
                ].map((provider) => (
                  <button
                    key={provider.name}
                    type="button"
                    className={`py-2 px-4 bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-100 rounded-lg shadow-sm transition-all duration-300 transform hover:-translate-y-0.5`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <img src={`/${provider.name.toLowerCase()}.png`} alt={provider.name} className="w-5 h-5" />
                      <span className="text-sm font-medium">{provider.name}</span>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Don't have an account? {' '}
                  <Link 
                    to="/request-access" 
                    className="text-blue-600 font-medium relative inline-block group"
                  >
                    Contact Your Admin
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </p>
              </div>
            </div>
          </form>
          
          <div className="text-center mt-6 text-gray-500 text-sm">
            <p>© 2025 Your Company. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}