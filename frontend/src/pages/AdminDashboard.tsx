import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AdminSidebar from '../components/layout/AdminSidebar'

interface DashboardStats {
  totalAssessments: number
  activeStudents: number
  identifiedTalents: number
  pendingReviews: number
  chartBars: Array<{ label: string; pct: number }>
}

interface ConsultationItem {
  id: number
  name: string
  initials: string
  talent: string
  confidence: number
  status: string
  date: string
  statusColor: string
  barColor: string
}

const systemHealth = [
  { icon: 'sync', label: 'Aturan Sinkron', desc: '33 cabang logika aktif terverifikasi.', color: 'bg-[#10B981]/20 text-[#10B981]' },
  { icon: 'database', label: 'Cadangan Variabel', desc: 'Penyimpanan inkremental selesai.', color: 'bg-[#3525cd]/20 text-[#3525cd]' },
  { icon: 'security', label: 'Log Akses', desc: 'Tidak ada aktivitas mencurigakan.', color: 'bg-[#00687a]/20 text-[#00687a]' },
]

const variableCategories = [
  { title: 'Kapasitas Kognitif (C1–C25)', count: 25, color: 'bg-[#3525cd]/10', badge: 'bg-[#3525cd] text-white', accent: 'text-[#3525cd]', vars: ['C1: Penalaran Abstrak', 'C2: Pemrosesan Numerik', 'C3: Memori Visual-Spasial'] },
  { title: 'Kecerdasan Emosional (C26–C50)', count: 25, color: 'bg-[#00687a]/10', badge: 'bg-[#00687a] text-white', accent: 'text-[#00687a]', vars: ['C26: Kecerdasan Empati', 'C27: Regulasi Diri', 'C28: Ketahanan Sosial'] },
  { title: 'Keterampilan Psikomotorik (C51–C83)', count: 33, color: 'bg-[#ffddb8]/20', badge: 'bg-[#684000] text-white', accent: 'text-[#684000]', vars: ['C51: Fine Motor Precision', 'C52: Reaction Response', 'C53: Bilateral Coordination'] },
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [chartLoaded, setChartLoaded] = useState(false)
  const [statsData, setStatsData] = useState<DashboardStats>({
    totalAssessments: 0,
    activeStudents: 0,
    identifiedTalents: 0,
    pendingReviews: 0,
    chartBars: []
  })
  const [recentConsultations, setRecentConsultations] = useState<ConsultationItem[]>([])
  const [adminUser, setAdminUser] = useState<{ email: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Ringkasan Sistem | TalentaKu Admin'

    const token = localStorage.getItem('admin_token')
    const userStr = localStorage.getItem('admin_user')

    if (!token) {
      navigate('/admin/login')
      return
    }

    if (userStr) {
      try {
        setAdminUser(JSON.parse(userStr))
      } catch (e) {
        // Ignore JSON parse error
      }
    }

    async function fetchDashboardData() {
      try {
        // Fetch stats
        const statsRes = await fetch('http://localhost:8080/api/admin/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (statsRes.status === 401) {
          localStorage.removeItem('admin_token')
          localStorage.removeItem('admin_user')
          navigate('/admin/login')
          return
        }

        if (!statsRes.ok) {
          throw new Error('Gagal memuat statistik admin.')
        }

        const rawStats = await statsRes.json()

        // Map chart distribution
        const dist = rawStats.talent_distribution || []
        const maxCount = Math.max(...dist.map((d: any) => d.count), 0)
        const chartBarsMapped = dist.map((d: any) => ({
          label: d.label,
          pct: maxCount > 0 ? Math.round((d.count / maxCount) * 100) : 0
        }))

        setStatsData({
          totalAssessments: rawStats.total_assessments || 0,
          activeStudents: rawStats.active_students || 0,
          identifiedTalents: rawStats.identified_talents || 0,
          pendingReviews: rawStats.pending_reviews || 0,
          chartBars: chartBarsMapped
        })

        // Fetch recent consultations
        const consRes = await fetch('http://localhost:8080/api/consultations', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (!consRes.ok) {
          throw new Error('Gagal memuat konsultasi terbaru.')
        }

        const rawConsultations = await consRes.json()
        const recentMapped: ConsultationItem[] = rawConsultations.slice(0, 5).map((item: any) => {
          const isCompleted = item.status === 'COMPLETED'
          const nameParts = item.child_name.split(' ')
          const initials = nameParts.length >= 2
            ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
            : item.child_name.slice(0, 2).toUpperCase()

          return {
            id: item.id,
            name: item.child_name,
            initials,
            talent: isCompleted ? item.top_talent : 'Belum Selesai',
            confidence: isCompleted ? Math.round(item.confidence_score) : 0,
            status: isCompleted ? 'Selesai' : 'Proses',
            statusColor: isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800',
            barColor: isCompleted ? 'bg-emerald-500' : 'bg-amber-500',
            date: new Date(item.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })
          }
        })

        setRecentConsultations(recentMapped)
        setTimeout(() => setChartLoaded(true), 300)
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan sistem saat memuat data dasbor.')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [navigate])

  const statsList = [
    { icon: 'assignment', label: 'Total Asesmen', value: statsData.totalAssessments.toLocaleString('id-ID'), color: 'text-[#3525cd]', bg: 'bg-[#3525cd]/10', trend: 'Selesai', trendUp: null },
    { icon: 'groups', label: 'Siswa Aktif', value: statsData.activeStudents.toLocaleString('id-ID'), color: 'text-[#00687a]', bg: 'bg-[#00687a]/10', trend: 'Terdaftar', trendUp: null },
    { icon: 'verified', label: 'Bakat Teridentifikasi', value: statsData.identifiedTalents.toLocaleString('id-ID'), color: 'text-[#684000]', bg: 'bg-[#ffddb8]/20', trend: 'Forward Chain', trendUp: null },
    { icon: 'history', label: 'Tinjauan Tertunda', value: statsData.pendingReviews.toLocaleString('id-ID'), color: 'text-[#ba1a1a]', bg: 'bg-[#ba1a1a]/10', trend: 'Review', trendUp: null },
  ]

  return (
    <div className="flex h-screen overflow-hidden font-sans text-[#191c1e] bg-[#f8fafc]">
      <AdminSidebar />

      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top App Bar */}
        <header className="glass-header sticky top-0 flex justify-between items-center w-full px-4 md:px-10 py-4 z-30 shadow-sm bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-[#3525cd]">Ringkasan Sistem</h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 flex items-center justify-center rounded-full text-[#464555] hover:bg-[#e2dfff]/20 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="flex items-center gap-2 border-l border-[#c7c4d8] pl-4 ml-2">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#e2dfff] bg-[#3525cd] text-white flex items-center justify-center font-bold text-sm">
                {adminUser?.email ? adminUser.email.slice(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold leading-none">{adminUser?.email || 'Pengguna Admin'}</p>
                <p className="text-xs text-[#464555] capitalize mt-0.5">{adminUser?.role === 'superadmin' ? 'Super Admin' : 'Admin'}</p>
              </div>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="p-4 md:p-10 space-y-6">
            {/* Stats Grid Skeleton */}
            <phantom-ui loading="true" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 block">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-6 flex flex-col justify-between bg-white border border-[#c7c4d8]/40 rounded-3xl shadow-sm min-h-[140px]">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg"></div>
                    <div className="w-12 h-4 bg-slate-100 rounded"></div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-4 w-24 bg-slate-100 rounded"></div>
                    <div className="h-8 w-16 bg-slate-100 rounded"></div>
                  </div>
                </div>
              ))}
            </phantom-ui>

            {/* Grid Charts Skeleton */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <phantom-ui loading="true" className="xl:col-span-2 p-8 bg-white border border-[#c7c4d8]/40 rounded-3xl shadow-sm block">
                <div className="h-6 w-48 bg-slate-100 rounded mb-8"></div>
                <div className="h-64 w-full bg-slate-100 rounded-2xl"></div>
              </phantom-ui>
              <phantom-ui loading="true" className="p-8 bg-white border border-[#c7c4d8]/40 rounded-3xl shadow-sm block">
                <div className="h-6 w-32 bg-slate-100 rounded mb-8"></div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 w-full bg-slate-100 rounded-2xl"></div>
                  ))}
                </div>
              </phantom-ui>
            </div>
          </div>
        ) : error ? (
          <div className="flex-grow p-10 flex items-center justify-center">
            <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-6 text-red-800 text-sm flex gap-3 max-w-xl shadow-sm">
              <span className="material-symbols-outlined text-red-600 shrink-0">error</span>
              <div>
                <h5 className="font-bold mb-1">Gagal Memuat Dasbor</h5>
                <p className="opacity-95">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 md:p-10 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsList.map((stat) => (
                <div key={stat.label} className="card-level-1 p-6 flex flex-col justify-between bg-white border border-[#c7c4d8]/40 rounded-3xl shadow-sm">
                  <div className="flex justify-between items-start">
                    <span className={`p-2 ${stat.bg} ${stat.color} rounded-lg material-symbols-outlined`}>{stat.icon}</span>
                    <span className="text-[10px] uppercase font-bold text-[#777587]">{stat.trend}</span>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-[#464555]">{stat.label}</p>
                    <h3 className={`text-[32px] font-bold mt-1 ${stat.color}`}>{stat.value}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Chart + Health */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Bar Chart */}
              <div className="xl:col-span-2 card-level-1 p-8 bg-white border border-[#c7c4d8]/40 rounded-3xl shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h4 className="text-xl font-bold">Analisis Distribusi Bakat</h4>
                </div>
                <div className="relative h-64 w-full bg-[#f2f4f6] rounded-2xl overflow-hidden flex items-end justify-around px-8 pb-4">
                  {statsData.chartBars.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-xs text-[#777587]">Tidak ada data distribusi bakat yang tercatat.</p>
                    </div>
                  ) : (
                    statsData.chartBars.map((bar, i) => (
                      <div key={bar.label} className="relative group flex flex-col items-center">
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#191c1e] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-sm">
                          {bar.pct}%
                        </div>
                        <div
                          className="w-10 sm:w-12 bg-[#3525cd] rounded-t-lg transition-all duration-700 hover:opacity-85"
                          style={{ height: chartLoaded ? `${bar.pct}%` : '0%', opacity: `${1 - (i % 6) * 0.12}` }}
                        />
                      </div>
                    ))
                  )}
                </div>
                <div className="flex justify-around mt-4 overflow-hidden">
                  {statsData.chartBars.map((bar) => (
                    <span
                      key={bar.label}
                      className="text-[10px] font-medium text-[#464555] text-center truncate w-20 px-1"
                      title={bar.label}
                    >
                      {bar.label.split(' - ')[0]}
                    </span>
                  ))}
                </div>
              </div>

              {/* System Health */}
              <div className="card-level-1 p-6 space-y-4 bg-white border border-[#c7c4d8]/40 rounded-3xl shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="text-xl font-bold mb-4">Status Sistem</h4>
                  <div className="space-y-4">
                    {systemHealth.map((item) => (
                      <div key={item.label} className="flex items-center gap-4 p-3 hover:bg-[#eceef0]/50 rounded-xl transition-colors cursor-default">
                        <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center shrink-0`}>
                          <span className="material-symbols-outlined">{item.icon}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{item.label}</p>
                          <p className="text-xs text-[#464555]">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="w-full py-3 border border-[#c7c4d8] text-[#3525cd] text-sm font-semibold rounded-xl hover:bg-[#3525cd]/5 transition-colors mt-4">
                  Periksa Detil Sistem
                </button>
              </div>
            </div>

            {/* Variable Ecosystem Summary */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xl font-bold">Ekosistem Variabel (C1–C83)</h4>
                  <p className="text-xs text-[#464555]">Ringkasan variabel psikometrik terdaftar.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {variableCategories.map((cat) => (
                  <div key={cat.title} className="card-level-1 overflow-hidden bg-white border border-[#c7c4d8]/40 rounded-3xl shadow-sm">
                    <div className={`${cat.color} px-6 py-4 border-b border-[#c7c4d8]/20 flex justify-between items-center`}>
                      <h5 className={`text-xs font-bold ${cat.accent} uppercase tracking-wider`}>{cat.title}</h5>
                      <span className={`text-[10px] font-bold ${cat.badge} px-2 py-0.5 rounded`}>{cat.count} Variabel</span>
                    </div>
                    <div className="p-6 space-y-4">
                      {cat.vars.map((v) => (
                        <div key={v} className="flex items-center justify-between pb-2 border-b border-[#c7c4d8]/10 text-xs">
                          <span className="font-semibold text-[#191c1e]">{v}</span>
                          <span className="px-2 py-0.5 text-[9px] rounded uppercase font-bold bg-emerald-100 text-emerald-800">
                            Aktif
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Consultations Table */}
            <section className="card-level-1 overflow-hidden bg-white border border-[#c7c4d8]/40 rounded-3xl shadow-sm">
              <div className="p-6 border-b border-[#c7c4d8]/30 flex justify-between items-center">
                <h4 className="text-xl font-bold">Konsultasi Terbaru</h4>
                <Link to="/assessments" className="text-[#3525cd] text-sm font-semibold flex items-center gap-1 hover:underline">
                  Lihat Semua <span className="material-symbols-outlined text-base">chevron_right</span>
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#f2f4f6] text-xs font-bold text-[#464555] uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Nama Klien</th>
                      <th className="px-6 py-4">Bakat Utama</th>
                      <th className="px-6 py-4">Keyakinan</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Tanggal</th>
                      <th className="px-6 py-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c7c4d8]/20">
                    {recentConsultations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-sm text-[#464555]">
                          Belum ada data konsultasi.
                        </td>
                      </tr>
                    ) : (
                      recentConsultations.map((c) => (
                        <tr key={c.id} className="hover:bg-[#f2f4f6]/30 transition-colors group">
                          <td className="px-6 py-4 text-sm font-semibold text-[#3525cd]">#AS-{c.id}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-[#3525cd]/10 text-[#3525cd] flex items-center justify-center text-[10px] font-bold shrink-0">
                                {c.initials}
                              </div>
                              <span className="text-sm font-medium">{c.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-[#3525cd]/5 text-[#3525cd] rounded-full text-xs font-semibold">{c.talent}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-[#eceef0] rounded-full h-1.5 max-w-[80px]">
                                <div className={`${c.barColor} h-1.5 rounded-full`} style={{ width: `${c.confidence}%` }} />
                              </div>
                              <span className="text-[10px] text-[#464555] font-bold">{c.confidence}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-0.5 ${c.statusColor} text-[10px] rounded-full uppercase font-bold shadow-sm`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[#464555] text-xs">{c.date}</td>
                          <td className="px-6 py-4">
                            <Link
                              to={c.status === 'Selesai' ? `/results/${c.id}` : `/assessment/1`}
                              className="inline-flex items-center justify-center p-2 text-[#777587] hover:text-[#3525cd] hover:bg-[#3525cd]/5 rounded-lg transition-colors"
                            >
                              <span className="material-symbols-outlined text-lg">visibility</span>
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* Footer */}
        <footer className="w-full py-8 px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4 bg-[#e0e3e5] mt-auto border-t border-[#c7c4d8]/40">
          <p className="text-xs text-[#464555]">© 2026 TalentaKu Expert Systems. Kehangatan Profesional dalam Penilaian.</p>
          <div className="flex gap-6">
            <Link to="#" className="text-xs text-[#464555] hover:text-[#3525cd] transition-colors">Kebijakan Privasi</Link>
            <Link to="#" className="text-xs text-[#464555] hover:text-[#3525cd] transition-colors">Ketentuan Layanan</Link>
          </div>
        </footer>
      </main>
    </div>
  )
}
