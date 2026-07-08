import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE } from '../config'

// Reusable Sub-components matching mockup styling
function Logo() {
  return (
    <div className="flex flex-col items-center mb-6 select-none">
      <img src="/logo_text.svg" alt="TalentaKu Logo" className="h-9 w-auto mb-1.5 object-contain" />
      <span className="text-[9px] text-[#3525cd] font-bold uppercase tracking-[0.25em]">Panel Manajemen Admin</span>
    </div>
  )
}

interface AlertProps {
  message: string
  type: 'error' | 'success'
}
function Alert({ message, type }: AlertProps) {
  const isError = type === 'error';
  return (
    <div className={`w-full mb-6 p-4 rounded-2xl text-xs sm:text-sm flex gap-3 shadow-sm border-l-4 ${
      isError 
        ? 'bg-red-50 border-red-500 text-red-800 animate-shake' 
        : 'bg-emerald-50 border-emerald-500 text-emerald-800'
    } transition-all duration-300`}>
      <span className={`material-symbols-outlined text-lg shrink-0 ${
        isError ? 'text-red-600' : 'text-emerald-600'
      }`}>
        {isError ? 'error' : 'check_circle'}
      </span>
      <div className="flex-1">
        <h5 className="font-bold mb-0.5">{isError ? 'Gagal Masuk' : 'Masuk Berhasil'}</h5>
        <p className="opacity-90">{message}</p>
      </div>
    </div>
  )
}

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon: string
  error?: string | null
}
function InputField({ label, icon, error, ...props }: InputFieldProps) {
  return (
    <div className="space-y-1.5 w-full text-left font-sans">
      <label className="text-xs font-bold text-[#464555] uppercase tracking-wider pl-1" htmlFor={props.id}>
        {label}
      </label>
      <div className="relative flex items-center">
        <span className="absolute left-4 material-symbols-outlined text-[#777587] text-lg select-none">
          {icon}
        </span>
        <input
          {...props}
          className={`w-full pl-11 pr-4 py-3.5 clay-input text-sm text-[#191c1e] ${
            error ? 'border-red-500 focus:border-red-500' : ''
          }`}
        />
      </div>
      {error && (
        <p className="text-xs text-red-600 pl-1 animate-slide-in font-medium mt-0.5">{error}</p>
      )}
    </div>
  )
}

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string | null
}
function PasswordInput({ label, error, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <div className="space-y-1.5 w-full text-left font-sans">
      <label className="text-xs font-bold text-[#464555] uppercase tracking-wider pl-1" htmlFor={props.id}>
        {label}
      </label>
      <div className="relative flex items-center">
        <span className="absolute left-4 material-symbols-outlined text-[#777587] text-lg select-none">lock</span>
        <input
          {...props}
          type={showPassword ? 'text' : 'password'}
          className={`w-full pl-11 pr-12 py-3.5 clay-input text-sm text-[#191c1e] ${
            error ? 'border-red-500 focus:border-red-500' : ''
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 text-[#777587] hover:text-[#3525cd] transition-colors focus:outline-none flex items-center justify-center"
          aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
        >
          <span className="material-symbols-outlined text-lg">
            {showPassword ? 'visibility_off' : 'visibility'}
          </span>
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-600 pl-1 animate-slide-in font-medium mt-0.5">{error}</p>
      )}
    </div>
  )
}

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}
function Checkbox({ label, ...props }: CheckboxProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input
        {...props}
        type="checkbox"
        className="w-4 h-4 rounded border-[#c7c4d8] text-[#3525cd] focus:ring-[#3525cd]/30 cursor-pointer"
      />
      <span className="text-xs font-semibold text-[#464555]">{label}</span>
    </label>
  )
}

interface ButtonPrimaryProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  loadingText?: string
}
function ButtonPrimary({ children, loading, loadingText = 'Signing in...', ...props }: ButtonPrimaryProps) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className="w-full h-[50px] clay-btn-primary text-white font-bold flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [showForgotModal, setShowForgotModal] = useState(false)

  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem('admin_remember_me') === 'true'
  })

  useEffect(() => {
    document.title = 'Masuk Admin | TalentaKu'
    // If already logged in, redirect to admin dashboard
    const token = localStorage.getItem('admin_token')
    if (token) {
      navigate('/admin')
    }

    // Load saved email if remember me is set
    const savedEmail = localStorage.getItem('admin_saved_email')
    if (savedEmail) {
      setEmail(savedEmail)
    }
  }, [navigate])

  useEffect(() => {
    if (rememberMe) {
      localStorage.setItem('admin_remember_me', 'true')
    } else {
      localStorage.removeItem('admin_remember_me')
      localStorage.removeItem('admin_saved_email')
    }
  }, [rememberMe])

  const validate = () => {
    let isValid = true
    if (!email.trim()) {
      setEmailError('Username / Email wajib diisi.')
      isValid = false
    } else {
      setEmailError(null)
    }

    if (!password) {
      setPasswordError('Password wajib diisi.')
      isValid = false
    } else {
      setPasswordError(null)
    }

    return isValid
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (emailError) setEmailError(null)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (passwordError) setPasswordError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) {
      return
    }

    setLoading(true)
    setError(null)
    setSuccessMsg(null)

    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Username atau password salah.')
      }

      // Store JWT token and admin details
      localStorage.setItem('admin_token', data.token)
      localStorage.setItem('admin_user', JSON.stringify(data.admin))
      localStorage.removeItem('user_token')
      localStorage.removeItem('user_data')

      if (rememberMe) {
        localStorage.setItem('admin_saved_email', email)
      } else {
        localStorage.removeItem('admin_saved_email')
      }

      setSuccessMsg('Masuk berhasil! Mengalihkan ke Dashboard...')
      
      // Trigger fade out before navigating
      setTimeout(() => {
        setIsFadingOut(true)
        setTimeout(() => {
          navigate('/admin')
        }, 300)
      }, 500)

    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`relative min-h-screen flex items-center justify-center bg-[#f0f4f8] p-4 sm:p-8 font-sans transition-all duration-300 ${isFadingOut ? 'opacity-0 scale-98' : 'opacity-100'}`}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>

      {/* Decorative ambient glowing circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] md:w-[30vw] md:h-[30vw] rounded-full bg-gradient-to-tr from-[#3525cd]/15 to-[#4f46e5]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] md:w-[25vw] md:h-[25vw] rounded-full bg-gradient-to-br from-[#06b6d4]/10 to-[#3525cd]/15 blur-[100px] pointer-events-none" />

      {/* Centered Dual-Panel Card Container */}
      <div className="relative w-full max-w-3xl min-h-0 clay-card flex overflow-hidden z-10 animate-slide-up">
        
        {/* Left Section (Indigo Branding Panel) - Hidden on mobile, takes 42% on desktop */}
        <div className="hidden md:flex md:w-[42%] bg-[#3525cd] text-white flex-col justify-between p-8 lg:p-10 relative overflow-visible select-none z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          
          {/* Top Header */}
          <div className="z-10 text-left">
            <span className="text-[10px] text-white/60 font-bold uppercase tracking-[0.2em]">Sistem Pakar</span>
          </div>

          {/* Central Welcome Content */}
          <div className="flex flex-col items-center text-center z-10 my-auto">
            <span className="text-white/60 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-1">
              Welcome to
            </span>
            {/* Wavy Circle Rocket Badge matching the mockup */}
            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/25 flex items-center justify-center mb-5 shadow-lg shadow-[#1c127d]/20 animate-pulse">
              <span className="material-symbols-outlined text-4xl text-white">rocket_launch</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-wide mb-3 font-sans">TalentaKu</h2>
            <p className="text-white/75 text-xs leading-relaxed max-w-[240px]">
              Kelola basis pengetahuan sistem pakar, verifikasi aturan inferensi forward chaining, dan pantau hasil asesmen secara real-time.
            </p>
          </div>

          {/* Bottom Branding info */}
          <div className="z-10 text-left text-[10px] text-white/50 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-xs">verified_user</span>
            Panel Admin v2.0
          </div>

          {/* Wavy Cloud Border Transition (Overlaying the Right Panel) */}
          <div className="absolute right-0 top-0 bottom-0 w-[40px] pointer-events-none select-none translate-x-[99%] z-20">
            <svg
              className="h-full w-full"
              viewBox="0 0 100 1000"
              preserveAspectRatio="none"
            >
              {/* Layer 1: Lightest wave */}
              <path
                d="M0,0 C30,100 60,150 30,300 C10,450 50,550 30,700 C20,850 40,920 0,1000 Z"
                fill="#c3c0ff"
                opacity="0.25"
                transform="translate(14, 0)"
              />
              {/* Layer 2: Medium indigo wave */}
              <path
                d="M0,0 C30,100 60,150 30,300 C10,450 50,550 30,700 C20,850 40,920 0,1000 Z"
                fill="#4f46e5"
                opacity="0.45"
                transform="translate(7, 0)"
              />
              {/* Layer 3: Solid primary wave */}
              <path
                d="M0,0 C30,100 60,150 30,300 C10,450 50,550 30,700 C20,850 40,920 0,1000 Z"
                fill="#3525cd"
              />
            </svg>
          </div>
        </div>

        {/* Right Section (Login Form) - takes 58% on desktop, 100% on mobile */}
        <div className="w-full md:w-[58%] bg-white flex flex-col justify-center p-6 sm:p-8 relative z-0">
          
          {/* Logo Component */}
          <Logo />

          <div className="w-full text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#191c1e] font-sans">Admin Login</h2>
            <p className="text-xs sm:text-sm text-[#777587] mt-1">Silakan masuk untuk mengakses Dashboard Admin.</p>
          </div>

          {/* Success / Error Alerts */}
          {successMsg && <Alert type="success" message={successMsg} />}
          {error && <Alert type="error" message={error} />}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-5">
            <InputField
              id="email"
              type="text"
              label="Username / Email"
              icon="mail"
              placeholder="nama@talentaku.com"
              value={email}
              onChange={handleEmailChange}
              error={emailError}
            />

            <PasswordInput
              id="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
              error={passwordError}
            />

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between pt-1">
              <Checkbox
                id="rememberMe"
                label="Remember Me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs font-bold text-[#3525cd] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3525cd]/30 rounded px-1.5 py-0.5 font-sans"
              >
                Lupa Password?
              </button>
            </div>

            {/* Submit Button */}
            <ButtonPrimary type="submit" loading={loading}>
              Masuk Sistem
            </ButtonPrimary>
          </form>

          {/* Back Link */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => navigate('/')}
              className="text-xs font-semibold text-[#777587] hover:text-[#3525cd] transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3525cd]/30 rounded-xl px-3.5 py-2 border border-[#c7c4d8]/40 bg-white shadow-sm hover:shadow"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#e2e8f0] animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-amber-500 bg-amber-50 p-2 rounded-xl">info</span>
              <h4 className="text-base font-bold text-[#191c1e]">Lupa Kata Sandi?</h4>
            </div>
            <p className="text-sm text-[#464555] mb-6 leading-relaxed">
              Untuk menjaga keamanan sistem, pengaturan ulang kata sandi admin hanya dapat dilakukan oleh **Super Admin** melalui basis data atau konfigurasi server. Silakan hubungi tim IT atau Super Admin Anda.
            </p>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2.5 bg-[#3525cd] hover:bg-[#25189e] text-white text-sm font-semibold rounded-2xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3525cd]/50"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
