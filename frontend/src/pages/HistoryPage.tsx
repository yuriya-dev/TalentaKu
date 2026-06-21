import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import MobileNav from '../components/layout/MobileNav'

interface HistoryItem {
  id: number
  child_name: string
  child_age: number
  child_gender: string
  child_school: string
  status: string
  created_at: string
  completed_at?: string
  top_talent: string
  confidence_score: number
}

export default function HistoryPage() {
  const navigate = useNavigate()
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    document.title = 'Riwayat Asesmen | TalentaKu'
    window.scrollTo(0, 0)

    async function fetchHistory() {
      try {
        const res = await fetch('http://localhost:8080/api/consultations')
        if (!res.ok) {
          throw new Error('Gagal memuat riwayat asesmen.')
        }
        const data = await res.json()
        setHistory(data)
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan saat memuat data.')
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  function getAgeGroupLabel(age: number) {
    if (age <= 3) return 'Batita (3 Tahun)'
    if (age <= 6) return 'Prasekolah / TK (4 - 6 Tahun)'
    if (age <= 9) return 'SD Awal (7 - 9 Tahun)'
    return 'SD Akhir (10 - 12 Tahun)'
  }

  function formatDate(dateStr: string) {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  const filteredHistory = history.filter(
    (item) =>
      item.child_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.child_school.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.top_talent.toLowerCase().includes(searchQuery.toLowerCase())
  )

  function handleResume(id: number, name: string) {
    sessionStorage.setItem('consultation_id', id.toString())
    sessionStorage.setItem('child_name', name)
    navigate('/assessment/1')
  }

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] font-sans min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-12 pb-24 px-4 md:px-10 max-w-screen-xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#191c1e] mb-2">
              Asesmen Saya
            </h1>
            <p className="text-base text-[#464555]">
              Kelola dan pantau semua hasil penilaian potensi anak yang telah terdaftar.
            </p>
          </div>
          <Link
            to="/assessment/start"
            className="inline-flex items-center justify-center gap-2 bg-[#3525cd] text-white px-6 py-3.5 rounded-xl text-sm font-semibold shadow-lg shadow-[#3525cd]/20 hover:bg-[#4f46e5] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            Mulai Asesmen Baru
          </Link>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#c7c4d8]/40 shadow-sm flex items-center gap-3 mb-8">
          <span className="material-symbols-outlined text-[#777587]">search</span>
          <input
            type="text"
            className="w-full bg-transparent border-none outline-none text-sm text-[#191c1e] placeholder-[#777587]"
            placeholder="Cari berdasarkan nama anak, sekolah, atau hasil bakat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <span className="material-symbols-outlined text-4xl text-[#3525cd] animate-spin">sync</span>
            <p className="text-sm text-[#464555]">Memuat riwayat asesmen...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-6 text-red-800 text-sm flex gap-3 max-w-xl mx-auto shadow-sm">
            <span className="material-symbols-outlined text-red-600">error</span>
            <div>
              <h5 className="font-bold mb-1">Gagal Memuat Data</h5>
              <p className="opacity-95">{error}</p>
            </div>
          </div>
        )}

        {/* History List */}
        {!loading && !error && (
          <>
            {filteredHistory.length === 0 ? (
              <div className="bg-white border border-[#c7c4d8]/40 rounded-3xl p-16 text-center shadow-sm max-w-xl mx-auto">
                <span className="material-symbols-outlined text-6xl text-[#777587] mb-4">history</span>
                <h3 className="text-xl font-bold mb-2">Belum Ada Riwayat</h3>
                <p className="text-sm text-[#464555] mb-6">
                  {searchQuery
                    ? 'Tidak menemukan hasil pencarian yang cocok.'
                    : 'Anda belum pernah melakukan asesmen potensi anak.'}
                </p>
                <Link
                  to="/assessment/start"
                  className="bg-[#3525cd] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#4f46e5] transition-all inline-flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">play_circle</span>
                  Mulai Asesmen Pertama
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHistory.map((item) => {
                  const isCompleted = item.status === 'COMPLETED'
                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-[#c7c4d8]/40 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        {/* Title and Badges */}
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#3525cd] text-2xl">child_care</span>
                            <div>
                              <h4 className="font-bold text-lg leading-tight text-[#191c1e]">
                                {item.child_name}
                              </h4>
                              <p className="text-xs text-[#777587] mt-0.5">
                                {getAgeGroupLabel(item.child_age)}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase shadow-sm ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {isCompleted ? 'Selesai' : 'Proses'}
                          </span>
                        </div>

                        {/* Metadata Details */}
                        <div className="space-y-2 text-xs text-[#464555] pt-2 border-t border-[#c7c4d8]/20">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] text-[#777587]">school</span>
                            <span>{item.child_school}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] text-[#777587]">calendar_today</span>
                            <span>Dibuat: {formatDate(item.created_at)}</span>
                          </div>
                          {item.child_gender && (
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-[16px] text-[#777587]">
                                {item.child_gender === 'male' ? 'male' : 'female'}
                              </span>
                              <span className="capitalize">{item.child_gender === 'male' ? 'Laki-laki' : 'Perempuan'}</span>
                            </div>
                          )}
                        </div>

                        {/* Assessment Result Block */}
                        {isCompleted && (
                          <div className="mt-4 p-4 rounded-2xl bg-[#3525cd]/5 border border-[#3525cd]/15 space-y-1">
                            <span className="text-[10px] text-[#3525cd] font-bold uppercase tracking-wider block">
                              Bakat Dominan
                            </span>
                            <div className="flex justify-between items-baseline gap-2">
                              <span className="font-bold text-sm text-[#191c1e]">{item.top_talent}</span>
                              <span className="font-bold text-base text-[#3525cd]">
                                {Math.round(item.confidence_score)}%
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="pt-6 mt-6 border-t border-[#c7c4d8]/20 flex">
                        {isCompleted ? (
                          <Link
                            to={`/results/${item.id}`}
                            className="w-full text-center py-3 bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-semibold rounded-xl shadow-sm hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                          >
                            <span className="material-symbols-outlined text-base">emoji_events</span>
                            Lihat Hasil Asesmen
                          </Link>
                        ) : (
                          <button
                            onClick={() => handleResume(item.id, item.child_name)}
                            className="w-full text-center py-3 border border-[#3525cd] text-[#3525cd] hover:bg-[#3525cd]/5 text-xs font-semibold rounded-xl shadow-sm hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                          >
                            <span className="material-symbols-outlined text-base">play_arrow</span>
                            Lanjutkan Asesmen
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
      <MobileNav />
    </div>
  )
}
