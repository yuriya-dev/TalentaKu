import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function UserRegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleGoogleCredentialResponse = async (response: any) => {
    setLoading(true)
    setError(null)
    setSuccessMsg(null)

    try {
      const res = await fetch('http://localhost:8080/api/login/google', {
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

      // Check if there is an anonymous assessment to claim
      const claimId = sessionStorage.getItem('claim_consultation_id')
      if (claimId) {
        try {
          const claimRes = await fetch('http://localhost:8080/api/consultations/claim', {
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
      setTimeout(() => {
        navigate('/assessments')
      }, 1500)

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
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "123456789012-abc123def456.apps.googleusercontent.com", // Dynamic Google Client ID
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessMsg(null)

    try {
      const res = await fetch('http://localhost:8080/api/register', {
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

      // Check if there is an anonymous assessment to claim
      const claimId = sessionStorage.getItem('claim_consultation_id')
      if (claimId) {
        try {
          const claimRes = await fetch('http://localhost:8080/api/consultations/claim', {
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
      setTimeout(() => {
        navigate('/assessments')
      }, 1500)

    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem saat mencoba mendaftar.')
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] font-sans min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow flex items-center justify-center pt-24 pb-28 px-4">
        {/* Card Container */}
        <div className="w-full max-w-md p-8 sm:p-10 clay-card flex flex-col items-center">
          <div className="flex flex-col items-center mb-6 text-center">
            <span className="material-symbols-outlined text-4xl text-[#3525cd] bg-[#3525cd]/10 p-3 rounded-2xl mb-3">
              person_add
            </span>
            <h2 className="text-2xl font-bold text-[#191c1e]">Daftar Akun Baru</h2>
            <p className="text-xs sm:text-sm text-[#464555] mt-1">
              Buat akun secara gratis untuk memantau bakat anak Anda.
            </p>
          </div>

          {/* Success / Error Message Box */}
          {successMsg && (
            <div className="w-full mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-xl text-emerald-800 text-xs sm:text-sm flex gap-3 shadow-sm">
              <span className="material-symbols-outlined text-emerald-600 shrink-0">check_circle</span>
              <p className="opacity-95">{successMsg}</p>
            </div>
          )}

          {error && (
            <div className="w-full mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-800 text-xs sm:text-sm flex gap-3 shadow-sm">
              <span className="material-symbols-outlined text-red-600 shrink-0">error</span>
              <div className="flex-1">
                <h5 className="font-bold mb-0.5">Gagal Mendaftar</h5>
                <p className="opacity-90">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="w-full space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#464555] uppercase tracking-wider pl-1" htmlFor="name">
                Nama Lengkap
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 material-symbols-outlined text-[#777587] text-lg">person</span>
                <input
                  id="name"
                  type="text"
                  required
                  className="w-full pl-11 pr-4 py-3 clay-input text-sm text-[#191c1e]"
                  placeholder="Nama Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#464555] uppercase tracking-wider pl-1" htmlFor="email">
                Alamat Email
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 material-symbols-outlined text-[#777587] text-lg">mail</span>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full pl-11 pr-4 py-3 clay-input text-sm text-[#191c1e]"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#464555] uppercase tracking-wider pl-1" htmlFor="password">
                Kata Sandi Baru
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 material-symbols-outlined text-[#777587] text-lg">lock</span>
                <input
                  id="password"
                  type="password"
                  required
                  className="w-full pl-11 pr-4 py-3 clay-input text-sm text-[#191c1e]"
                  placeholder="Buat kata sandi minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 clay-btn-primary text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin">sync</span>
                  Memproses Pendaftaran...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">person_add</span>
                  Daftar Akun
                </>
              )}
            </button>
          </form>

          {/* Divider OR */}
          <div className="relative flex py-4 items-center w-full">
            <div className="flex-grow border-t border-[#c7c4d8]/40"></div>
            <span className="flex-shrink mx-4 text-xs text-[#777587] font-bold uppercase tracking-wider">atau masuk dengan</span>
            <div className="flex-grow border-t border-[#c7c4d8]/40"></div>
          </div>

          {/* Google Sign-in Button Wrapper */}
          <div className="w-full flex justify-center mb-3">
            <div id="google-signin-btn"></div>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-xs text-[#464555] text-center">
            Sudah memiliki akun?{' '}
            <Link to="/login" className="text-[#3525cd] font-bold hover:underline">
              Masuk Akun
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
