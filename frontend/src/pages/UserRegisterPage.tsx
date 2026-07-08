import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { API_BASE } from '../config'

// Reusable Sub-components matching brand visual design
function Logo() {
  return (
    <div className="flex flex-col items-center mb-6 select-none">
      <img src="/logo_text.svg" alt="TalentaKu Logo" className="h-9 w-auto mb-1.5 object-contain" />
      <span className="text-[9px] text-[#3525cd] font-bold uppercase tracking-[0.25em]">Portal Orang Tua & Guru</span>
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
        <h5 className="font-bold mb-0.5">{isError ? 'Gagal Mendaftar' : 'Pendaftaran Berhasil'}</h5>
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

interface ButtonPrimaryProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  loadingText?: string
}
function ButtonPrimary({ children, loading, loadingText = 'Registering...', ...props }: ButtonPrimaryProps) {
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

export default function UserRegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [nameError, setNameError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [isFadingOut, setIsFadingOut] = useState(false)

  const handleGoogleCredentialResponse = async (response: any) => {
    setLoading(true)
    setError(null)
    setSuccessMsg(null)

    try {
      const res = await fetch(`${API_BASE}/api/login/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: response.credential }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Gagal masuk menggunakan Google.')
      }

      // Store User Token & Data
      localStorage.setItem('user_token', data.token)
      localStorage.setItem('user_data', JSON.stringify(data.user))
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')

      // Check if there is an anonymous assessment to claim
      const claimId = sessionStorage.getItem('claim_consultation_id')
      if (claimId) {
        try {
          const claimRes = await fetch(`${API_BASE}/api/consultations/claim`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${data.token}`
            },
            body: JSON.stringify({ consultation_id: parseInt(claimId) })
          })

          if (claimRes.ok) {
            sessionStorage.removeItem('claim_consultation_id')
            setSuccessMsg('Pendaftaran berhasil! Hasil asesmen terakhir Anda telah disimpan ke akun Anda.')
          }
        } catch (claimErr) {
          console.error('Failed to claim consultation:', claimErr)
        }
      }

      setSuccessMsg('Pendaftaran berhasil menggunakan Google! Mengalihkan...')
      
      // Trigger fade out before navigating
      setTimeout(() => {
        setIsFadingOut(true)
        setTimeout(() => {
          navigate('/assessments')
        }, 300)
      }, 500)

    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem saat mencoba mendaftar dengan Google.')
      setLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'Daftar Akun | TalentaKu'
    const token = localStorage.getItem('user_token')
    if (token) {
      navigate('/assessments')
      return
    }

    // Initialize Google Sign-in button
    const google = (window as any).google
    if (google) {
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "123456789012-abc123def456.apps.googleusercontent.com",
        callback: (response: any) => {
          handleGoogleCredentialResponse(response)
        }
      })
      google.accounts.id.renderButton(
        document.getElementById("google-signin-btn"),
        { theme: "outline", size: "large", width: 380, logo_alignment: "left" }
      )
    }
  }, [navigate])

  const validate = () => {
    let isValid = true
    if (!name.trim()) {
      setNameError('Nama lengkap wajib diisi.')
      isValid = false
    } else {
      setNameError(null)
    }

    if (!email.trim()) {
      setEmailError('Email wajib diisi.')
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    if (nameError) setNameError(null)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (emailError) setEmailError(null)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (passwordError) setPasswordError(null)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) {
      return
    }

    setLoading(true)
    setError(null)
    setSuccessMsg(null)

    try {
      const res = await fetch(`${API_BASE}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Gagal mendaftarkan akun baru.')
      }

      // Store User Token & Data
      localStorage.setItem('user_token', data.token)
      localStorage.setItem('user_data', JSON.stringify(data.user))
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')

      // Check if there is an anonymous assessment to claim
      const claimId = sessionStorage.getItem('claim_consultation_id')
      if (claimId) {
        try {
          const claimRes = await fetch(`${API_BASE}/api/consultations/claim`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${data.token}`
            },
            body: JSON.stringify({ consultation_id: parseInt(claimId) })
          })

          if (claimRes.ok) {
            sessionStorage.removeItem('claim_consultation_id')
            setSuccessMsg('Pendaftaran berhasil! Hasil asesmen terakhir Anda telah disimpan ke akun Anda.')
          }
        } catch (claimErr) {
          console.error('Failed to claim consultation:', claimErr)
        }
      }

      setSuccessMsg('Pendaftaran berhasil! Mengalihkan ke halaman riwayat...')
      
      // Trigger fade out before navigating
      setTimeout(() => {
        setIsFadingOut(true)
        setTimeout(() => {
          navigate('/assessments')
        }, 300)
      }, 500)

    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem saat mencoba mendaftar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`text-[#191c1e] font-sans min-h-screen flex items-center justify-center bg-[#f0f4f8] p-4 sm:p-8 transition-all duration-300 ${isFadingOut ? 'opacity-0 scale-98' : 'opacity-100'} relative overflow-hidden`}>
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
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] md:w-[30vw] md:h-[30vw] rounded-full bg-gradient-to-tr from-[#3525cd]/10 to-[#4f46e5]/4 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] md:w-[25vw] md:h-[25vw] rounded-full bg-gradient-to-br from-[#06b6d4]/8 to-[#3525cd]/10 blur-[100px] pointer-events-none" />

      {/* Dual-Panel Card Container */}
      <div className="relative w-full max-w-3xl min-h-0 clay-card flex overflow-hidden z-10 animate-slide-up">
        
        {/* Left Section (Indigo Branding Panel) - Hidden on mobile */}
        <div className="hidden md:flex md:w-[42%] bg-[#3525cd] text-white flex-col justify-between p-8 lg:p-10 relative overflow-visible select-none z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          
          {/* Top Header */}
          <div className="z-10 text-left">
            <span className="text-[10px] text-white/70 font-bold uppercase tracking-[0.2em]">Sistem Pakar</span>
          </div>

          {/* Central Welcome Content */}
          <div className="flex flex-col items-center text-center z-10 my-auto">
            <span className="text-white/60 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-1">
              Welcome to
            </span>
            {/* Circular Icon Badge */}
            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/25 flex items-center justify-center mb-5 shadow-lg shadow-[#1c127d]/20 animate-pulse">
              <span className="material-symbols-outlined text-4xl text-white">child_care</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-wide mb-3 font-sans">TalentaKu</h2>
            <p className="text-white/80 text-xs leading-relaxed max-w-[240px]">
              Daftarkan akun Anda untuk memantau tumbuh kembang anak secara berkelanjutan dan menyimpan hasil asesmen.
            </p>
          </div>

          {/* Bottom branding footer */}
          <div className="z-10 text-left text-[10px] text-white/50 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-xs">family_history</span>
            Portal Orang Tua & Guru
          </div>

          {/* Wavy Cloud Border Transition (Overlaying the Right Panel) */}
          <div className="absolute right-0 top-0 bottom-0 w-[40px] pointer-events-none select-none translate-x-[99%] z-20">
            <svg
              className="h-full w-full"
              viewBox="0 0 100 1000"
              preserveAspectRatio="none"
            >
              {/* Layer 1: Indigo Wave */}
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

        {/* Right Section (Register Form & Google Sign-In) - takes 58% on desktop */}
        <div className="w-full md:w-[58%] bg-white flex flex-col justify-center p-6 sm:p-8 relative z-0">
          
          {/* Logo Component */}
          <Logo />

          <div className="w-full text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#191c1e] font-sans">Daftar Akun Baru</h2>
            <p className="text-xs sm:text-sm text-[#777587] mt-1">Mulai langkah awal untuk mengenali bakat dan potensi anak Anda.</p>
          </div>

          {/* Success / Error Alerts */}
          {successMsg && <Alert type="success" message={successMsg} />}
          {error && <Alert type="error" message={error} />}

          {/* Register Form */}
          <form onSubmit={handleRegister} className="w-full space-y-4">
            <InputField
              id="name"
              type="text"
              label="Nama Lengkap"
              icon="account_circle"
              placeholder="Nama Anda"
              value={name}
              onChange={handleNameChange}
              error={nameError}
            />

            <InputField
              id="email"
              type="email"
              label="Alamat Email"
              icon="mail"
              placeholder="nama@email.com"
              value={email}
              onChange={handleEmailChange}
              error={emailError}
            />

            <PasswordInput
              id="password"
              label="Kata Sandi"
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
              error={passwordError}
            />

            {/* Submit Button */}
            <ButtonPrimary type="submit" loading={loading} loadingText="Registering...">
              Daftarkan Akun
            </ButtonPrimary>
          </form>

          {/* Divider OR */}
          <div className="relative flex py-4 items-center w-full select-none">
            <div className="flex-grow border-t border-[#c7c4d8]/40"></div>
            <span className="flex-shrink mx-4 text-[10px] text-[#777587] font-bold uppercase tracking-wider">atau mendaftar dengan</span>
            <div className="flex-grow border-t border-[#c7c4d8]/40"></div>
          </div>

          {/* Google Sign-in Button Wrapper */}
          <div className="w-full flex justify-center mb-1 select-none">
            <div id="google-signin-btn"></div>
          </div>

          {/* Login Link */}
          <div className="mt-5 text-xs text-[#464555] text-center">
            Sudah memiliki akun?{' '}
            <Link to="/login" className="text-[#3525cd] font-bold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3525cd]/30 rounded px-1">
              Masuk Sekarang
            </Link>
          </div>

          {/* Back Link */}
          <div className="flex justify-center mt-6 border-t border-[#c7c4d8]/20 pt-4">
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
    </div>
  )
}
