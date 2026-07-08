import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../components/layout/AdminSidebar'
import ClayConfirmModal from '../components/ClayConfirmModal'
import { API_BASE } from '../config'

interface Criterion {
  code: string
  label: string
  description: string
  suggestions: string
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

export default function AdminCriteriaPage() {
  const navigate = useNavigate()
  const [criteria, setCriteria] = useState<Criterion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Detail Drawer/Modal State
  const [selectedCriterion, setSelectedCriterion] = useState<Criterion | null>(null)

  // Create/Edit Criterion Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [newCode, setNewCode] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newSuggestions, setNewSuggestions] = useState('')
  const [newAgeGroup, setNewAgeGroup] = useState('preschool')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [successToast, setSuccessToast] = useState<string | null>(null)

  // Reusable Clay Confirm Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [criterionToDelete, setCriterionToDelete] = useState<string | null>(null)

  // Filters & Pagination States
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('ALL')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 10

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedAgeGroup])

  const handleEditClick = (crit: Criterion) => {
    setIsEditMode(true)
    setNewCode(crit.code)
    setNewLabel(crit.label)
    setNewDescription(crit.description)
    setNewSuggestions(crit.suggestions)
    setNewAgeGroup(crit.age_group)
    setIsModalOpen(true)
  }

  const handleOpenCreateModal = () => {
    setIsEditMode(false)
    setNewCode('')
    setNewLabel('')
    setNewDescription('')
    setNewSuggestions('')
    setNewAgeGroup('preschool')
    setIsModalOpen(true)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitLoading(true)
    const token = localStorage.getItem('admin_token')
    
    const url = isEditMode
      ? `${API_BASE}/api/admin/criteria/${newCode}`
      : `${API_BASE}/api/admin/criteria`
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
          description: newDescription.trim(),
          suggestions: newSuggestions.trim(),
          age_group: newAgeGroup
        })
      })

      if (!res.ok) {
        let errorMsg = `Gagal ${isEditMode ? 'mengubah' : 'menambahkan'} kriteria evaluasi.`
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
        setCriteria(criteria.map(crit => crit.code === saved.code ? saved : crit))
        setSuccessToast('Kriteria evaluasi berhasil diperbarui!')
      } else {
        setCriteria([saved, ...criteria])
        setSuccessToast('Kriteria evaluasi baru berhasil ditambahkan!')
      }
      
      setIsModalOpen(false)
      setNewCode('')
      setNewLabel('')
      setNewDescription('')
      setNewSuggestions('')
      setTimeout(() => setSuccessToast(null), 4000)
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan.')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDeleteClick = (code: string) => {
    setCriterionToDelete(code)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!criterionToDelete) return
    setSubmitLoading(true)
    const token = localStorage.getItem('admin_token')
    try {
      const res = await fetch(`${API_BASE}/api/admin/criteria/${criterionToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!res.ok) {
        let errorMsg = 'Gagal menghapus kriteria.'
        const contentType = res.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json()
          errorMsg = data.error || errorMsg
        } else {
          errorMsg = await res.text()
        }
        throw new Error(errorMsg)
      }

      setCriteria(criteria.filter((crit) => crit.code !== criterionToDelete))
      setSuccessToast('Kriteria berhasil dihapus!')
      setIsDeleteModalOpen(false)
      setCriterionToDelete(null)
      setTimeout(() => setSuccessToast(null), 4000)
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan.')
    } finally {
      setSubmitLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'Manajemen Kriteria | TalentaKu Admin'

    const token = localStorage.getItem('admin_token')
    if (!token) {
      navigate('/admin/login')
      return
    }

    async function fetchCriteria() {
      try {
        const res = await fetch(`${API_BASE}/api/admin/rules`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (!res.ok) {
          throw new Error('Gagal mengambil data kriteria dari backend.')
        }
        const data = await res.json()
        setCriteria(data.criteria || [])
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan sistem.')
      } finally {
        setLoading(false)
      }
    }

    fetchCriteria()
  }, [navigate])

  const filteredCriteria = criteria.filter((crit) => {
    const matchesSearch =
      crit.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crit.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crit.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesAgeGroup =
      selectedAgeGroup === 'ALL' ||
      crit.age_group === selectedAgeGroup

    return matchesSearch && matchesAgeGroup
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredCriteria.length / itemsPerPage)
  const paginatedCriteria = filteredCriteria.slice(
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
            <h2 className="text-2xl font-bold text-[#3525cd]">Kriteria Evaluasi</h2>
            <div className="hidden md:flex gap-6 ml-8">
              <span className="text-sm font-semibold text-[#464555] py-1 cursor-default">
                Total {filteredCriteria.length} Kriteria
              </span>
            </div>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 bg-[#3525cd] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:brightness-110 shadow-md active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Tambah Kriteria
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white border border-[#c7c4d8]/40 rounded-2xl p-6 space-y-3 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl shrink-0"></div>
                    <div className="space-y-2 flex-grow">
                      <div className="h-4 w-16 bg-slate-100 rounded"></div>
                      <div className="h-4 w-full bg-slate-100 rounded"></div>
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
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="text-xs text-[#464555] font-semibold self-center">
                Kriteria evaluasi merepresentasikan klasifikasi kecenderungan atau potensi bakat anak (K1-K6).
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
                    placeholder="Cari kriteria..."
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Criteria Table */}
            <div className="flex-1 bg-white border border-[#c7c4d8]/40 rounded-[2rem] overflow-hidden shadow-sm flex flex-col min-h-0">
              <div className="overflow-y-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#f8fafc] text-xs font-bold text-[#464555] uppercase tracking-wider sticky top-0 z-10 border-b border-[#c7c4d8]/20">
                    <tr>
                      <th className="px-8 py-4 w-32">Kode</th>
                      <th className="px-8 py-4 w-64">Nama Kriteria</th>
                      <th className="px-8 py-4">Deskripsi Penjelasan</th>
                      <th className="px-8 py-4 w-32">Grup Usia</th>
                      <th className="px-8 py-4 w-28 text-right">&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c7c4d8]/20">
                    {paginatedCriteria.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-8 py-12 text-center text-sm text-[#464555]">
                          Tidak menemukan kriteria yang cocok.
                        </td>
                      </tr>
                    ) : (
                      paginatedCriteria.map((crit) => (
                        <tr 
                          key={crit.code} 
                          className="hover:bg-[#3525cd]/5 transition-colors cursor-pointer group"
                          onClick={() => setSelectedCriterion(crit)}
                        >
                          <td className="px-8 py-4 font-mono text-sm font-bold text-[#3525cd]">{crit.code}</td>
                          <td className="px-8 py-4 text-sm text-[#191c1e] font-bold leading-relaxed">{crit.label}</td>
                          <td className="px-8 py-4 text-xs text-[#464555] max-w-md truncate">{crit.description}</td>
                          <td className="px-8 py-4">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded-md text-[10px] font-bold uppercase tracking-wider">
                              {crit.age_group}
                            </span>
                          </td>
                          <td className="px-8 py-4 text-right flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setSelectedCriterion(crit)}
                              className="inline-flex w-8 h-8 rounded-full bg-slate-100 hover:bg-[#3525cd] hover:text-white text-[#464555] items-center justify-center transition-all duration-200 shadow-sm opacity-0 group-hover:opacity-100"
                              title="Lihat Detail"
                            >
                              <span className="material-symbols-outlined text-[16px]">visibility</span>
                            </button>
                            <button
                              onClick={() => handleEditClick(crit)}
                              className="inline-flex w-8 h-8 rounded-full bg-slate-100 hover:bg-[#3525cd] hover:text-white text-[#464555] items-center justify-center transition-all duration-200 shadow-sm opacity-0 group-hover:opacity-100"
                              title="Edit Kriteria"
                            >
                              <span className="material-symbols-outlined text-[16px]">edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteClick(crit.code)}
                              className="inline-flex w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-600 hover:text-white text-[#464555] items-center justify-center transition-all duration-200 shadow-sm opacity-0 group-hover:opacity-100"
                              title="Hapus Kriteria"
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
                  Menampilkan {paginatedCriteria.length} dari {filteredCriteria.length} kriteria
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

        {/* Create/Edit Criterion Modal */}
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
                <h3 className="text-xl font-bold text-[#3525cd]">{isEditMode ? 'Edit Kriteria Evaluasi' : 'Tambah Kriteria Evaluasi'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-[#464555] hover:text-[#3525cd]">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <form onSubmit={handleFormSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                <div>
                  <label className="text-xs font-bold text-[#464555] block mb-1">Kode Kriteria</label>
                  <input
                    type="text"
                    required
                    disabled={isEditMode}
                    placeholder="Contoh: K7, TK7, EK7, LK7"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs outline-none bg-white shadow-sm font-semibold disabled:bg-slate-100 disabled:text-slate-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#464555] block mb-1">Nama Kriteria Evaluasi</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kecerdasan Logika Lanjut"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    className="w-full px-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs outline-none bg-white shadow-sm font-semibold"
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
                <div>
                  <label className="text-xs font-bold text-[#464555] block mb-1">Deskripsi Kriteria</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Deskripsi penjelasan mengenai kriteria bakat/evaluasi ini..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs outline-none bg-white shadow-sm resize-none font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#464555] block mb-1">Saran Pengembangan / Aktivitas</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Saran tindakan nyata atau aktivitas pengembangan untuk anak..."
                    value={newSuggestions}
                    onChange={(e) => setNewSuggestions(e.target.value)}
                    className="w-full px-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs outline-none bg-white shadow-sm resize-none font-semibold"
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
                    {submitLoading ? 'Menyimpan...' : isEditMode ? 'Perbarui Kriteria' : 'Simpan Kriteria'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Details Drawer/Modal */}
        {selectedCriterion && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4"
            onClick={() => setSelectedCriterion(null)}
          >
            <div 
              className="bg-white rounded-[2rem] max-w-2xl w-full p-8 shadow-2xl border border-[#c7c4d8]/40 animate-in fade-in zoom-in duration-200 flex flex-col max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start border-b border-[#c7c4d8]/20 pb-4 mb-6">
                <div>
                  <span className="font-mono text-xs font-bold text-[#3525cd] uppercase tracking-wider block">Detail Kriteria</span>
                  <h3 className="text-2xl font-bold text-[#191c1e] mt-1">{selectedCriterion.code} - {selectedCriterion.label}</h3>
                </div>
                <button 
                  onClick={() => setSelectedCriterion(null)} 
                  className="text-[#464555] hover:text-[#3525cd] w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-all"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                <div>
                  <label className="text-[10px] font-bold text-[#777587] uppercase tracking-wider block mb-1">Grup Usia Sasaran</label>
                  <span className="inline-block px-3 py-1 bg-[#3525cd]/10 text-[#3525cd] rounded-xl text-xs font-bold uppercase tracking-wider">
                    {selectedCriterion.age_group}
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#777587] uppercase tracking-wider block">Deskripsi Detail Kriteria</label>
                  <div className="p-4 bg-slate-50 border border-[#c7c4d8]/20 rounded-2xl text-sm leading-relaxed text-[#191c1e] font-medium">
                    {selectedCriterion.description}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#777587] uppercase tracking-wider block">Saran Aktivitas / Tips Pengembangan</label>
                  <div className="p-4 bg-[#00687a]/5 border border-[#00687a]/15 rounded-2xl text-sm leading-relaxed text-[#004e5c] font-medium whitespace-pre-line">
                    {selectedCriterion.suggestions}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-[#c7c4d8]/20 mt-6">
                <button
                  onClick={() => setSelectedCriterion(null)}
                  className="px-6 py-2.5 bg-[#3525cd] text-white rounded-xl text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-md"
                >
                  Tutup Detail
                </button>
              </div>
            </div>
          </div>
        )}

        <ClayConfirmModal
          isOpen={isDeleteModalOpen}
          title="Hapus Kriteria"
          message={`Apakah Anda yakin ingin menghapus kriteria "${criterionToDelete}"? Semua relasi aturan L2 terkait juga akan dihapus.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setIsDeleteModalOpen(false)
            setCriterionToDelete(null)
          }}
          isLoading={submitLoading}
        />
      </main>
    </div>
  )
}
