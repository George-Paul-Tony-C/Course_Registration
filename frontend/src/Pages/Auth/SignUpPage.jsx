import { useContext, useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthCtx } from '../../context/AuthContext';
import {
  User,
  Mail,
  Lock,
  UserPlus,
  ChevronDown,
  Check,
  X,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react';



const CircleAnimation = () => (
  <svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="80" fill="rgba(255,255,255,0.1)">
      <animate attributeName="r" values="80;85;80" dur="4s" repeatCount="indefinite" />
    </circle>
    <circle cx="400" cy="100" r="70" fill="rgba(255,255,255,0.1)">
      <animate attributeName="r" values="70;75;70" dur="7s" repeatCount="indefinite" />
    </circle>
    <circle cx="250" cy="150" r="90" fill="rgba(255,255,255,0.05)">
      <animate attributeName="r" values="90;95;90" dur="5s" repeatCount="indefinite" />
    </circle>
    <circle cx="150" cy="50" r="40" fill="rgba(255,255,255,0.2)">
      <animate attributeName="cx" values="150;155;150" dur="9s" repeatCount="indefinite" />
      <animate attributeName="cy" values="50;48;50" dur="6s" repeatCount="indefinite" />
    </circle>
    <circle cx="350" cy="50" r="30" fill="rgba(255,255,255,0.15)">
      <animate attributeName="cx" values="350;345;350" dur="8s" repeatCount="indefinite" />
    </circle>
  </svg>
);


const ParticlesAnimation = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 15 }, () => ({
        size: Math.random() * 8 + 4,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: Math.random() * 10 + 15,
        delay: Math.random() * 5,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white opacity-20"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            top: `${p.top}%`,
            animation: `float ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};



export default function SignUpPage() {
  const { signup } = useContext(AuthCtx);
  const navigate = useNavigate();

  
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT',
    agreeTerms: false,
  });

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [formStage, setFormStage] = useState(1); // 1 | 2
  const [formProgress, setFormProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [showPassword, setShowPassword] = useState(false);

  const handleshowPassword = () => {
    setShowPassword(!showPassword);
  };


  
  useEffect(() => setMounted(true), []);

  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setForm((prev) => ({ ...prev, [name]: newValue }));

    // Clear field‑specific error as user edits
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: undefined }));

    // Calculate password strength on the fly
    if (name === 'password') {
      let strength = 0;
      if (value.length > 6) strength += 1;
      if (value.length > 10) strength += 1;
      if (/[A-Z]/.test(value)) strength += 1;
      if (/[0-9]/.test(value)) strength += 1;
      if (/[^A-Za-z0-9]/.test(value)) strength += 1;
      setPasswordStrength(strength);
    }
  };

  
  useEffect(() => {
    const required = ['username', 'email', 'password', 'role', 'agreeTerms'];
    const filled = required.filter((f) => {
      if (f === 'agreeTerms') return form[f];
      return Boolean(form[f]);
    }).length;
    setFormProgress((filled / required.length) * 100);
  }, [form]);

  
  const validateStage1 = () => {
    const errors = {};
    if (!form.username.trim()) errors.username = 'User name is required';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStage2 = () => {
    const errors = {};

    if (!form.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Email is invalid';

    if (!form.password) errors.password = 'Password is required';
    else if (form.password.length < 6) errors.password = 'Password must be at least 6 characters';

    if (form.password !== form.confirmPassword) errors.confirmPassword = "Passwords don't match";

    if (!form.agreeTerms) errors.agreeTerms = 'You must agree to the terms';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  
  const nextStage = (e) => {
    e.preventDefault();
    if (validateStage1()) setFormStage(2);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validateStage2()) return;

    setBusy(true);
    setError('');
    try {
      const { confirmPassword, agreeTerms, ...payload } = form;
      const role = await signup(payload); // Await API → should return role string
      setSuccess(true);
      // Allow the success checkmark animation to play before redirection
      setTimeout(() => navigate(`/${role.toLowerCase()}`, { replace: true }), 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setBusy(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                                   RENDER                                */
  /* ------------------------------------------------------------------------ */
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 transition-all duration-700">
      
      <div className="order-1 flex w-full items-center justify-center p-8 lg:w-1/2">
        <div
          className={`w-full max-w-md transform transition-all duration-700 ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          
          <form
            onSubmit={formStage === 1 ? nextStage : submit}
            className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-xl transition-all duration-500"
          >
            {/* Faint background gradient */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 opacity-70" />

            {/* Progress bar */}
            <div className="absolute left-0 right-0 top-0 h-1 bg-gray-100">
              <div
                className="h-full bg-blue-600 transition-all duration-700 ease-out"
                style={{ width: `${formProgress}%` }}
              />
            </div>

            {/* Stage dots */}
            <div className="absolute right-4 top-4 flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${formStage === 1 ? 'bg-blue-600' : 'bg-blue-200'}`} />
              <div className={`h-2 w-2 rounded-full ${formStage === 2 ? 'bg-blue-600' : 'bg-blue-200'}`} />
            </div>

            {/* Success overlay */}
            {success && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-blue-600 text-white">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-16 w-16 animate-scale-in items-center justify-center rounded-full bg-white">
                    <Check size={32} className="text-blue-600" />
                  </div>
                  <p className="animate-fade-in-up text-xl font-medium">Account created successfully!</p>
                  <p className="animate-fade-in-up delay-150">Welcome aboard!</p>
                  <p className="animate-fade-in-up delay-300">Redirecting you...</p>
                </div>
              </div>
            )}

            
            <div className="relative z-[1]">
              {/* Header */}
              <div className="mb-8 text-center">
                <h2 className="mb-2 text-3xl font-bold text-gray-800">Create Account</h2>
                <div className="mx-auto mb-3 h-1 w-16 rounded-full bg-blue-600" />
                <p className="text-gray-500">
                  {formStage === 1 ? 'Tell us about yourself' : 'Set up your login details'}
                </p>
              </div>

              <div className="relative min-h-[22rem]">{/* Keeps height consistent while switching */}
                
                <div
                  className={`space-y-5 transition-all duration-500 ${
                    formStage === 1
                      ? 'pointer-events-auto opacity-100 translate-x-0'
                      : 'pointer-events-none absolute inset-0 -translate-x-full opacity-0'
                  }`}
                >
                  <div className="grid grid-cols-2 gap-4">
                    {/* First name */}
                    <div className="group relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <User
                          size={18}
                          className={`transition-colors duration-300 ${
                            focusedField === 'username' ? 'text-blue-500' : 'text-gray-400'
                          }`}
                        />
                      </div>
                      <input
                        className={`w-full rounded-lg border bg-gray-50 py-3 pl-10 pr-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 group-hover:border-blue-300 ${
                          focusedField === 'username'
                            ? 'border-blue-500 bg-blue-50'
                            : fieldErrors.username
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-200'
                        }`}
                        name="username"
                        placeholder="First name"
                        value={form.username}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('username')}
                        onBlur={() => setFocusedField(null)}
                      />
                      {fieldErrors.username && (
                        <p className="mt-1 text-xs text-red-500">{fieldErrors.username}</p>
                      )}
                      <div
                        className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-500 ease-out ${
                          focusedField === 'username' ? 'w-full' : 'w-0'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Role select */}
                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <User
                        size={18}
                        className={`transition-colors duration-300 ${
                          focusedField === 'role' ? 'text-blue-500' : 'text-gray-400'
                        }`}
                      />
                    </div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <ChevronDown
                        size={18}
                        className={`transition-colors duration-300 ${
                          focusedField === 'role' ? 'text-blue-500' : 'text-gray-400'
                        }`}
                      />
                    </div>
                    <select
                      name="role"
                      className={`appearance-none w-full rounded-lg border bg-gray-50 py-3 pl-10 pr-10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 group-hover:border-blue-300 ${
                        focusedField === 'role' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      value={form.role}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('role')}
                      onBlur={() => setFocusedField(null)}
                    >
                      <option value="STUDENT">Student</option>
                      <option value="FACULTY">Faculty</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                    <div
                      className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-500 ease-out ${
                        focusedField === 'role' ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>

                  
                  <button
                    type="submit"
                    className="flex mt-10 w-full items-center justify-center rounded-lg bg-blue-600 py-3 font-medium text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg"
                  >
                    <span>Next</span>
                    <ArrowRight size={18} className="ml-2" />
                  </button>

                  <div className="mt-7 text-center relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative">
                      <span className="px-2 bg-white text-sm text-gray-500">Or continue with</span>
                    </div>
                  </div>
                  <div className="mt-7 grid grid-cols-3 gap-3">
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


                </div>

                
                <div
                  className={`space-y-5 transition-all duration-500 ${
                    formStage === 2
                      ? 'pointer-events-auto opacity-100 translate-x-0'
                      : 'pointer-events-none absolute inset-0 translate-x-full opacity-0'
                  }`}
                >
                  {/* Email */}
                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail
                        size={18}
                        className={`transition-colors duration-300 ${
                          focusedField === 'email' ? 'text-blue-500' : 'text-gray-400'
                        }`}
                      />
                    </div>
                    <input
                      className={`w-full rounded-lg border bg-gray-50 py-3 pl-10 pr-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 group-hover:border-blue-300 ${
                        focusedField === 'email'
                          ? 'border-blue-500 bg-blue-50'
                          : fieldErrors.email
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-200'
                      }`}
                      name="email"
                      type="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                    />
                    {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
                    <div
                      className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-500 ease-out ${
                        focusedField === 'email' ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>

                  {/* Password */}
                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock
                        size={18}
                        className={`transition-colors duration-300 ${
                          focusedField === 'password' ? 'text-blue-500' : 'text-gray-400'
                        }`}
                      />
                    </div>
                    <input
                      className={`w-full rounded-lg border bg-gray-50 py-3 pl-10 pr-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 group-hover:border-blue-300 ${
                        focusedField === 'password'
                          ? 'border-blue-500 bg-blue-50'
                          : fieldErrors.password
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-200'
                      }`}
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={form.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                    />
                    <div className='absolute right-0 top-1 cursor-pointer'>
                      {showPassword ? <Eye size={18} className="absolute right-3 top-3 text-gray-400" onClick={handleshowPassword} /> : <EyeOff size={18} className="absolute right-3 top-3 text-gray-400" onClick={handleshowPassword} />}
                    </div>
                    {fieldErrors.password && (
                      <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
                    )}
                    <div
                      className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-500 ease-out ${
                        focusedField === 'password' ? 'w-full' : 'w-0'
                      }`}
                    />

                    {/* Password strength meter */}
                    {form.password && (
                      <div className="mt-2">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-xs text-gray-500">Password strength:</span>
                          <span className="text-xs font-medium">
                            {['Very weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'][
                              passwordStrength
                            ]}
                          </span>
                        </div>
                        <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
                          <div
                            className={`h-full transition-all duration-300 ${
                              [
                                'bg-red-500 w-1/6',
                                'bg-red-400 w-2/6',
                                'bg-yellow-500 w-3/6',
                                'bg-yellow-400 w-4/6',
                                'bg-green-500 w-5/6',
                                'bg-green-400 w-full',
                              ][passwordStrength]
                            }`}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm password */}
                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock
                        size={18}
                        className={`transition-colors duration-300 ${
                          focusedField === 'confirmPassword' ? 'text-blue-500' : 'text-gray-400'
                        }`}
                      />
                    </div>
                    <input
                      className={`w-full rounded-lg border bg-gray-50 py-3 pl-10 pr-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 group-hover:border-blue-300 ${
                        focusedField === 'confirmPassword'
                          ? 'border-blue-500 bg-blue-50'
                          : fieldErrors.confirmPassword
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-200'
                      }`}
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField(null)}
                    />
                    <div className='absolute right-0 top-1 cursor-pointer'>
                      {showPassword ? <Eye size={18} className="absolute right-3 top-3 text-gray-400" onClick={handleshowPassword} /> : <EyeOff size={18} className="absolute right-3 top-3 text-gray-400" onClick={handleshowPassword} />}
                    </div>
                    {fieldErrors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-500">{fieldErrors.confirmPassword}</p>
                    )}
                    <div
                      className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-500 ease-out ${
                        focusedField === 'confirmPassword' ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>

                  {/* Terms checkbox */}
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input
                        id="terms"
                        name="agreeTerms"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={form.agreeTerms}
                        onChange={handleChange}
                      />
                      <span>
                        I agree to the{' '}
                        <a href="#" className="font-medium text-blue-600 hover:underline">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="font-medium text-blue-600 hover:underline">
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                    {fieldErrors.agreeTerms && (
                      <p className="text-xs text-red-500">{fieldErrors.agreeTerms}</p>
                    )}
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormStage(1)}
                      className="flex flex-1 items-center justify-center rounded-lg bg-gray-100 py-3 font-medium text-gray-700 transition-all duration-300 hover:bg-gray-200"
                    >
                      <ArrowLeft size={18} className="mr-2" />
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={busy}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-medium text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg disabled:opacity-50"
                    >
                      {busy ? (
                        <>
                          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <UserPlus size={18} /> Create Account
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Generic form‑level error */}
              {error && (
                <div className="mt-4 flex animate-shake items-center rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  <X size={18} className="mr-2 flex-shrink-0 text-red-500" />
                  {error}
                </div>
              )}

              {/* Footer link */}
              <div className="mt-8 text-center text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="group relative inline-block font-medium text-blue-600 hover:underline">
                  Log in
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                </Link>
              </div>
            </div>
          </form>

          {/* Site footer */}
          <p className="mt-6 text-center text-sm text-gray-500">© 2025 Your Company. All rights reserved.</p>
        </div>
      </div>

      
      <div 
        className={`hidden lg:flex lg:w-1/2 bg-blue-600 text-white flex-col justify-center items-center p-12 order-1
        ${mounted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000 relative overflow-hidden`}
      >
        <ParticlesAnimation />
        <div
          className={`z-10 mx-auto max-w-md transform text-center transition-all duration-1000 ${
            mounted ? 'translate-y-0' : 'translate-y-10'
          }`}
        >
          <h1 className="mb-6 text-4xl font-bold">Join Our Community</h1>
          <p className="mb-8 text-lg">
            Create an account to unlock all features and become part of our growing community.
          </p>
          <div className="mx-auto w-full max-w-sm">
            <CircleAnimation />
          </div>
        </div>

        {/* Decorative blobs */}
        <div className="absolute bottom-0 right-0 h-24 w-full -skew-y-3 transform bg-blue-800 opacity-20" />
        <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-blue-600 opacity-20 blur-3xl" />
        <div className="absolute bottom-20 right-20 h-32 w-32 rounded-full bg-blue-500 opacity-20 blur-2xl" />
      </div>
    </div>
  );
}
