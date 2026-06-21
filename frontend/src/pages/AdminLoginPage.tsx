import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Masuk Admin | TalentaKu'
    // If already logged in, redirect to admin dashboard
    const token = localStorage.getItem('admin_token')
    if (token) {
      navigate('/admin')
    }
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('http://localhost:8080/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Email atau kata sandi salah.')
      }

      // Store JWT token and admin details
      localStorage.setItem('admin_token', data.token)
      localStorage.setItem('admin_user', JSON.stringify(data.admin))

      // Redirect to dashboard
      navigate('/admin')
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#f0f4f8] overflow-hidden font-sans">
      {/* Background Decorative Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-[#3525cd]/20 to-[#4f46e5]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-br from-[#06b6d4]/10 to-[#3525cd]/15 blur-[100px] pointer-events-none" />

      {/* Main Glass Container */}
      <div className="relative w-full max-w-md p-8 sm:p-10 mx-4 bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_20px_50px_rgba(53,37,205,0.08)] rounded-[2.5rem] flex flex-col items-center">
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-8">
          <img src="/logo_text.svg" alt="TalentaKu Logo" className="h-9 w-auto mb-2 object-contain" />
          <span className="text-[10px] text-[#4f46e5] font-bold uppercase tracking-[0.2em]">Panel Manajemen Admin</span>
        </div>

        <div className="w-full text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#191c1e]">Selamat Datang Kembali</h2>
          <p className="text-xs sm:text-sm text-[#464555] mt-1">Silakan masuk menggunakan kredensial admin Anda.</p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="w-full mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-800 text-xs sm:text-sm flex gap-3 shadow-sm animate-shake">
            <span className="material-symbols-outlined text-red-600 shrink-0">error</span>
            <div className="flex-1">
              <h5 className="font-bold mb-0.5">Gagal Masuk</h5>
              <p className="opacity-90">{error}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-5">
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
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#c7c4d8]/60 focus:border-[#3525cd] rounded-2xl text-sm text-[#191c1e] outline-none shadow-sm focus:shadow-md focus:shadow-[#3525cd]/5 transition-all"
                placeholder="nama@talentaku.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#464555] uppercase tracking-wider pl-1" htmlFor="password">
              Kata Sandi
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 material-symbols-outlined text-[#777587] text-lg">lock</span>
              <input
                id="password"
                type="password"
                required
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#c7c4d8]/60 focus:border-[#3525cd] rounded-2xl text-sm text-[#191c1e] outline-none shadow-sm focus:shadow-md focus:shadow-[#3525cd]/5 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 bg-[#3525cd] text-white font-bold rounded-2xl text-sm shadow-lg shadow-[#3525cd]/25 hover:bg-[#4f46e5] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                Sedang Memproses...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">login</span>
                Masuk Sistem
              </>
            )}
          </button>
        </form>

        {/* Back Link */}
        <button
          onClick={() => navigate('/')}
          className="mt-6 text-xs font-semibold text-[#777587] hover:text-[#3525cd] transition-colors flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Kembali ke Beranda
        </button>
      </div>
    </div>
  )
}
