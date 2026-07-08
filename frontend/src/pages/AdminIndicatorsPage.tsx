import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../components/layout/AdminSidebar'
import ClayConfirmModal from '../components/ClayConfirmModal'
import { API_BASE } from '../config'

interface Indicator {
  code: string
  label: string
  age_group: string
}

const getPageNumbers = (currentPage: number, totalPages: number) => {
  const pages: (number | string)[] = []
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    let start = Math.max(2, currentPage - 1)
    let end = Math.min(totalPages - 1, currentPage + 1)
    if (currentPage <= 3) {
      end = 4
    } else if (currentPage >= totalPages - 2) {
      start = totalPages - 3
    }
    if (start > 2) {
      pages.push('...')
    }
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    if (end < totalPages - 1) {
      pages.push('...')
    }
    pages.push(totalPages)
  }
  return pages
}

export default function AdminIndicatorsPage() {
  const navigate = useNavigate()
  const [indicators, setIndicators] = useState<Indicator[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Create/Edit Indicator Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [newCode, setNewCode] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [newAgeGroup, setNewAgeGroup] = useState('preschool')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [successToast, setSuccessToast] = useState<string | null>(null)

  // Reusable Clay Confirm Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [indicatorToDelete, setIndicatorToDelete] = useState<string | null>(null)

  // Filters & Pagination States
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('ALL')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 10

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedAgeGroup])

  const handleEditClick = (ind: Indicator) => {
    setIsEditMode(true)
    setNewCode(ind.code)
    setNewLabel(ind.label)
    setNewAgeGroup(ind.age_group)
    setIsModalOpen(true)
  }

  const handleOpenCreateModal = () => {
    setIsEditMode(false)
    setNewCode('')
    setNewLabel('')
    setNewAgeGroup('preschool')
    setIsModalOpen(true)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitLoading(true)
    const token = localStorage.getItem('admin_token')
    
    const url = isEditMode
      ? `${API_BASE}/api/admin/indicators/${newCode}`
      : `${API_BASE}/api/admin/indicators`
    const method = isEditMode ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code: newCode.trim(),
          label: newLabel.trim(),
          age_group: newAgeGroup
        })
      })

      if (!res.ok) {
        let errorMsg = `Gagal ${isEditMode ? 'mengubah' : 'menambahkan'} indikator.`
        const contentType = res.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json()
          errorMsg = data.error || errorMsg
        } else {
          errorMsg = await res.text()
        }
        throw new Error(errorMsg)
      }

      const saved = await res.json()
      if (isEditMode) {
        setIndicators(indicators.map(ind => ind.code === saved.code ? saved : ind))
        setSuccessToast('Indikator berhasil diperbarui!')
      } else {
        setIndicators([saved, ...indicators])
        setSuccessToast('Indikator baru berhasil ditambahkan!')
      }
      
      setIsModalOpen(false)
      setNewCode('')
      setNewLabel('')
      setTimeout(() => setSuccessToast(null), 4000)
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan.')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDeleteClick = (code: string) => {
    setIndicatorToDelete(code)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!indicatorToDelete) return
    setSubmitLoading(true)
    const token = localStorage.getItem('admin_token')
    try {
      const res = await fetch(`${API_BASE}/api/admin/indicators/${indicatorToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!res.ok) {
        let errorMsg = 'Gagal menghapus indikator.'
        const contentType = res.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json()
          errorMsg = data.error || errorMsg
        } else {
          errorMsg = await res.text()
        }
        throw new Error(errorMsg)
      }

      setIndicators(indicators.filter((ind) => ind.code !== indicatorToDelete))
      setSuccessToast('Indikator berhasil dihapus!')
      setIsDeleteModalOpen(false)
      setIndicatorToDelete(null)
      setTimeout(() => setSuccessToast(null), 4000)
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan.')
    } finally {
      setSubmitLoading(false)
    }
  }

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
        const res = await fetch(`${API_BASE}/api/admin/rules`, {
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
    const matchesSearch =
      ind.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ind.label.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesAgeGroup =
      selectedAgeGroup === 'ALL' ||
      ind.age_group === selectedAgeGroup

    return matchesSearch && matchesAgeGroup
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredIndicators.length / itemsPerPage)
  const paginatedIndicators = filteredIndicators.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

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
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 bg-[#3525cd] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:brightness-110 shadow-md active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Tambah Indikator
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
          <phantom-ui loading="true" className="flex-1 flex flex-col overflow-hidden p-4 md:p-10 space-y-6">
            {/* Filter Skeleton */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="h-4 w-64 bg-slate-100 rounded self-center"></div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
                <div className="h-8 w-44 bg-slate-100 rounded-xl"></div>
                <div className="h-8 w-64 bg-slate-100 rounded-xl"></div>
              </div>
            </div>

            {/* Table Skeleton */}
            <div className="flex-1 bg-white border border-[#c7c4d8]/40 rounded-[2rem] overflow-hidden shadow-sm flex flex-col min-h-0">
              <div className="overflow-y-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#f8fafc] text-xs font-bold text-[#464555] uppercase tracking-wider sticky top-0 z-10 border-b border-[#c7c4d8]/20">
                    <tr>
                      <th className="px-8 py-4 w-32">Kode Indikator</th>
                      <th className="px-8 py-4">Nama Indikator Bakat</th>
                      <th className="px-8 py-4 w-32">Grup Usia</th>
                      <th className="px-8 py-4 w-20 text-right">&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c7c4d8]/20">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <tr key={i}>
                        <td className="px-8 py-5">
                          <div className="h-4 w-16 bg-slate-100 rounded font-mono"></div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="h-4 w-full max-w-md bg-slate-100 rounded"></div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="h-5 w-20 bg-slate-100 rounded"></div>
                        </td>
                        <td className="px-8 py-5 text-right flex justify-end gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-100"></div>
                          <div className="w-8 h-8 rounded-full bg-slate-100"></div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Skeleton */}
              <div className="px-8 py-6 bg-white flex justify-between items-center border-t border-[#c7c4d8]/20 shrink-0">
                <div className="h-4 w-48 bg-slate-100 rounded"></div>
                <div className="flex items-center gap-1.5">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg"></div>
                  <div className="w-8 h-8 bg-slate-100 rounded-lg"></div>
                  <div className="w-8 h-8 bg-slate-100 rounded-lg"></div>
                  <div className="w-8 h-8 bg-slate-100 rounded-lg"></div>
                </div>
              </div>
            </div>
          </phantom-ui>
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
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="text-xs text-[#464555] font-semibold self-center">
                Indikator bakat dihasilkan dari kombinasi variabel level 1 yang terpenuhi.
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
                <select
                  value={selectedAgeGroup}
                  onChange={(e) => setSelectedAgeGroup(e.target.value)}
                  className="px-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs font-bold outline-none bg-white shadow-sm text-[#464555]"
                >
                  <option value="ALL">Semua Kelompok Usia</option>
                  <option value="toddler">Batita (Toddler)</option>
                  <option value="preschool">Prasekolah / TK (Preschool)</option>
                  <option value="early_elementary">SD Awal (Early Elementary)</option>
                  <option value="late_elementary">SD Akhir (Late Elementary)</option>
                </select>

                <div className="relative w-full sm:w-64">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 -translate-y-1 text-[#777587] text-lg">search</span>
                  <input
                    className="pl-9 pr-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs outline-none bg-white w-full shadow-sm"
                    placeholder="Cari indikator..."
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
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
                      <th className="px-8 py-4 w-20 text-right">&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c7c4d8]/20">
                    {paginatedIndicators.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-8 py-12 text-center text-sm text-[#464555]">
                          Tidak menemukan indikator yang cocok.
                        </td>
                      </tr>
                    ) : (
                      paginatedIndicators.map((ind) => (
                        <tr key={ind.code} className="hover:bg-[#3525cd]/5 transition-colors group">
                          <td className="px-8 py-4 font-mono text-sm font-bold text-[#3525cd]">{ind.code}</td>
                          <td className="px-8 py-4 text-sm text-[#191c1e] font-semibold leading-relaxed">{ind.label}</td>
                          <td className="px-8 py-4">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded-md text-[10px] font-bold uppercase tracking-wider">
                              {ind.age_group}
                            </span>
                          </td>
                          <td className="px-8 py-4 text-right flex justify-end gap-2">
                            <button
                              onClick={() => handleEditClick(ind)}
                              className="inline-flex w-8 h-8 rounded-full bg-slate-100 hover:bg-[#3525cd] hover:text-white text-[#464555] items-center justify-center transition-all duration-200 shadow-sm opacity-0 group-hover:opacity-100"
                              title="Edit Indikator"
                            >
                              <span className="material-symbols-outlined text-[16px]">edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteClick(ind.code)}
                              className="inline-flex w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-600 hover:text-white text-[#464555] items-center justify-center transition-all duration-200 shadow-sm opacity-0 group-hover:opacity-100"
                              title="Hapus Indikator"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-8 py-6 bg-white flex justify-between items-center border-t border-[#c7c4d8]/20 shrink-0">
                <span className="text-xs text-[#464555]">
                  Menampilkan {paginatedIndicators.length} dari {filteredIndicators.length} indikator
                </span>
                <div className="flex items-center gap-1.5">
                  {/* First Page */}
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="p-1 border border-[#c7c4d8]/50 rounded-lg hover:bg-[#eceef0] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all cursor-pointer flex items-center justify-center"
                    title="Halaman Pertama"
                  >
                    <span className="material-symbols-outlined text-sm font-bold">first_page</span>
                  </button>

                  {/* Previous Page */}
                  <button
                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1 border border-[#c7c4d8]/50 rounded-lg hover:bg-[#eceef0] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all cursor-pointer flex items-center justify-center"
                    title="Halaman Sebelumnya"
                  >
                    <span className="material-symbols-outlined text-sm font-bold">chevron_left</span>
                  </button>

                  {/* Page Numbers */}
                  {getPageNumbers(currentPage, totalPages).map((page, idx) => {
                    if (page === '...') {
                      return (
                        <span key={`dots-${idx}`} className="text-xs text-[#777587] px-1.5 font-bold cursor-default select-none">
                          ...
                        </span>
                      )
                    }
                    return (
                      <button
                        key={`page-${page}`}
                        onClick={() => setCurrentPage(page as number)}
                        className={`px-2.5 py-1 min-w-[32px] rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm ${
                          currentPage === page
                            ? 'bg-[#3525cd] text-white'
                            : 'bg-white border border-[#c7c4d8]/50 text-[#464555] hover:bg-[#eceef0]'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  })}

                  {/* Next Page */}
                  <button
                    onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1 border border-[#c7c4d8]/50 rounded-lg hover:bg-[#eceef0] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all cursor-pointer flex items-center justify-center"
                    title="Halaman Selanjutnya"
                  >
                    <span className="material-symbols-outlined text-sm font-bold">chevron_right</span>
                  </button>

                  {/* Last Page */}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-1 border border-[#c7c4d8]/50 rounded-lg hover:bg-[#eceef0] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all cursor-pointer flex items-center justify-center"
                    title="Halaman Terakhir"
                  >
                    <span className="material-symbols-outlined text-sm font-bold">last_page</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create/Edit Indicator Modal */}
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
                <h3 className="text-xl font-bold text-[#3525cd]">{isEditMode ? 'Edit Indikator Bakat' : 'Tambah Indikator Bakat'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-[#464555] hover:text-[#3525cd]">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#464555] block mb-1">Kode Indikator</label>
                  <input
                    type="text"
                    required
                    disabled={isEditMode}
                    placeholder="Contoh: I28, TI7, EI13, LI13"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs outline-none bg-white shadow-sm disabled:bg-slate-100 disabled:text-slate-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#464555] block mb-1">Nama Indikator Bakat</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kemampuan Verbal Lanjut"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    className="w-full px-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs outline-none bg-white shadow-sm"
                  />
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
                    {submitLoading ? 'Menyimpan...' : isEditMode ? 'Perbarui Indikator' : 'Simpan Indikator'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ClayConfirmModal
          isOpen={isDeleteModalOpen}
          title="Hapus Indikator"
          message={`Apakah Anda yakin ingin menghapus indikator "${indicatorToDelete}"? Semua relasi aturan L1 dan L2 terkait juga akan dihapus.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setIsDeleteModalOpen(false)
            setIndicatorToDelete(null)
          }}
          isLoading={submitLoading}
        />
      </main>
    </div>
  )
}
