import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminSidebar from '../components/layout/AdminSidebar'

const stats = [
  { icon: 'assignment', label: 'Total Asesmen', value: '1.284', color: 'text-[#3525cd]', bg: 'bg-[#3525cd]/10', trend: '+12%', trendUp: true },
  { icon: 'groups', label: 'Siswa Aktif', value: '842', color: 'text-[#00687a]', bg: 'bg-[#00687a]/10', trend: '+5%', trendUp: true },
  { icon: 'verified', label: 'Bakat Teridentifikasi', value: '3.120', color: 'text-[#684000]', bg: 'bg-[#ffddb8]/20', trend: 'Stabil', trendUp: null },
  { icon: 'history', label: 'Tinjauan Tertunda', value: '14', color: 'text-[#ba1a1a]', bg: 'bg-[#ba1a1a]/10', trend: '-2%', trendUp: false },
]

const chartBars = [
  { label: 'Linguistik', pct: 65 },
  { label: 'Logis', pct: 40 },
  { label: 'Spasial', pct: 85 },
  { label: 'Musikal', pct: 55 },
  { label: 'Kinestetik', pct: 30 },
]

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

const consultations = [
  { id: '#AS-9921', initials: 'JS', name: 'Jonathan Smith', talent: 'Musikal-Ritmik', confidence: 92, status: 'Selesai', date: '24 Okt 2026', statusColor: 'bg-[#10B981]/10 text-[#10B981]', barColor: 'bg-[#10B981]' },
  { id: '#AS-9920', initials: 'AM', name: 'Alicia Mendez', talent: 'Logis-Matematis', confidence: 78, status: 'Tertunda', date: '23 Okt 2026', statusColor: 'bg-[#acedff] text-[#006172]', barColor: 'bg-[#3525cd]' },
  { id: '#AS-9919', initials: 'RK', name: 'Ryan Koji', talent: 'Kinestetik', confidence: 88, status: 'Selesai', date: '22 Okt 2026', statusColor: 'bg-[#10B981]/10 text-[#10B981]', barColor: 'bg-[#10B981]' },
]

