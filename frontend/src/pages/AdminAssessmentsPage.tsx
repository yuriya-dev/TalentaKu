import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AdminSidebar from '../components/layout/AdminSidebar'

interface AssessmentItem {
  id: number
  child_name: string
  child_age: number
  child_gender: string
  child_school: string
  status: string
  created_at: string
  top_talent: string
  confidence_score: number
}

export default function AdminAssessmentsPage() {
  const navigate = useNavigate()
  const [assessments, setAssessments] = useState<AssessmentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    document.title = 'Daftar Asesmen | TalentaKu Admin'

    const token = localStorage.getItem('admin_token')
    if (!token) {
      navigate('/admin/login')
      return
    }

    async function fetchAssessments() {
      try {
        const res = await fetch('http://localhost:8080/api/consultations', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (!res.ok) {
          throw new Error('Gagal memuat riwayat asesmen.')
        }
        const data = await res.json()
        setAssessments(data)
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan saat memuat data.')
      } finally {
        setLoading(false)
      }
    }

    fetchAssessments()
  }, [navigate])

  const filteredAssessments = assessments.filter(
    (item) =>
      item.child_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.child_school.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.top_talent.toLowerCase().includes(searchQuery.toLowerCase())
  )

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

  return (
    <div className="flex h-screen overflow-hidden font-sans text-[#191c1e] bg-[#f8fafc]">
      <AdminSidebar />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top App Bar */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center w-full px-4 md:px-10 py-4 shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-[#3525cd]">Daftar Sesi Asesmen</h2>
            <div className="hidden md:flex gap-6 ml-8">
              <span className="text-sm font-semibold text-[#464555] py-1 cursor-default">
                Total {filteredAssessments.length} Sesi Terdaftar
              </span>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex-grow flex flex-col p-4 md:p-10 space-y-6">
            <div className="flex justify-between items-center gap-4">
              <div className="h-4 w-64 bg-slate-100 rounded"></div>
              <div className="h-8 w-48 bg-slate-100 rounded-xl"></div>
            </div>
            <phantom-ui loading="true" className="flex-1 block">
              <div className="bg-white border border-[#c7c4d8]/40 rounded-[2rem] overflow-hidden shadow-sm flex flex-col p-8 space-y-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b border-[#c7c4d8]/10 last:border-none">
                    <div className="flex items-center gap-6 flex-grow">
                      <div className="h-6 w-12 bg-slate-100 rounded"></div>
                      <div className="space-y-2 flex-grow max-w-md">
                        <div className="h-5 w-40 bg-slate-100 rounded"></div>
                        <div className="h-4 w-60 bg-slate-100 rounded"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-8 shrink-0">
                      <div className="h-6 w-28 bg-slate-100 rounded-full"></div>
                      <div className="h-10 w-24 bg-slate-100 rounded-xl"></div>
                    </div>
                  </div>
                ))}
              </div>
            </phantom-ui>
          </div>
        ) : error ? (
          <div className="flex-grow p-10 flex items-center justify-center">
            <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-6 text-red-800 text-sm flex gap-3 max-w-xl shadow-sm">
              <span className="material-symbols-outlined text-red-600 shrink-0">error</span>
              <div>
                <h5 className="font-bold mb-1">Gagal Memuat Data</h5>
                <p className="opacity-95">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-10 space-y-6">
            <div className="flex justify-between items-center gap-4">
              <div className="text-xs text-[#464555] font-semibold">
                Daftar lengkap sesi konsultasi yang dilakukan oleh pengguna umum (orang tua/guru).
              </div>

              {/* Search input */}
              <div className="relative shrink-0 w-full md:w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#777587] text-lg">search</span>
                <input
                  className="pl-9 pr-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs outline-none bg-white w-full shadow-sm"
                  placeholder="Cari nama, sekolah, atau bakat..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Assessments Table */}
            <div className="flex-1 bg-white border border-[#c7c4d8]/40 rounded-[2rem] overflow-hidden shadow-sm flex flex-col min-h-0">
              <div className="overflow-y-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#f8fafc] text-xs font-bold text-[#464555] uppercase tracking-wider sticky top-0 z-10 border-b border-[#c7c4d8]/20">
                    <tr>
                      <th className="px-8 py-4 w-24">ID</th>
                      <th className="px-8 py-4">Nama Anak</th>
                      <th className="px-8 py-4">Sekolah</th>
                      <th className="px-8 py-4">Bakat Dominan</th>
                      <th className="px-8 py-4">Tingkat Keyakinan</th>
                      <th className="px-8 py-4 w-28">Status</th>
                      <th className="px-8 py-4 w-32">Tanggal</th>
                      <th className="px-8 py-4 w-24">Detail</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c7c4d8]/20">
                    {filteredAssessments.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-8 py-12 text-center text-sm text-[#464555]">
                          Tidak menemukan sesi asesmen yang cocok.
                        </td>
                      </tr>
                    ) : (
                      filteredAssessments.map((item) => {
                        const isCompleted = item.status === 'COMPLETED'
                        return (
                          <tr key={item.id} className="hover:bg-[#3525cd]/5 transition-colors">
                            <td className="px-8 py-4 font-mono text-sm font-bold text-[#3525cd]">#AS-{item.id}</td>
                            <td className="px-8 py-4">
                              <div className="font-semibold text-[#191c1e] text-sm">{item.child_name}</div>
                              <div className="text-[10px] text-[#777587] mt-0.5">{getAgeGroupLabel(item.child_age)}</div>
                            </td>
                            <td className="px-8 py-4 text-xs font-medium text-[#464555]">{item.child_school}</td>
                            <td className="px-8 py-4">
                              <span className="px-3 py-1 bg-[#3525cd]/10 text-[#3525cd] rounded-full text-xs font-semibold">
                                {isCompleted ? item.top_talent : 'Belum Selesai'}
                              </span>
                            </td>
                            <td className="px-8 py-4 font-bold text-sm text-[#3525cd]">
                              {isCompleted ? `${Math.round(item.confidence_score)}%` : '-'}
                            </td>
                            <td className="px-8 py-4">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase shadow-sm ${
                                  isCompleted
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {isCompleted ? 'Selesai' : 'Proses'}
                              </span>
                            </td>
                            <td className="px-8 py-4 text-[#464555] text-xs font-semibold">{formatDate(item.created_at)}</td>
                            <td className="px-8 py-4">
                              <Link
                                to={isCompleted ? `/results/${item.id}` : `/assessment/1`}
                                className="p-2 text-[#777587] hover:text-[#3525cd] hover:bg-[#3525cd]/5 rounded-lg transition-colors inline-block"
                                title="Lihat detail asesmen"
                              >
                                <span className="material-symbols-outlined text-lg">visibility</span>
                              </Link>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
