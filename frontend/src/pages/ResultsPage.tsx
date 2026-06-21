import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

function launchConfetti() {
  const colors = ['#4F46E5', '#57dffe', '#10B981', '#FCD34D']
  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const particle = document.createElement('div')
      particle.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 200;
        width: ${randomInRange(4, 10)}px;
        height: ${randomInRange(4, 10)}px;
        background-color: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}vw;
        top: -10px;
        border-radius: 50%;
      `
      document.body.appendChild(particle)
      const anim = particle.animate(
        [
          { transform: 'translate(0,0) rotate(0deg)', opacity: '1' },
          { transform: `translate(${randomInRange(-100, 100)}px, 100vh) rotate(${randomInRange(0, 720)}deg)`, opacity: '0' },
        ],
        { duration: randomInRange(2000, 4000), easing: 'cubic-bezier(0.25,0.46,0.45,0.94)' }
      )
      anim.onfinish = () => particle.remove()
    }, i * 40)
  }
}

export default function ResultsPage() {
  const { assessmentId } = useParams<{ assessmentId: string }>()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTraceCode, setSelectedTraceCode] = useState<string>('')

  const [claiming, setClaiming] = useState(false)
  const [claimSuccess, setClaimSuccess] = useState<string | null>(null)
  const [claimError, setClaimError] = useState<string | null>(null)
  const [localUserId, setLocalUserId] = useState<number | null>(null)

  const userToken = localStorage.getItem('user_token')
  const userDataStr = localStorage.getItem('user_data')
  const userData = userDataStr ? JSON.parse(userDataStr) : null
  const isAdmin = !!localStorage.getItem('admin_token')

  useEffect(() => {
    document.title = 'Hasil Penilaian | TalentaKu'
  }, [])

  useEffect(() => {
    if (data) {
      launchConfetti()
    }
  }, [data])

  useEffect(() => {
    async function fetchResults() {
      if (!assessmentId) return
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`http://localhost:8080/api/consultation/${assessmentId}/results`)
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          throw new Error(errData.error || 'Gagal memuat hasil evaluasi.')
        }
        const json = await res.json()
        setData(json)
        if (json.user_id) {
          setLocalUserId(json.user_id)
        }
        if (json.results && json.results.length > 0) {
          setSelectedTraceCode(json.results[0].criterion_code)
        }
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan jaringan atau server tidak merespons.')
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [assessmentId])

  const handleClaim = async () => {
    if (!assessmentId || !userToken) return
    setClaiming(true)
    setClaimError(null)
    setClaimSuccess(null)
    try {
      const res = await fetch('http://localhost:8080/api/consultations/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ consultation_id: parseInt(assessmentId) })
      })
      const claimData = await res.json()
      if (!res.ok) {
        throw new Error(claimData.error || 'Gagal menyimpan hasil asesmen.')
      }
      setClaimSuccess('Hasil asesmen berhasil disimpan ke akun Anda!')
      setLocalUserId(userData?.id || 1)
    } catch (err: any) {
      setClaimError(err.message || 'Terjadi kesalahan sistem.')
    } finally {
      setClaiming(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-[#f7f9fb] text-[#191c1e] font-sans min-h-screen flex flex-col justify-between">
        <Navbar />
        <main className="pt-24 pb-32 px-4 md:px-10 max-w-screen-xl mx-auto w-full">
          <phantom-ui loading="true" className="block">
            {/* Header Celebration Skeleton */}
            <div className="flex flex-col items-center mb-16 text-center space-y-4">
              <div className="h-8 w-48 bg-slate-100 rounded-full mx-auto"></div>
              <div className="h-12 w-96 bg-slate-100 rounded mx-auto"></div>
              <div className="h-4 w-[400px] bg-slate-100 rounded mx-auto"></div>
            </div>

            {/* Results Bento Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Primary Result Card Skeleton */}
              <div className="md:col-span-8 bg-white rounded-xl border border-[#c7c4d8]/40 p-8 min-h-[300px] flex flex-col justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-slate-100"></div>
                  <div className="space-y-2 flex-grow">
                    <div className="h-6 w-48 bg-slate-100 rounded"></div>
                    <div className="h-4 w-32 bg-slate-100 rounded"></div>
                  </div>
                </div>
                <div className="space-y-3 mt-6">
                  <div className="h-4 w-full bg-slate-100 rounded"></div>
                  <div className="h-4 w-full bg-slate-100 rounded"></div>
                  <div className="h-4 w-2/3 bg-slate-100 rounded"></div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="h-16 bg-slate-100 rounded-lg"></div>
                  <div className="h-16 bg-slate-100 rounded-lg"></div>
                </div>
              </div>

              {/* Sidebar Widgets Skeleton */}
              <div className="md:col-span-4 flex flex-col gap-6">
                <div className="h-24 bg-white border border-[#c7c4d8]/40 rounded-xl p-6"></div>
                <div className="h-24 bg-white border border-[#c7c4d8]/40 rounded-xl p-6"></div>
                <div className="h-32 bg-slate-100 rounded-xl"></div>
              </div>
            </div>
          </phantom-ui>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !data || !data.results || data.results.length === 0) {
    return (
      <div className="bg-[#f7f9fb] text-[#191c1e] font-sans min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center pt-24 pb-32 px-4">
          <div className="max-w-md w-full bg-white border border-[#c7c4d8] rounded-2xl p-8 text-center shadow-md">
            <span className="material-symbols-outlined text-5xl text-red-500 mb-4">
              error
            </span>
            <h3 className="text-xl font-bold text-red-800 mb-2">Evaluasi Gagal</h3>
            <p className="text-sm text-[#464555] mb-6">
              {error || 'Data konsultasi tidak ditemukan atau belum selesai dievaluasi.'}
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/assessment/start"
                className="bg-[#3525cd] text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-[#4f46e5] transition-all"
              >
                Mulai Baru
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="border border-[#c7c4d8] text-[#464555] text-sm font-semibold px-6 py-3 rounded-full hover:bg-[#eceef0] transition-all"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const child = data.child
  const results = data.results
  const primaryResult = results[0]
  const silverResult = results[1]
  const bronzeResult = results[2]
  const isSatisfied = primaryResult.is_rule_satisfied

  function getAgeGroupLabel(age: number) {
    if (age <= 3) return 'Batita (3 Tahun)'
    if (age <= 6) return 'Prasekolah / TK (4 - 6 Tahun)'
    if (age <= 9) return 'SD Awal (7 - 9 Tahun)'
    return 'SD Akhir (10 - 12 Tahun)'
  }

  const suggestions = primaryResult.suggestions || ''
  const developmentPaths = suggestions
    ? suggestions.split(', ').map((s: string) => {
        if (!s) return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
      }).filter(Boolean)
    : []

  const selectedResult = results.find((r: any) => r.criterion_code === selectedTraceCode) || primaryResult

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] font-sans overflow-x-hidden">
      {isAdmin ? (
        <header className="bg-slate-900 text-white sticky top-0 z-50 flex justify-between items-center w-full px-4 md:px-10 py-4 shadow-md no-print">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#3525cd] bg-white p-1.5 rounded-lg text-lg">admin_panel_settings</span>
            <span className="text-sm font-bold tracking-wider uppercase">Panel Admin — Detail Hasil Asesmen</span>
          </div>
          <Link
            to="/admin/assessments"
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Kembali ke Admin
          </Link>
        </header>
      ) : (
        <Navbar />
      )}

      <main className="pt-24 pb-32 px-4 md:px-10 max-w-screen-xl mx-auto">
        {/* Header Celebration */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#4f46e5]/10 px-4 py-2 rounded-full text-[#3525cd] mb-6">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            <span className="text-sm font-semibold">Penilaian Selesai Real-time</span>
          </div>
          <h1 className="text-[40px] md:text-[48px] font-bold leading-[48px] md:leading-[56px] tracking-tight mb-4">
            Hasil Analisis Bakat: {child.name}
          </h1>
          <p className="text-[#464555] max-w-2xl mx-auto text-lg">
            Sesi evaluasi untuk <strong>{child.name}</strong> ({getAgeGroupLabel(child.age)}), sekolah di <strong>{child.school}</strong> telah dianalisis secara real-time oleh mesin inferensi sistem pakar.
          </p>
        </header>

        {/* Claim Banner (if not owned/associated with a user yet) */}
        {!localUserId && !isAdmin && (
          <div className="mb-12 max-w-4xl mx-auto bg-gradient-to-r from-[#3525cd]/10 to-[#57dffe]/10 border border-[#c7c4d8]/60 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm no-print">
            <div className="flex gap-4 items-start">
              <span className="material-symbols-outlined text-4xl text-[#3525cd] bg-white p-3 rounded-2xl shadow-sm">
                cloud_upload
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#191c1e] mb-1">Simpan Hasil Asesmen Ini</h3>
                <p className="text-sm text-[#464555] max-w-xl">
                  {userToken 
                    ? `Hasil asesmen ${child.name} belum disimpan ke akun Anda. Simpan sekarang untuk mengaksesnya di halaman riwayat kapan saja.`
                    : `Simpan hasil asesmen ${child.name} ke akun Anda untuk dipantau secara berkelanjutan di halaman riwayat kapan saja.`}
                </p>
                {claimSuccess && (
                  <p className="text-emerald-600 font-bold text-sm mt-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    {claimSuccess}
                  </p>
                )}
                {claimError && (
                  <p className="text-red-600 font-bold text-sm mt-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">error</span>
                    {claimError}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 shrink-0">
              {userToken ? (
                <button
                  onClick={handleClaim}
                  disabled={claiming}
                  className="bg-[#3525cd] hover:bg-[#4f46e5] text-white font-bold px-6 py-3 rounded-xl text-sm shadow-sm transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {claiming ? (
                    <>
                      <span className="material-symbols-outlined text-base animate-spin">sync</span>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">save</span>
                      Simpan ke Akun Saya
                    </>
                  )}
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => sessionStorage.setItem('claim_consultation_id', assessmentId || '')}
                    className="bg-[#3525cd] hover:bg-[#4f46e5] text-white font-bold px-6 py-3 rounded-xl text-sm shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] text-center flex items-center justify-center"
                  >
                    Masuk & Simpan
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => sessionStorage.setItem('claim_consultation_id', assessmentId || '')}
                    className="bg-white border border-[#c7c4d8] hover:bg-[#eceef0] text-[#191c1e] font-bold px-6 py-3 rounded-xl text-sm shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] text-center flex items-center justify-center"
                  >
                    Daftar Akun
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

        {/* Results Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Primary Result */}
          <section className="md:col-span-8 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[#c7c4d8] p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8">
              <div className="text-right">
                <span className="block text-[#3525cd] text-[48px] font-bold leading-none">
                  {Math.round(primaryResult.score_percentage)}%
                </span>
                <span className="text-xs text-[#464555] uppercase tracking-wider">Skor Keyakinan</span>
              </div>
            </div>
            <div className="flex flex-col gap-6 max-w-lg">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#FCD34D]/20 flex items-center justify-center text-[#FCD34D] shadow-sm">
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                </div>
                <div>
                  <h2 className="text-[32px] font-bold leading-10">{primaryResult.criterion_label}</h2>
                  <p className="text-[#464555] text-sm font-semibold mt-1">
                    {isSatisfied ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">
                        <span className="material-symbols-outlined text-xs">verified</span>
                        Bakat Teridentifikasi (Utama)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">
                        <span className="material-symbols-outlined text-xs">info</span>
                        Kecenderungan Bakat (Dominan)
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-[#3525cd]">Deskripsi Hasil</h3>
                <p className="text-[#464555] text-lg leading-relaxed">
                  {primaryResult.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-lg bg-[#f2f4f6]">
                  <span className="block text-2xl font-semibold text-[#3525cd]">
                    {primaryResult.indicators?.length || 0} Indikator
                  </span>
                  <span className="text-xs text-[#464555]">Indikator Pendukung</span>
                </div>
                <div className="p-4 rounded-lg bg-[#f2f4f6]">
                  <span className="block text-2xl font-semibold text-[#3525cd]">
                    {primaryResult.indicators?.filter((i: any) => i.is_satisfied).length || 0} Terpenuhi
                  </span>
                  <span className="text-xs text-[#464555]">Evaluasi Aturan</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-[#3525cd]/5 rounded-full blur-3xl group-hover:bg-[#3525cd]/10 transition-colors duration-500" />
          </section>

          {/* Silver + Bronze + Insight */}
          <aside className="md:col-span-4 flex flex-col gap-6">
            {/* Silver */}
            {silverResult && (
              <div className="bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[#c7c4d8] p-6 flex items-center justify-between group hover:shadow-lg transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#94A3B8]/20 flex items-center justify-center text-[#94A3B8]">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">{silverResult.criterion_label}</h4>
                    <p className="text-xs text-[#464555]">{Math.round(silverResult.score_percentage)}% Kesesuaian</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-[#777587] font-semibold">{silverResult.criterion_code}</span>
              </div>
            )}

            {/* Bronze */}
            {bronzeResult && (
              <div className="bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[#c7c4d8] p-6 flex items-center justify-between group hover:shadow-lg transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#D97706]/20 flex items-center justify-center text-[#D97706]">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">{bronzeResult.criterion_label}</h4>
                    <p className="text-xs text-[#464555]">{Math.round(bronzeResult.score_percentage)}% Kesesuaian</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-[#777587] font-semibold">{bronzeResult.criterion_code}</span>
              </div>
            )}

            {/* Expert Tip */}
            <div className="flex-grow bg-[#4f46e5]/10 text-[#0f0069] rounded-xl p-6 relative overflow-hidden flex flex-col justify-center">
              <h4 className="text-2xl font-semibold mb-2">Saran Ahli</h4>
              <p className="text-base opacity-90 leading-relaxed">
                Stimulasi dini pada potensi yang dominan membantu membentuk fondasi sinapsis otak anak secara optimal. Fokuslah pada interaksi yang hangat.
              </p>
              <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-[80px] opacity-10" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
            </div>
          </aside>

          {/* Strengths */}
          <section className="md:col-span-6 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[#c7c4d8] p-8">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-[#10B981]" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
              <h3 className="text-2xl font-semibold">Identifikasi Indikator Perilaku</h3>
            </div>
            <ul className="space-y-4">
              {primaryResult.indicators?.map((ind: any) => (
                <li key={ind.code} className="flex gap-4 items-start p-4 bg-[#f2f4f6] rounded-lg transition-transform hover:translate-x-1">
                  <span className={`material-symbols-outlined mt-1 ${ind.is_satisfied ? 'text-[#10B981]' : 'text-[#777587]'}`}>
                    {ind.is_satisfied ? 'check_circle' : 'pending'}
                  </span>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-sm font-semibold">{ind.label}</p>
                      <span className="text-xs font-mono text-slate-500 bg-slate-200/50 px-1.5 py-0.5 rounded select-none shrink-0">{ind.code}</span>
                    </div>
                    <p className="text-xs text-[#464555] mt-1.5 flex gap-2">
                      <span>Kesesuaian: <strong>{Math.round(ind.score_percentage)}%</strong></span>
                      <span>•</span>
                      <span>Evaluasi: <strong>{ind.is_satisfied ? 'Terpenuhi' : 'Belum Terpenuhi'}</strong></span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Development Path */}
          <section className="md:col-span-6 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[#c7c4d8] p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-[#00687a]" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
              <h3 className="text-2xl font-semibold">Panduan Stimulasi Tumbuh Kembang</h3>
            </div>
            <div className="space-y-6 flex-grow">
              {developmentPaths.map((path: string, idx: number) => (
                <div
                  key={idx}
                  className="relative pl-8 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-1 before:bg-[#57dffe] rounded-r-lg p-2 hover:bg-[#f2f4f6] transition-colors"
                >
                  <h4 className="text-sm font-semibold text-[#00687a]">Rekomendasi Tindakan {idx + 1}</h4>
                  <p className="text-[#464555] text-base mt-1 leading-relaxed">{path}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 no-print">
              <button 
                onClick={() => window.print()}
                className="w-full bg-[#3525cd] text-white text-sm font-semibold py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-[#4f46e5] transition-all active:scale-95 shadow-md"
              >
                <span className="material-symbols-outlined">print</span>
                Cetak Laporan Penilaian (PDF)
              </button>
            </div>
          </section>
        </div>

        {/* Inference Chaining Trace Log Section */}
        <section className="mt-16 bg-white border border-[#c7c4d8] rounded-[2rem] p-8 shadow-sm no-print">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-[#3525cd]/10 px-3 py-1 rounded-full text-[#3525cd] mb-3">
              <span className="material-symbols-outlined text-sm">terminal</span>
              <span className="text-xs font-semibold uppercase tracking-wider">Konsol Sistem Pakar</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Pelacakan Inferensi Real-time (Forward Chaining)</h3>
            <p className="text-[#464555] text-base">
              Pilih kriteria untuk menelusuri bagaimana aturan sistem pakar dievaluasi langkah demi langkah dari variabel hingga kriteria akhir.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex flex-wrap gap-2 mb-6">
            {results.map((res: any) => (
              <button
                key={res.criterion_code}
                onClick={() => setSelectedTraceCode(res.criterion_code)}
                className={`px-4 py-2.5 rounded-lg text-xs font-semibold font-mono transition-all border ${
                  selectedTraceCode === res.criterion_code
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-[#f2f4f6] text-[#464555] border-transparent hover:bg-[#eceef0]'
                }`}
              >
                {res.criterion_code} ({res.criterion_label})
              </button>
            ))}
          </div>

          {/* Terminal Panel */}
          <div className="bg-slate-950 text-slate-100 font-mono text-sm rounded-xl p-6 shadow-inner border border-slate-800 relative overflow-hidden">
            {/* Terminal Header */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-2 font-semibold font-mono select-none">forward_chaining_engine.log</span>
              </div>
              <div>
                <span>STATUS: {selectedResult.is_rule_satisfied ? 'ATURAN TERPENUHI' : 'ATURAN TIDAK TERPENUHI'}</span>
              </div>
            </div>

            {/* Terminal Contents */}
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="text-slate-500 select-none">[SYSTEM] Menginisialisasi logika evaluasi Forward Chaining...</div>
              <div className="text-slate-500 select-none">[SYSTEM] Memuat jawaban perilaku untuk sesi #{assessmentId}</div>
              <div className="text-slate-500 select-none">[SYSTEM] Ambang batas verifikasi ditetapkan ke skor &gt;= 4</div>
              
              {selectedResult.trace && selectedResult.trace.map((line: string, idx: number) => {
                const isCheck = line.startsWith('✓')
                const isCross = line.startsWith('✗')
                const isSatisfiedRule = line.includes('RULE TRUE')
                const isFailedRule = line.includes('RULE FALSE')

                let textColor = 'text-slate-300'
                if (isCheck) textColor = 'text-emerald-400 font-medium'
                if (isCross) textColor = 'text-rose-400'
                if (isSatisfiedRule) textColor = 'text-emerald-300 font-bold bg-emerald-950/40 py-0.5 px-1 rounded border border-emerald-900/50'
                if (isFailedRule) textColor = 'text-rose-400 font-bold bg-rose-950/40 py-0.5 px-1 rounded border border-rose-900/50'

                return (
                  <div key={idx} className={`flex items-start gap-3 leading-relaxed ${textColor}`}>
                    <span className="text-slate-600 select-none font-mono w-14 text-right">
                      {String(idx + 1).padStart(2, '0')}:
                    </span>
                    <span className="flex-1 whitespace-pre-wrap">{line}</span>
                  </div>
                )
              })}
              
              <div className="text-slate-500 select-none">[SYSTEM] Siklus evaluasi selesai untuk {selectedResult.criterion_code} ({selectedResult.criterion_label})</div>
            </div>
          </div>
        </section>

        {/* Back Link */}
        <div className="mt-12 text-center no-print">
          <Link
            to={isAdmin ? "/admin/assessments" : "/assessment/start"}
            className="inline-flex items-center gap-2 text-[#3525cd] hover:text-[#4f46e5] font-semibold text-base transition-colors"
          >
            <span className="material-symbols-outlined">{isAdmin ? "arrow_back" : "restart_alt"}</span>
            {isAdmin ? "Kembali ke Panel Admin" : "Mulai Penilaian Baru"}
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
