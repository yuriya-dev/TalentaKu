import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../components/layout/AdminSidebar'

interface Variable {
  code: string
  label: string
  category: string
  age_group: string
}

export default function AdminVariablesPage() {
  const navigate = useNavigate()
  const [variables, setVariables] = useState<Variable[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')

  useEffect(() => {
    document.title = 'Manajemen Variabel | TalentaKu Admin'

    const token = localStorage.getItem('admin_token')
    if (!token) {
      navigate('/admin/login')
      return
    }

    async function fetchVariables() {
      try {
        const res = await fetch('http://localhost:8080/api/variables')
        if (!res.ok) {
          throw new Error('Gagal mengambil data variabel dari backend.')
        }
        const data = await res.json()
        setVariables(data)
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan sistem.')
      } finally {
        setLoading(false)
      }
    }

    fetchVariables()
  }, [navigate])

  const categories = [
    { code: 'ALL', label: 'Semua Kategori' },
    { code: 'General Intellectual', label: 'Intelektual Umum (K1)' },
    { code: 'Specific Academic', label: 'Akademik Khusus (K2)' },
    { code: 'Creative Thinking', label: 'Berpikir Kreatif (K3)' },
    { code: 'Leadership', label: 'Kepemimpinan (K4)' },
    { code: 'Visual & Performing Arts', label: 'Seni Rupa & Visual (K5)' },
    { code: 'Psychomotor', label: 'Psikomotorik (K6)' },
  ]

  const filteredVariables = variables.filter((v) => {
    const matchesSearch =
      v.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.label.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategory === 'ALL' ||
      v.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (selectedCategory === 'Visual & Performing Arts' &&
        (v.category.toLowerCase().includes('visual') || v.category.toLowerCase().includes('performing')))

    return matchesSearch && matchesCategory
  })

  return (
    <div className="flex h-screen overflow-hidden font-sans text-[#191c1e] bg-[#f8fafc]">
      <AdminSidebar />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top App Bar */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center w-full px-4 md:px-10 py-4 shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-[#3525cd]">Variabel Masukan</h2>
            <div className="hidden md:flex gap-6 ml-8">
              <span className="text-sm font-semibold text-[#464555] py-1 cursor-default">
                Total {filteredVariables.length} Variabel
              </span>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex-grow flex flex-col items-center justify-center gap-4">
            <span className="material-symbols-outlined text-4xl text-[#3525cd] animate-spin">sync</span>
            <p className="text-sm text-[#464555]">Memuat data variabel...</p>
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
              {/* Category Filter Select */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.code}
                    onClick={() => setSelectedCategory(cat.code)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all ${
                      selectedCategory === cat.code
                        ? 'bg-[#3525cd] text-white'
                        : 'bg-white border border-[#c7c4d8]/40 text-[#464555] hover:bg-[#eceef0]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative shrink-0 w-full md:w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#777587] text-lg">search</span>
                <input
                  className="pl-9 pr-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs outline-none bg-white w-full shadow-sm"
                  placeholder="Cari variabel..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Variables Table */}
            <div className="flex-1 bg-white border border-[#c7c4d8]/40 rounded-[2rem] overflow-hidden shadow-sm flex flex-col min-h-0">
              <div className="overflow-y-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#f8fafc] text-xs font-bold text-[#464555] uppercase tracking-wider sticky top-0 z-10 border-b border-[#c7c4d8]/20">
                    <tr>
                      <th className="px-8 py-4 w-24">Kode</th>
                      <th className="px-8 py-4 w-48">Kategori</th>
                      <th className="px-8 py-4">Teks Pertanyaan Observasi</th>
                      <th className="px-8 py-4 w-32">Grup Usia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c7c4d8]/20">
                    {filteredVariables.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-8 py-12 text-center text-sm text-[#464555]">
                          Tidak menemukan variabel yang cocok.
                        </td>
                      </tr>
                    ) : (
                      filteredVariables.map((v) => (
                        <tr key={v.code} className="hover:bg-[#3525cd]/5 transition-colors">
                          <td className="px-8 py-4 font-mono text-sm font-bold text-[#3525cd]">{v.code}</td>
                          <td className="px-8 py-4 text-xs font-semibold text-[#00687a]">{v.category}</td>
                          <td className="px-8 py-4 text-sm text-[#191c1e] font-medium leading-relaxed">{v.label}</td>
                          <td className="px-8 py-4">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded-md text-[10px] font-bold uppercase tracking-wider">
                              {v.age_group}
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
