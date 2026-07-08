import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../components/layout/AdminSidebar'
import { API_BASE } from '../config'

interface Suggestion {
  id: number
  user_name: string
  user_email: string
  category: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
}

const CATEGORY_COLORS: Record<string, string> = {
  'Variabel':       '#3525cd',
  'Indikator':      '#7c4dff',
  'Kriteria Bakat': '#d4760f',
  'Umum':           '#0077b6',
  'Lainnya':        '#5c6b1e',
}

function categoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? '#444'
}

export default function AdminSuggestionsPage() {
  const navigate = useNavigate()
  const token = localStorage.getItem('admin_token')

  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState('')
  const [filterRead, setFilterRead] = useState('')
  const [selected, setSelected] = useState<Suggestion | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  const fetchSuggestions = async () => {
    if (!token) return
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterCategory) params.set('category', filterCategory)
      if (filterRead !== '') params.set('is_read', filterRead)

      const res = await fetch(`${API_BASE}/api/admin/suggestions?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setSuggestions(data.suggestions ?? [])
      setUnreadCount(data.unread_count ?? 0)
    } finally {
      setLoading(false)
    }
  }

  const markRead = async (id: number) => {
    if (!token) return
    await fetch(`${API_BASE}/api/admin/suggestions/${id}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })
    setSuggestions((prev) => prev.map((s) => s.id === id ? { ...s, is_read: true } : s))
    setUnreadCount((c) => Math.max(0, c - 1))
    if (selected?.id === id) setSelected({ ...selected, is_read: true })
  }

  const deleteSuggestion = async (id: number) => {
    if (!token) return
    await fetch(`${API_BASE}/api/admin/suggestions/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    setSuggestions((prev) => prev.filter((s) => s.id !== id))
    if (selected?.id === id) setSelected(null)
    showToast('Saran berhasil dihapus.')
  }

  const openDetail = (s: Suggestion) => {
    setSelected(s)
    if (!s.is_read) markRead(s.id)
  }

  useEffect(() => {
    document.title = 'Saran & Masukan | Admin TalentaKu'
    if (!token) { navigate('/admin/login'); return }
    fetchSuggestions()
  }, [filterCategory, filterRead])

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className="flex h-screen overflow-hidden font-sans text-[#191c1e] bg-[#f8fafc]">
      <AdminSidebar />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[200] px-5 py-3 rounded-2xl shadow-xl text-white text-sm flex items-center gap-2 ${toast.ok ? 'bg-emerald-600' : 'bg-rose-600'}`}>
          <span className="material-symbols-outlined text-[18px]">{toast.ok ? 'check_circle' : 'error'}</span>
          {toast.msg}
        </div>
      )}

      <main className="flex-1 flex overflow-hidden">
        {/* List panel */}
        <div className="flex flex-col w-full lg:w-[420px] shrink-0 border-r border-[#c7c4d8]/40 bg-white overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b border-[#c7c4d8]/40">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-base font-bold">Saran & Masukan</h1>
                <p className="text-[11px] text-[#777587]">Dari pengguna publik TalentaKu</p>
              </div>
              {unreadCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  {unreadCount} belum dibaca
                </span>
              )}
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              {/* Category filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="text-xs px-3 py-1.5 border border-[#c7c4d8]/50 rounded-lg bg-[#f8fafc] outline-none font-semibold text-[#464555]"
              >
                <option value="">Semua Kategori</option>
                {['Variabel', 'Indikator', 'Kriteria Bakat', 'Umum', 'Lainnya'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* Read filter */}
              <select
                value={filterRead}
                onChange={(e) => setFilterRead(e.target.value)}
                className="text-xs px-3 py-1.5 border border-[#c7c4d8]/50 rounded-lg bg-[#f8fafc] outline-none font-semibold text-[#464555]"
              >
                <option value="">Semua Status</option>
                <option value="false">Belum Dibaca</option>
                <option value="true">Sudah Dibaca</option>
              </select>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#c7c4d8]/20">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-40 gap-3 text-[#777587]">
                <span className="material-symbols-outlined text-3xl animate-spin">progress_activity</span>
                <span className="text-xs">Memuat...</span>
              </div>
            ) : suggestions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 gap-3 text-[#777587]">
                <span className="material-symbols-outlined text-4xl">inbox</span>
                <span className="text-xs font-semibold">Tidak ada saran ditemukan</span>
              </div>
            ) : (
              suggestions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => openDetail(s)}
                  className={`w-full text-left px-5 py-4 hover:bg-[#f8fafc] transition-colors flex gap-3 ${selected?.id === s.id ? 'bg-[#f0efff]' : ''}`}
                >
                  {/* Unread indicator */}
                  <div className="flex flex-col items-center pt-1.5">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${!s.is_read ? 'bg-[#3525cd]' : 'bg-transparent'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0"
                        style={{ background: categoryColor(s.category) + '18', color: categoryColor(s.category) }}
                      >
                        {s.category}
                      </span>
                    </div>
                    <p className={`text-xs truncate ${!s.is_read ? 'font-bold text-[#191c1e]' : 'font-semibold text-[#464555]'}`}>
                      {s.subject}
                    </p>
                    <p className="text-[11px] text-[#777587] truncate mt-0.5">{s.message}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] text-[#777587]">{s.user_name || 'Anonim'}</span>
                      <span className="text-[10px] text-[#c7c4d8]">·</span>
                      <span className="text-[10px] text-[#777587]">{formatDate(s.created_at)}</span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Detail panel */}
        <div className="flex-1 hidden lg:flex flex-col overflow-hidden">
          {selected ? (
            <>
              {/* Detail header */}
              <div className="px-8 py-5 border-b border-[#c7c4d8]/40 flex items-start justify-between gap-4 bg-white">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider"
                      style={{ background: categoryColor(selected.category) + '18', color: categoryColor(selected.category) }}
                    >
                      {selected.category}
                    </span>
                    {selected.is_read ? (
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">done_all</span>
                        Sudah Dibaca
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#3525cd] font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">mark_email_unread</span>
                        Belum Dibaca
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-[#191c1e] leading-snug">{selected.subject}</h2>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!selected.is_read && (
                    <button
                      onClick={() => markRead(selected.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-[#c7c4d8]/50 text-[#464555] hover:bg-[#f1f3f5] transition-all"
                    >
                      <span className="material-symbols-outlined text-[14px]">done_all</span>
                      Tandai Dibaca
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (confirm('Hapus saran ini?')) deleteSuggestion(selected.id)
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition-all"
                  >
                    <span className="material-symbols-outlined text-[14px]">delete</span>
                    Hapus
                  </button>
                </div>
              </div>

              {/* Sender info */}
              <div className="px-8 py-4 border-b border-[#c7c4d8]/20 bg-[#f8fafc] flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#3525cd]/15 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#3525cd]" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#191c1e]">{selected.user_name || 'Anonim'}</p>
                  <p className="text-xs text-[#777587]">{selected.user_email || 'Email tidak diketahui'} · {formatDate(selected.created_at)}</p>
                </div>
              </div>

              {/* Message body */}
              <div className="flex-1 overflow-y-auto px-8 py-6">
                <p className="text-sm text-[#464555] leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#777587] gap-4">
              <div className="w-20 h-20 rounded-full bg-[#f1f3f5] flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl">mark_email_read</span>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold">Pilih saran untuk melihat detail</p>
                <p className="text-xs mt-1">Klik salah satu item di panel kiri</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