export default function AdminDashboard() {
  const [chartLoaded, setChartLoaded] = useState(false)

  useEffect(() => {
    document.title = 'Ringkasan Sistem | TalentaKu Admin'
    // Small delay to allow layout before animating
    const t = setTimeout(() => setChartLoaded(true), 300)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex h-screen overflow-hidden font-sans text-[#191c1e]">
      <AdminSidebar />

      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top App Bar */}
        <header className="glass-header sticky top-0 flex justify-between items-center w-full px-4 md:px-10 py-4 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-[#3525cd]">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="text-2xl font-bold text-[#3525cd]">Ringkasan Sistem</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex bg-[#eceef0] rounded-full px-4 py-2 items-center gap-2 border border-[#c7c4d8]">
              <span className="material-symbols-outlined text-[#777587]">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-sm outline-none w-64" placeholder="Cari asesmen..." type="text" />
            </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-full text-[#464555] hover:bg-[#e0e3e5] transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="flex items-center gap-2 border-l border-[#c7c4d8] pl-4 ml-2">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#e2dfff]">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6zjHzNWEXRK4RhbTQyavGRBlr64Enw_853XlHjcEHnblCInhl3F4vawRegI5F_KBQ5wTwuNYxaG3xGjfUAy_oq-EmghRevG4T6bVv6ubJ171ztldRseVRqq9YdfYLuLKv9R15A8Qc2_JPE5gS8p4M6q2FLEW-AVms5Qh-MkiTI7NIoCCo3vbMypG_bDjToLq4JC8nLt-VBi-h9a195EnpGeyFP-0gUDRpm0pPBxFhIJrvmXUVb-bX59m4EZ8udV1XuLMuy0v-Huc"
                  alt="Admin"
                />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold leading-none">Pengguna Admin</p>
                <p className="text-xs text-[#464555]">Manajer Sistem</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-10 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="card-level-1 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className={`p-2 ${stat.bg} ${stat.color} rounded-lg material-symbols-outlined`}>{stat.icon}</span>
                  <span className={`text-xs font-semibold flex items-center gap-0.5 ${stat.trendUp === true ? 'text-[#10B981]' : stat.trendUp === false ? 'text-[#ba1a1a]' : 'text-[#464555]'}`}>
                    {stat.trend}
                    {stat.trendUp !== null && (
                      <span className="material-symbols-outlined text-base">{stat.trendUp ? 'trending_up' : 'trending_down'}</span>
                    )}
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-[#464555]">{stat.label}</p>
                  <h3 className={`text-[32px] font-bold ${stat.color}`}>{stat.value}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Chart + Health */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Bar Chart */}
            <div className="xl:col-span-2 card-level-1 p-8">
              <div className="flex justify-between items-center mb-8">
                <h4 className="text-2xl font-bold">Analisis Distribusi Bakat</h4>
                <select className="bg-[#eceef0] border-none rounded-lg text-sm font-semibold px-4 py-2 focus:ring-[#3525cd] outline-none">
                  <option>30 Hari Terakhir</option>
                  <option>Kuartal Terakhir</option>
                </select>
              </div>
              <div className="relative h-64 w-full bg-[#f2f4f6] rounded-xl overflow-hidden flex items-end justify-around px-8 pb-4">
                {chartBars.map((bar, i) => (
                  <div key={bar.label} className="relative group flex flex-col items-center">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#191c1e] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {bar.pct}%
                    </div>
                    <div
                      className="w-12 bg-[#3525cd] rounded-t-lg transition-all duration-700 hover:opacity-80"
                      style={{ height: chartLoaded ? `${bar.pct}%` : '0%', opacity: `${1 - i * 0.15}` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-around mt-4">
                {chartBars.map((bar) => (
                  <span key={bar.label} className="text-xs text-[#464555]">{bar.label}</span>
                ))}
              </div>
            </div>

            {/* System Health */}
            <div className="card-level-1 p-6 space-y-4">
              <h4 className="text-2xl font-bold">Status Sistem</h4>
              <div className="space-y-4">
                {systemHealth.map((item) => (
                  <div key={item.label} className="flex items-center gap-4 p-3 hover:bg-[#eceef0] rounded-lg transition-colors cursor-pointer">
                    <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center`}>
                      <span className="material-symbols-outlined">{item.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="text-xs text-[#464555]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-3 mt-4 border border-[#c7c4d8] text-[#3525cd] text-sm font-semibold rounded-lg hover:bg-[#3525cd]/5 transition-colors">
                Lihat Status Sistem
              </button>
            </div>
          </div>

          {/* Variable Ecosystem */}
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="text-2xl font-bold">Ekosistem Variabel (C1–C83)</h4>
                <p className="text-base text-[#464555]">Kelola variabel psikometrik dan distribusi bobotnya.</p>
              </div>
              <div className="flex gap-2">
                <button className="px-6 py-2 bg-[#3525cd] text-white rounded-full text-sm font-semibold shadow-lg shadow-[#3525cd]/20 hover:scale-[1.02] active:scale-95 transition-transform flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">add</span> Tambah Variabel
                </button>
                <button className="px-6 py-2 border border-[#c7c4d8] text-[#191c1e] text-sm font-semibold rounded-full hover:bg-[#eceef0] transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">file_download</span> Ekspor
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {variableCategories.map((cat) => (
                <div key={cat.title} className="card-level-1 overflow-hidden">
                  <div className={`${cat.color} px-6 py-4 border-b border-[#c7c4d8] flex justify-between items-center`}>
                    <h5 className={`text-xs font-bold ${cat.accent} uppercase tracking-wider`}>{cat.title}</h5>
                    <span className={`text-xs font-bold ${cat.badge} px-2 py-0.5 rounded`}>{cat.count} Vars</span>
                  </div>
                  <div className="p-6 space-y-4">
                    {cat.vars.map((v, i) => (
                      <div key={v} className="flex items-center justify-between pb-2 border-b border-[#c7c4d8]/30">
                        <span className="text-sm font-semibold">{v}</span>
                        <span className={`px-2 py-1 text-[10px] rounded uppercase font-bold ${i === 1 && cat.title.includes('Psychomotor') ? 'bg-[#ba1a1a]/10 text-[#ba1a1a]' : 'bg-[#10B981]/10 text-[#10B981]'}`}>
                          {i === 1 && cat.title.includes('Psychomotor') ? 'Archived' : 'Active'}
                        </span>
                      </div>
                    ))}
                    <div className="text-center">
                      <button className="text-[#3525cd] text-xs font-semibold hover:underline">Tampilkan variabel lainnya</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Consultations */}
          <section className="card-level-1 overflow-hidden">
            <div className="p-6 border-b border-[#c7c4d8] flex justify-between items-center">
              <h4 className="text-2xl font-bold">Konsultasi Terbaru</h4>
              <button className="text-[#3525cd] text-sm font-semibold flex items-center gap-1 hover:underline">
                Lihat Semua <span className="material-symbols-outlined text-base">chevron_right</span>
              </button>
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
                <tbody className="divide-y divide-[#c7c4d8]/30">
                  {consultations.map((c) => (
                    <tr key={c.id} className="hover:bg-[#f2f4f6] transition-colors group">
                      <td className="px-6 py-4 text-sm font-semibold">{c.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#e2dfff] text-[#3525cd] flex items-center justify-center text-[10px] font-bold">{c.initials}</div>
                          <span className="text-base">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-[#3525cd]/10 text-[#3525cd] rounded-full text-xs">{c.talent}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full bg-[#eceef0] rounded-full h-1.5 max-w-[80px]">
                          <div className={`${c.barColor} h-1.5 rounded-full`} style={{ width: `${c.confidence}%` }} />
                        </div>
                        <span className="text-[10px] text-[#464555]">{c.confidence}%</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 ${c.statusColor} text-[10px] rounded uppercase font-bold`}>{c.status}</span>
                      </td>
                      <td className="px-6 py-4 text-[#464555] text-xs">{c.date}</td>
                      <td className="px-6 py-4">
                        <button className="p-2 text-[#777587] hover:text-[#3525cd] rounded-lg">
                          <span className="material-symbols-outlined">visibility</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="w-full py-8 px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4 bg-[#e0e3e5] mt-auto">
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
