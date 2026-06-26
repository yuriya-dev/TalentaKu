import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../components/layout/AdminSidebar'

export default function AdminSettingsPage() {
  const navigate = useNavigate()
  const [likertThreshold, setLikertThreshold] = useState('4')
  const [appName, setAppName] = useState('TalentaKu')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successToast, setSuccessToast] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Pengaturan Sistem | TalentaKu Admin'

    const token = localStorage.getItem('admin_token')
    if (!token) {
      navigate('/admin/login')
      return
    }

    async function fetchSettings() {
      try {
        const res = await fetch('http://localhost:8080/api/admin/settings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (res.status === 401) {
          localStorage.removeItem('admin_token')
          localStorage.removeItem('admin_user')
          navigate('/admin/login')
          return
        }

        if (!res.ok) {
          throw new Error('Gagal mengambil pengaturan dari server.')
        }

        const data = await res.json()
        if (data.likert_threshold) {
          setLikertThreshold(data.likert_threshold)
        }
        if (data.app_name) {
          setAppName(data.app_name)
        }
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan sistem saat memuat pengaturan.')
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [navigate])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccessToast(null)

    const token = localStorage.getItem('admin_token')
    if (!token) {
      navigate('/admin/login')
      return
    }

    try {
      const res = await fetch('http://localhost:8080/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          likert_threshold: likertThreshold,
          app_name: appName
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Gagal menyimpan pengaturan.')
      }

      setSuccessToast('Pengaturan berhasil diperbarui di server.')
      setTimeout(() => setSuccessToast(null), 4000)
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem saat menyimpan.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden font-sans text-[#191c1e] bg-[#f8fafc]">
      <AdminSidebar />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top App Bar */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center w-full px-4 md:px-10 py-4 shadow-sm">
          <h2 className="text-2xl font-bold text-[#3525cd]">Pengaturan Sistem</h2>
        </header>

        {/* Success Toast */}
        {successToast && (
          <div className="absolute top-20 right-10 z-[110] bg-emerald-600 text-white px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-2 text-sm animate-bounce">
            <span className="material-symbols-outlined">check_circle</span>
            <span>{successToast}</span>
          </div>
        )}

        {loading ? (
          <div className="flex-grow p-4 md:p-10 max-w-3xl">
            <phantom-ui loading="true" className="block">
              <div className="bg-white border border-[#c7c4d8]/40 rounded-[2rem] p-8 shadow-sm space-y-8">
                <div className="h-6 w-48 bg-slate-100 rounded"></div>
                <div className="space-y-4">
                  <div className="h-4 w-32 bg-slate-100 rounded"></div>
                  <div className="h-10 w-full bg-slate-100 rounded-xl"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 w-32 bg-slate-100 rounded"></div>
                  <div className="h-10 w-full bg-slate-100 rounded-xl"></div>
                </div>
                <div className="h-12 w-32 bg-slate-100 rounded-xl mt-6"></div>
              </div>
            </phantom-ui>
          </div>
        ) : error ? (
          <div className="flex-grow p-10 flex items-center justify-center">
            <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-6 text-red-800 text-sm flex gap-3 max-w-xl shadow-sm">
              <span className="material-symbols-outlined text-red-600 shrink-0">error</span>
              <div>
                <h5 className="font-bold mb-1">Gagal Memuat Pengaturan</h5>
                <p className="opacity-95">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 md:p-10 max-w-3xl">
            <form onSubmit={handleSave} className="clay-card p-8 space-y-6">
              <h3 className="text-lg font-bold text-[#191c1e] border-b border-[#c7c4d8]/20 pb-4">Parameter Logika & Tampilan</h3>

              {/* Likert Threshold Selector */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#464555] block">Ambang Batas Nilai Skala Likert (Threshold)</label>
                <select
                  value={likertThreshold}
                  onChange={(e) => setLikertThreshold(e.target.value)}
                  className="w-full clay-input text-sm p-3.5"
                >
                  <option value="3">3 - Kadang-kadang / Sering / Selalu</option>
                  <option value="4">4 - Sering / Selalu (Rekomendasi Jurnal)</option>
                  <option value="5">5 - Selalu</option>
                </select>
                <p className="text-xs text-[#777587] leading-relaxed pt-1">
                  Ambang batas ini menentukan nilai minimal skala Likert (1-5) dari variabel masukan anak untuk dapat memicu nilai boolean <span className="font-bold text-emerald-600">TRUE</span> pada tingkat indikator.
                </p>
              </div>

              {/* App Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#464555] block">Nama Aplikasi Penilaian</label>
                <input
                  type="text"
                  required
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full clay-input text-sm p-3.5"
                  placeholder="TalentaKu"
                />
                <p className="text-xs text-[#777587] leading-relaxed pt-1">
                  Nama aplikasi sistem pakar yang akan ditampilkan pada header dan footer sistem.
                </p>
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-[#c7c4d8]/20 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="clay-btn-primary px-8 py-4 text-sm flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <span className="material-symbols-outlined text-base animate-spin">sync</span>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">save</span>
                      Simpan Pengaturan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}
