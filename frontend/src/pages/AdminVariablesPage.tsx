import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../components/layout/AdminSidebar'
import { API_BASE } from '../config'

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

  // Create Variable Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newCode, setNewCode] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [newCategory, setNewCategory] = useState('General Intellectual')
  const [newAgeGroup, setNewAgeGroup] = useState('preschool')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [successToast, setSuccessToast] = useState<string | null>(null)

  const handleCreateVariable = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitLoading(true)
    const token = localStorage.getItem('admin_token')
    try {
      const res = await fetch(`${API_BASE}/api/admin/variables`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code: newCode.trim(),
          label: newLabel.trim(),
          category: newCategory,
          age_group: newAgeGroup
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Gagal menambahkan variabel.')
      }

      const created = await res.json()
      setVariables([created, ...variables])
      setIsModalOpen(false)
      setNewCode('')
      setNewLabel('')
      
      setSuccessToast('Variabel baru berhasil ditambahkan!')
      setTimeout(() => setSuccessToast(null), 4000)
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan.')
    } finally {
      setSubmitLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'Manajemen Variabel | TalentaKu Admin'

    const token = localStorage.getItem('admin_token')
    if (!token) {
      navigate('/admin/login')
      return
    }

    async function fetchVariables() {
      try {
        const res = await fetch(`${API_BASE}/api/variables`)
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
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#3525cd] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:brightness-110 shadow-md active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Tambah Variabel
          </button>
        </header>

        {/* Success Toast */}
        {successToast && (
          <div className="absolute top-20 right-10 z-[110] bg-emerald-600 text-white px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-2 text-sm animate-bounce">
            <span className="material-symbols-outlined">check_circle</span>
            <span>{successToast}</span>
          </div>
        )}

        {loading ? (
          <div className="flex-grow flex flex-col p-4 md:p-10 space-y-6">
            <div className="flex justify-between items-center gap-4">
              <div className="h-4 w-64 bg-slate-100 rounded"></div>
              <div className="h-8 w-48 bg-slate-100 rounded-xl"></div>
            </div>
            <phantom-ui loading="true" className="flex-grow block">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white border border-[#c7c4d8]/40 rounded-2xl p-6 space-y-3 shadow-sm">
                    <div className="flex justify-between items-center">
                      <div className="h-6 w-12 bg-slate-100 rounded"></div>
                      <div className="h-4 w-28 bg-slate-100 rounded-full"></div>
                    </div>
                    <div className="h-4 w-full bg-slate-100 rounded"></div>
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

        {/* Create Variable Modal */}
        {isModalOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <div 
              className="bg-white rounded-[2rem] max-w-lg w-full p-8 shadow-2xl border border-[#c7c4d8]/40 animate-in fade-in zoom-in duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-[#c7c4d8]/20 pb-4 mb-6">
                <h3 className="text-xl font-bold text-[#3525cd]">Tambah Variabel Masukan</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-[#464555] hover:text-[#3525cd]">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <form onSubmit={handleCreateVariable} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#464555] block mb-1">Kode Variabel</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: C84, T13, E25"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs outline-none bg-white shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#464555] block mb-1">Kategori</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs outline-none bg-white shadow-sm font-semibold text-[#464555]"
                  >
                    <option value="General Intellectual">Intelektual Umum (K1)</option>
                    <option value="Specific Academic">Akademik Khusus (K2)</option>
                    <option value="Creative Thinking">Berpikir Kreatif (K3)</option>
                    <option value="Leadership">Kepemimpinan (K4)</option>
                    <option value="Visual & Performing Arts">Seni Rupa & Visual (K5)</option>
                    <option value="Psychomotor">Psikomotorik (K6)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#464555] block mb-1">Grup Usia</label>
                  <select
                    value={newAgeGroup}
                    onChange={(e) => setNewAgeGroup(e.target.value)}
                    className="w-full px-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs outline-none bg-white shadow-sm font-semibold text-[#464555]"
                  >
                    <option value="toddler">Batita (Toddler)</option>
                    <option value="preschool">Prasekolah / TK (Preschool)</option>
                    <option value="early_elementary">SD Awal (Early Elementary)</option>
                    <option value="late_elementary">SD Akhir (Late Elementary)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#464555] block mb-1">Teks Pertanyaan Observasi</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Contoh: Apakah anak dapat melakukan sesuatu..."
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    className="w-full px-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs outline-none bg-white shadow-sm resize-none"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-[#c7c4d8]/20">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-[#c7c4d8]/40 rounded-xl text-xs font-semibold text-[#464555] hover:bg-[#eceef0]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="px-4 py-2 bg-[#3525cd] text-white rounded-xl text-xs font-semibold hover:brightness-110 shadow-sm active:scale-95 transition-all disabled:opacity-50"
                  >
                    {submitLoading ? 'Menyimpan...' : 'Simpan Variabel'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
