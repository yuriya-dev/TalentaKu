import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const ageRanges = [
  { label: 'Batita', range: 'Usia 3 Tahun', value: 3 },
  { label: 'Prasekolah / TK', range: 'Usia 4 - 6 Tahun', value: 5 },
  { label: 'SD Awal', range: 'Usia 7 - 9 Tahun', value: 8 },
  { label: 'SD Akhir', range: 'Usia 10 - 12 Tahun', value: 11 },
]

export default function ChildIntakePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Data Identitas Anak | TalentaKu'
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const ageVal = formData.get('age') as string
    const genderVal = formData.get('gender') as string
    const school = formData.get('school') as string

    const payload = {
      name,
      age: parseInt(ageVal, 10),
      gender: genderVal === 'boy' ? 'male' : 'female',
      school,
    }

    const token = localStorage.getItem('user_token')
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      const res = await fetch('http://localhost:8080/api/intake', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Terjadi kesalahan saat memulai penilaian.')
      }

      const data = await res.json()
      sessionStorage.setItem('consultation_id', data.consultation_id.toString())
      sessionStorage.setItem('child_name', data.child.name)
      sessionStorage.removeItem('assessment_answers') // Reset answers
      
      navigate('/assessment/1')
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal terhubung ke server. Pastikan server backend Anda berjalan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] font-sans min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#f7f9fb]/80 backdrop-blur-md shadow-sm sticky top-0 z-50 flex justify-between items-center w-full px-4 md:px-10 py-4">
        <Link to="/" className="flex items-center">
          <img src="/logo_text.svg" alt="TalentaKu Logo" className="h-7 w-auto shrink-0" />
        </Link>
        <div className="flex items-center gap-4">
          <button className="text-[#464555] hover:text-[#3525cd] transition-colors p-2 rounded-full hover:bg-[#e6e8ea] active:scale-95">
            <span className="material-symbols-outlined">help</span>
          </button>
          <button className="text-[#464555] hover:text-[#3525cd] transition-colors p-2 rounded-full hover:bg-[#e6e8ea] active:scale-95">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-[#f2f4f6] h-1.5 sticky top-[72px] z-40">
        <div className="bg-[#3525cd] h-full shadow-[0_0_8px_rgba(79,70,229,0.4)]" style={{ width: '15%', transition: 'width 0.6s cubic-bezier(0.65,0,0.35,1)' }} />
      </div>

      {/* Main */}
      <main className="flex-grow flex flex-col items-center justify-start py-12 px-4 md:px-10 relative overflow-hidden">
        {/* Ambient blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#3525cd]/5 rounded-full blur-[100px] -z-10" />
        <div className="absolute top-1/2 -right-24 w-64 h-64 bg-[#00687a]/5 rounded-full blur-[80px] -z-10" />

        <section className="max-w-[640px] w-full space-y-6">
          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3525cd]/10 text-[#3525cd] border border-[#3525cd]/20 mb-4">
              <span className="material-symbols-outlined text-[18px]">child_care</span>
              <span className="text-xs font-semibold uppercase tracking-wider">Langkah 1: Identitas</span>
            </div>
            <h1 className="text-[32px] font-bold leading-10 text-[#191c1e]">Ceritakan tentang anak Anda</h1>
            <p className="text-lg text-[#464555]">Kami akan menggunakan informasi ini untuk menyesuaikan hasil penilaian khusus bagi tahap perkembangan mereka.</p>
          </div>

          {/* Form Card */}
          <div className="clay-card p-8">
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 rounded-lg text-red-800 text-sm flex items-start gap-2 shadow-sm">
                <span className="material-symbols-outlined text-red-600 text-lg">error</span>
                <span>{errorMsg}</span>
              </div>
            )}
            <form className="space-y-8" id="intake-form" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="space-y-2 group">
                <label className="text-sm font-semibold text-[#191c1e] block px-1" htmlFor="child-name">
                  Nama Lengkap Anak
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#777587] group-focus-within:text-[#3525cd] transition-colors">person</span>
                  <input
                    className="w-full pl-12 pr-4 py-3.5 clay-input text-base"
                    id="child-name"
                    name="name"
                    placeholder="Masukkan nama lengkap"
                    required
                    type="text"
                  />
                </div>
              </div>

              {/* Age */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-[#191c1e] block px-1">Kelompok Usia Saat Ini</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ageRanges.map((item) => (
                    <label key={item.value} className="relative group cursor-pointer">
                      <input className="peer sr-only" name="age" required type="radio" value={item.value} />
                      <div className="p-4 text-center border-2 border-[#c7c4d8] rounded-xl group-hover:border-[#3525cd]/50 peer-checked:border-[#3525cd] peer-checked:bg-[#4f46e5]/5 transition-all h-full flex flex-col justify-center min-h-[92px]">
                        <span className="block text-xs font-semibold text-[#464555] mb-1">{item.label}</span>
                        <span className="block text-base font-bold text-[#191c1e]">{item.range}</span>
                      </div>
                      <span
                        className="material-symbols-outlined absolute -top-2 -right-2 bg-[#3525cd] text-white rounded-full p-0.5 text-sm opacity-0 peer-checked:opacity-100 transition-opacity"
                        style={{ fontVariationSettings: "'FILL' 1", fontSize: '14px' }}
                      >
                        check
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Gender + School */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#191c1e] block px-1">Jenis Kelamin</label>
                  <div className="flex gap-2 p-1 bg-[#f2f4f6] rounded-lg">
                    {[
                      { label: 'Laki-laki', value: 'boy' },
                      { label: 'Perempuan', value: 'girl' }
                    ].map((g) => (
                      <label key={g.value} className="flex-1">
                        <input className="peer sr-only" name="gender" required type="radio" value={g.value} />
                        <div className="text-center py-2.5 rounded-md cursor-pointer transition-all peer-checked:bg-white peer-checked:shadow-sm text-sm font-semibold text-[#464555] peer-checked:text-[#3525cd]">
                          {g.label}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#191c1e] block px-1" htmlFor="child-school">Sekolah / TK</label>
                  <input
                    className="w-full px-4 py-2.5 clay-input text-base"
                    id="child-school"
                    name="school"
                    placeholder="Nama Sekolah"
                    required
                    type="text"
                  />
                </div>
              </div>

              {/* CTA */}
              <div className="pt-8 border-t border-[#c7c4d8]/30 flex flex-col md:flex-row justify-between items-center gap-4">
                <Link
                  to="/"
                  className="text-[#464555] text-sm font-semibold flex items-center gap-2 px-6 py-3 hover:text-[#3525cd] transition-colors"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                  Kembali ke Beranda
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto clay-btn-primary text-sm font-semibold px-10 py-4 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">sync</span>
                      Memulai...
                    </>
                  ) : (
                    <>
                      Mulai Penilaian
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Trust badge */}
          <p className="text-center text-xs text-[#464555]/60 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-base">lock</span>
            Data Anda dienkripsi dan hanya digunakan untuk tujuan identifikasi bakat.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#e0e3e5] w-full py-8 px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4 mt-auto">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="text-sm font-bold text-[#464555]">TalentaKu</span>
          <p className="text-xs text-[#464555]">© 2026 TalentaKu Expert Systems. Kehangatan Profesional dalam Penilaian.</p>
        </div>
        <div className="flex gap-6">
          <a href="#" className="text-xs text-[#464555] hover:text-[#3525cd] transition-colors">Bantuan</a>
          <a href="#" className="text-xs text-[#464555] hover:text-[#3525cd] transition-colors">Kebijakan Privasi</a>
        </div>
      </footer>
    </div>
  )
}
