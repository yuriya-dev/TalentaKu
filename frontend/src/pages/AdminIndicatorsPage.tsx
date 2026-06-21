import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../components/layout/AdminSidebar'

interface Indicator {
  code: string
  label: string
  age_group: string
}

export default function AdminIndicatorsPage() {
  const navigate = useNavigate()
  const [indicators, setIndicators] = useState<Indicator[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    document.title = 'Manajemen Indikator | TalentaKu Admin'

    const token = localStorage.getItem('admin_token')
    if (!token) {
      navigate('/admin/login')
      return
    }

    async function fetchIndicators() {
      try {
        // Fetch rules endpoint contains variables, indicators, and relations.
        const res = await fetch('http://localhost:8080/api/admin/rules', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (!res.ok) {
          throw new Error('Gagal mengambil data indikator dari backend.')
        }
        const data = await res.json()
        setIndicators(data.indicators || [])
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan sistem.')
      } finally {
        setLoading(false)
      }
    }

    fetchIndicators()
  }, [navigate])

  const filteredIndicators = indicators.filter((ind) => {
    return (
      ind.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ind.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <div className="flex h-screen overflow-hidden font-sans text-[#191c1e] bg-[#f8fafc]">
      <AdminSidebar />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top App Bar */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center w-full px-4 md:px-10 py-4 shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-[#3525cd]">Indikator Bakat</h2>
            <div className="hidden md:flex gap-6 ml-8">
              <span className="text-sm font-semibold text-[#464555] py-1 cursor-default">
                Total {filteredIndicators.length} Indikator
              </span>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex-grow flex flex-col items-center justify-center gap-4">
            <span className="material-symbols-outlined text-4xl text-[#3525cd] animate-spin">sync</span>
            <p className="text-sm text-[#464555]">Memuat data indikator...</p>
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
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="text-xs text-[#464555] font-semibold self-center">
                Indikator bakat dihasilkan dari kombinasi variabel level 1 yang terpenuhi.
              </div>

              {/* Search input */}
              <div className="relative shrink-0 w-full md:w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#777587] text-lg">search</span>
                <input
                  className="pl-9 pr-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs outline-none bg-white w-full shadow-sm"
                  placeholder="Cari indikator..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Indicators Table */}
            <div className="flex-1 bg-white border border-[#c7c4d8]/40 rounded-[2rem] overflow-hidden shadow-sm flex flex-col min-h-0">
              <div className="overflow-y-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#f8fafc] text-xs font-bold text-[#464555] uppercase tracking-wider sticky top-0 z-10 border-b border-[#c7c4d8]/20">
                    <tr>
                      <th className="px-8 py-4 w-32">Kode Indikator</th>
                      <th className="px-8 py-4">Nama Indikator Bakat</th>
                      <th className="px-8 py-4 w-32">Grup Usia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c7c4d8]/20">
                    {filteredIndicators.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-8 py-12 text-center text-sm text-[#464555]">
                          Tidak menemukan indikator yang cocok.
                        </td>
                      </tr>
                    ) : (
                      filteredIndicators.map((ind) => (
                        <tr key={ind.code} className="hover:bg-[#3525cd]/5 transition-colors">
                          <td className="px-8 py-4 font-mono text-sm font-bold text-[#3525cd]">{ind.code}</td>
                          <td className="px-8 py-4 text-sm text-[#191c1e] font-semibold leading-relaxed">{ind.label}</td>
                          <td className="px-8 py-4">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded-md text-[10px] font-bold uppercase tracking-wider">
                              {ind.age_group}
                            </span>
                          </td>
                        </tr>
                      ))
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
