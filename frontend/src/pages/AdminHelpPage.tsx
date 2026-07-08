import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../components/layout/AdminSidebar'

interface Section {
  id: string
  icon: string
  label: string
  color: string
}

const sections: Section[] = [
  { id: 'tentang',    icon: 'info',           label: 'Tentang TalentaKu',       color: '#3525cd' },
  { id: 'dashboard',  icon: 'dashboard',      label: 'Dashboard',               color: '#0077b6' },
  { id: 'variabel',   icon: 'tune',           label: 'Kelola Variabel',          color: '#00677a' },
  { id: 'indikator',  icon: 'leaderboard',    label: 'Kelola Indikator',         color: '#7c4dff' },
  { id: 'kriteria',   icon: 'verified',       label: 'Kelola Kriteria Bakat',    color: '#d4760f' },
  { id: 'rules',      icon: 'account_tree',   label: 'Rule Builder',             color: '#ba1a1a' },
  { id: 'engine',     icon: 'settings',       label: 'Pengaturan Engine',        color: '#5c6b1e' },
  { id: 'anak',       icon: 'child_care',     label: 'Kelola Anak & Konsultasi', color: '#006876' },
  { id: 'demo',       icon: 'play_circle',    label: 'Tutorial Demo',            color: '#6d3b8f' },
  { id: 'alur',       icon: 'route',          label: 'Cara Kerja Sistem',        color: '#1e6b5c' },
  { id: 'faq',        icon: 'quiz',           label: 'FAQ',                      color: '#444' },
  { id: 'trouble',    icon: 'build',          label: 'Troubleshooting',          color: '#b54f00' },
  { id: 'security',   icon: 'shield',         label: 'Keamanan Data',            color: '#2d4a7a' },
]

function Badge({ text, color = '#3525cd' }: { text: string; color?: string }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
      style={{ background: color + '18', color }}
    >
      {text}
    </span>
  )
}

function SectionCard({ icon, label, color, active, onClick }: Omit<Section, 'id'> & { active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold w-full text-left transition-all duration-200 ${
        active
          ? 'text-white shadow-md'
          : 'text-[#464555] hover:bg-[#e0e3e5]/60'
      }`}
      style={active ? { background: color } : {}}
    >
      <span
        className="material-symbols-outlined text-[20px] shrink-0"
        style={active ? { fontVariationSettings: "'FILL' 1", color: 'white' } : { color }}
      >
        {icon}
      </span>
      <span className="truncate">{label}</span>
      {active && <span className="material-symbols-outlined text-[16px] ml-auto shrink-0">chevron_right</span>}
    </button>
  )
}




function InfoBox({ icon, title, children, color = '#3525cd' }: { icon: string; title: string; children: React.ReactNode; color?: string }) {
  return (
    <div className="flex gap-3 p-4 rounded-xl border" style={{ borderColor: color + '30', background: color + '08' }}>
      <span className="material-symbols-outlined text-[22px] shrink-0 mt-0.5" style={{ color, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      <div>
        <p className="text-xs font-bold mb-1" style={{ color }}>{title}</p>
        <div className="text-xs text-[#464555] leading-relaxed">{children}</div>
      </div>
    </div>
  )
}

export default function AdminHelpPage() {
  const navigate = useNavigate()
  const [activeId, setActiveId] = useState('tentang')

  const token = localStorage.getItem('admin_token')
  if (!token) {
    navigate('/admin/login')
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden font-sans text-[#191c1e] bg-[#f8fafc]">
      <AdminSidebar />

      <main className="flex-1 flex overflow-hidden">
        {/* Help Navigation Sidebar */}
        <aside className="w-64 hidden lg:flex flex-col bg-white border-r border-[#c7c4d8]/40 py-6 px-3 gap-1 overflow-y-auto shrink-0">
          <div className="px-3 mb-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#777587]">📚 Pusat Bantuan Admin</p>
          </div>
          {sections.map((s) => (
            <SectionCard
              key={s.id}
              {...s}
              active={activeId === s.id}
              onClick={() => setActiveId(s.id)}
            />
          ))}
        </aside>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Mobile top nav */}
          <div className="lg:hidden flex gap-2 overflow-x-auto px-4 py-3 bg-white border-b border-[#c7c4d8]/40 shrink-0">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveId(s.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap shrink-0 transition-all"
                style={
                  activeId === s.id
                    ? { background: s.color, color: 'white' }
                    : { background: '#f1f3f5', color: '#464555' }
                }
              >
                <span className="material-symbols-outlined text-[14px]">{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>

          <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-10">

            {/* ══════════════════════ TENTANG ══════════════════════ */}
            {activeId === 'tentang' && (
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#3525cd' }}>
                    <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-[#191c1e]">Tentang TalentaKu</h1>
                    <p className="text-xs text-[#777587]">Pengenalan sistem pakar deteksi bakat anak</p>
                  </div>
                </div>

                <p className="text-sm text-[#464555] leading-relaxed">
                  <strong>TalentaKu</strong> adalah sistem pakar berbasis <em>Forward Chaining</em> yang dirancang untuk membantu orang tua dan guru dalam mendeteksi kecenderungan bakat dominan pada anak secara ilmiah dan terstruktur. Sistem ini menggunakan instrumen asesmen berupa kuesioner skala Likert yang kemudian diproses melalui mesin inferensi untuk menghasilkan rekomendasi bakat anak.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: 'psychology', label: 'Forward Chaining', desc: 'Mesin inferensi logika berbasis aturan', color: '#3525cd' },
                    { icon: 'child_care', label: 'Multi Kelompok Usia', desc: 'Batita, Prasekolah, SD Awal, SD Akhir', color: '#0077b6' },
                    { icon: 'verified', label: '6 Kategori Bakat', desc: 'Sesuai teori kecerdasan majemuk Gardner', color: '#7c4dff' },
                    { icon: 'shield', label: 'Keamanan Data', desc: 'Hashing Bcrypt & Trace Log terenkripsi', color: '#2d4a7a' },
                  ].map((f) => (
                    <div key={f.label} className="p-4 rounded-2xl bg-white border border-[#c7c4d8]/40 shadow-sm flex gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: f.color + '15' }}>
                        <span className="material-symbols-outlined text-[18px]" style={{ color: f.color, fontVariationSettings: "'FILL' 1" }}>{f.icon}</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#191c1e]">{f.label}</p>
                        <p className="text-[11px] text-[#777587]">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <InfoBox icon="auto_awesome" title="Filosofi Sistem" color="#3525cd">
                  TalentaKu tidak menentukan bakat anak secara mutlak. Sistem mendeteksi <strong>kecenderungan bakat dominan</strong> berdasarkan pola jawaban yang diberikan, dan menyajikan <strong>Top 3 bakat</strong> sebagai panduan pengembangan.
                </InfoBox>
              </section>
            )}

            {/* ══════════════════════ DASHBOARD ══════════════════════ */}
            {activeId === 'dashboard' && (
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#0077b6' }}>
                    <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-[#191c1e]">Dashboard</h1>
                    <p className="text-xs text-[#777587]">Pemantauan kondisi sistem secara keseluruhan</p>
                  </div>
                </div>

                <p className="text-sm text-[#464555] leading-relaxed">
                  Dashboard digunakan untuk memantau kondisi sistem secara keseluruhan dan melihat ringkasan aktivitas asesmen yang telah dilakukan.
                </p>

                <div className="space-y-3">
                  {[
                    { label: 'Total Anak', icon: 'child_care', desc: 'Jumlah data profil anak yang telah terdaftar di sistem. Setiap anak terhubung dengan akun pengguna (orang tua/guru).', color: '#0077b6' },
                    { label: 'Total Asesmen', icon: 'assignment_turned_in', desc: 'Jumlah sesi asesmen yang telah selesai diproses, termasuk yang berhasil menghasilkan rekomendasi bakat.', color: '#3525cd' },
                    { label: 'Distribusi Bakat', icon: 'pie_chart', desc: 'Grafik yang menampilkan persebaran kategori bakat dominan dari seluruh hasil asesmen. Berguna untuk memahami tren bakat pada populasi pengguna.', color: '#7c4dff' },
                    { label: 'Statistik Pengguna', icon: 'people', desc: 'Jumlah pengguna aktif (orang tua/guru) yang terdaftar dan pernah melakukan proses asesmen.', color: '#d4760f' },
                    { label: 'Aktivitas Terbaru', icon: 'history', desc: 'Log 10 aktivitas asesmen terbaru beserta nama anak, tanggal, dan status hasilnya. Diperbarui secara real-time.', color: '#5c6b1e' },
                  ].map((item) => (
                    <div key={item.label} className="flex gap-4 p-4 bg-white rounded-2xl border border-[#c7c4d8]/40 shadow-sm">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: item.color + '15' }}>
                        <span className="material-symbols-outlined text-[18px]" style={{ color: item.color, fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#191c1e]">{item.label}</p>
                        <p className="text-xs text-[#464555] leading-relaxed mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ══════════════════════ VARIABEL ══════════════════════ */}
            {activeId === 'variabel' && (
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#00677a' }}>
                    <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>tune</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-[#191c1e]">Kelola Variabel</h1>
                    <p className="text-xs text-[#777587]">Mengelola butir pertanyaan kuesioner asesmen</p>
                  </div>
                </div>

                <p className="text-sm text-[#464555] leading-relaxed">
                  Variabel adalah butir pertanyaan observasi yang ditampilkan kepada pengguna dalam bentuk kuesioner skala Likert (1–5). Setiap variabel memiliki <strong>Kode unik</strong>, kategori bakat, dan kelompok usia target.
                </p>

                <div className="space-y-3">
                  {[
                    { action: 'Menambah Variabel', icon: 'add_circle', desc: 'Klik tombol "Tambah Variabel" di kanan atas. Isi Kode (unik, misal C1), Kategori (pilih dari daftar atau ketik kategori baru), Kelompok Usia, dan Teks Pertanyaan.', color: '#00677a' },
                    { action: 'Mengubah Variabel', icon: 'edit', desc: 'Arahkan kursor ke baris variabel yang ingin diubah, klik ikon pensil yang muncul. Kode variabel tidak dapat diubah untuk menjaga integritas aturan.', color: '#0077b6' },
                    { action: 'Menghapus Variabel', icon: 'delete', desc: 'Arahkan kursor ke baris, klik ikon tempat sampah. Sistem akan meminta konfirmasi. Penghapusan otomatis membersihkan relasi aturan L1 terkait.', color: '#ba1a1a' },
                    { action: 'Menentukan Kelompok Usia', icon: 'cake', desc: 'Pilih dari: Batita (Toddler), Prasekolah/TK, SD Awal (Early Elementary), SD Akhir (Late Elementary). Variabel hanya muncul pada asesmen dengan kelompok usia yang sesuai.', color: '#d4760f' },
                    { action: 'Kategori Pertanyaan Dinamis', icon: 'category', desc: 'Kolom Kategori menggunakan datalist pintar. Anda bisa memilih dari daftar yang ada atau mengetik nama kategori baru (misal: Naturalist). Kategori baru otomatis terdaftar dan memunculkan tombol filter baru di atas tabel.', color: '#7c4dff' },
                  ].map((item) => (
                    <div key={item.action} className="flex gap-4 p-4 bg-white rounded-2xl border border-[#c7c4d8]/40 shadow-sm">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: item.color + '15' }}>
                        <span className="material-symbols-outlined text-[18px]" style={{ color: item.color, fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#191c1e]">{item.action}</p>
                        <p className="text-xs text-[#464555] leading-relaxed mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <InfoBox icon="lightbulb" title="Tips Penting" color="#d4760f">
                  Pastikan variabel ditempatkan pada <strong>kelompok usia yang sesuai</strong> agar tidak muncul pada instrumen asesmen yang salah. Variabel untuk anak batita tidak seharusnya muncul pada asesmen anak SD.
                </InfoBox>
              </section>
            )}

            {/* ══════════════════════ INDIKATOR ══════════════════════ */}
            {activeId === 'indikator' && (
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#7c4dff' }}>
                    <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>leaderboard</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-[#191c1e]">Kelola Indikator</h1>
                    <p className="text-xs text-[#777587]">Mengelola aspek kemampuan Level 1 (Aturan L1)</p>
                  </div>
                </div>

                <p className="text-sm text-[#464555] leading-relaxed">
                  Indikator adalah aspek kemampuan atau perilaku spesifik yang diuji dalam asesmen (Level 1). Indikator terpenuhi apabila seluruh variabel yang terhubung memberikan skor di atas threshold.
                </p>

                <div className="p-5 bg-white rounded-2xl border border-[#c7c4d8]/40 shadow-sm">
                  <p className="text-xs font-bold text-[#777587] uppercase tracking-wider mb-4">Alur Logika Level 1</p>
                  <div className="flex flex-col items-start gap-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#00677a] text-white text-xs font-bold flex items-center justify-center">V</div>
                      <div>
                        <p className="text-sm font-semibold">Variabel Masukan (C1, C2, C3...)</p>
                        <p className="text-xs text-[#777587]">Jawaban pengguna pada kuesioner</p>
                      </div>
                    </div>
                    <div className="w-8 flex justify-center py-1"><div className="w-0.5 h-5 bg-[#7c4dff]/40 rounded" /></div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#7c4dff] text-white text-xs font-bold flex items-center justify-center">I</div>
                      <div>
                        <p className="text-sm font-semibold">Indikator Bakat (I1, I2, I3...)</p>
                        <p className="text-xs text-[#777587]">Terpenuhi jika semua variabel terhubung ✓</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { action: 'Membuat Indikator', icon: 'add_circle', desc: 'Klik "Tambah Indikator". Isi Kode (misal I1), Nama Indikator (deskripsi kemampuan), dan Kelompok Usia.' },
                    { action: 'Menghubungkan Variabel ke Indikator', icon: 'link', desc: 'Gunakan menu Rule Builder → Level L1. Pilih variabel yang relevan dan hubungkan ke indikator target.' },
                    { action: 'Mengedit Indikator', icon: 'edit', desc: 'Hover baris indikator, klik ikon pensil. Kode indikator dikunci, nama dan kelompok usia dapat diubah.' },
                  ].map((item) => (
                    <div key={item.action} className="flex gap-4 p-4 bg-white rounded-2xl border border-[#c7c4d8]/40 shadow-sm">
                      <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5 text-[#7c4dff]" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                      <div>
                        <p className="text-sm font-bold text-[#191c1e]">{item.action}</p>
                        <p className="text-xs text-[#464555] leading-relaxed mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ══════════════════════ KRITERIA ══════════════════════ */}
            {activeId === 'kriteria' && (
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#d4760f' }}>
                    <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-[#191c1e]">Kelola Kriteria Bakat</h1>
                    <p className="text-xs text-[#777587]">Hasil akhir analisis bakat anak (Aturan L2)</p>
                  </div>
                </div>

                <p className="text-sm text-[#464555] leading-relaxed">
                  Kriteria adalah kesimpulan bakat akhir yang diperoleh anak setelah proses forward chaining selesai (Level 2). Sistem memiliki <strong>6 kategori bakat utama</strong> berdasarkan teori kecerdasan majemuk Howard Gardner.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { code: 'K1', label: 'Intelektual Umum', icon: 'psychology', color: '#3525cd', desc: 'Kemampuan berpikir logis, memori kuat, dan pemahaman konsep abstrak.' },
                    { code: 'K2', label: 'Akademik Khusus', icon: 'school', color: '#0077b6', desc: 'Prestasi unggul pada bidang tertentu seperti matematika, sains, atau bahasa.' },
                    { code: 'K3', label: 'Berpikir Kreatif', icon: 'lightbulb', color: '#7c4dff', desc: 'Kemampuan menghasilkan ide baru, inovatif, dan berani berekspresi.' },
                    { code: 'K4', label: 'Kepemimpinan', icon: 'groups', color: '#d4760f', desc: 'Kemampuan memimpin, mempengaruhi, dan mengorganisir kelompok.' },
                    { code: 'K5', label: 'Seni Visual & Pertunjukan', icon: 'palette', color: '#ba1a1a', desc: 'Bakat pada bidang seni rupa, musik, tari, atau drama.' },
                    { code: 'K6', label: 'Psikomotorik', icon: 'directions_run', color: '#5c6b1e', desc: 'Kemampuan motorik halus/kasar, olahraga, dan koordinasi gerak tubuh.' },
                  ].map((k) => (
                    <div key={k.code} className="p-4 bg-white rounded-2xl border border-[#c7c4d8]/40 shadow-sm flex gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: k.color + '18' }}>
                        <span className="material-symbols-outlined text-[18px]" style={{ color: k.color, fontVariationSettings: "'FILL' 1" }}>{k.icon}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-mono font-bold" style={{ color: k.color }}>{k.code}</span>
                          <span className="text-xs font-bold text-[#191c1e]">{k.label}</span>
                        </div>
                        <p className="text-[11px] text-[#777587] leading-relaxed">{k.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <InfoBox icon="add_circle" title="Menambah Kategori Bakat Baru" color="#7c4dff">
                  Admin dapat menambah kriteria baru melalui tombol <strong>"Tambah Kriteria"</strong>. Isi Kode (misal K7), Nama, Deskripsi lengkap, dan Saran Stimulasi untuk orang tua. Kriteria baru akan langsung aktif setelah disimpan.
                </InfoBox>
              </section>
            )}

            {/* ══════════════════════ RULES ══════════════════════ */}
            {activeId === 'rules' && (
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#ba1a1a' }}>
                    <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>account_tree</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-[#191c1e]">Rule Builder</h1>
                    <p className="text-xs text-[#777587]">Inti sistem — mengelola aturan Forward Chaining</p>
                  </div>
                </div>

                <InfoBox icon="warning" title="Bagian Terpenting dalam Sistem" color="#ba1a1a">
                  Rule Builder adalah menu paling kritis. Kesalahan dalam pembuatan aturan di sini akan berdampak langsung pada akurasi hasil asesmen anak.
                </InfoBox>

                <p className="text-sm text-[#464555] leading-relaxed">
                  Sistem menggunakan metode <strong>Forward Chaining</strong> — menelusuri fakta dari jawaban asesmen menuju kesimpulan bakat secara bertahap melalui 2 level aturan.
                </p>

                <div className="p-5 bg-white rounded-2xl border border-[#c7c4d8]/40 shadow-sm space-y-2">
                  <p className="text-xs font-bold text-[#777587] uppercase tracking-wider mb-3">Alur Forward Chaining</p>
                  {[
                    { icon: 'quiz', label: 'Jawaban Asesmen (Skala Likert 1–5)', color: '#464555' },
                    { icon: 'tune', label: 'Variabel Masukan (≥ Threshold → TRUE)', color: '#00677a' },
                    { icon: 'leaderboard', label: 'Indikator Bakat (Aturan Level 1)', color: '#7c4dff' },
                    { icon: 'verified', label: 'Kriteria Evaluasi (Aturan Level 2)', color: '#d4760f' },
                    { icon: 'emoji_events', label: 'Hasil Analisis — Top 3 Bakat Anak', color: '#3525cd' },
                  ].map((step, i, arr) => (
                    <div key={step.label}>
                      <div className="flex items-center gap-3 py-1">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: step.color + '15' }}>
                          <span className="material-symbols-outlined text-[16px]" style={{ color: step.color, fontVariationSettings: "'FILL' 1" }}>{step.icon}</span>
                        </div>
                        <span className="text-xs font-semibold" style={{ color: step.color }}>{step.label}</span>
                      </div>
                      {i < arr.length - 1 && <div className="ml-4 w-0.5 h-3 bg-[#c7c4d8] rounded" />}
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-2xl border border-[#c7c4d8]/40 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge text="Level 1 (L1)" color="#7c4dff" />
                      <span className="text-sm font-bold">Aturan Variabel → Indikator</span>
                    </div>
                    <p className="text-xs text-[#464555] leading-relaxed">Menghubungkan satu atau lebih <strong>Variabel Masukan</strong> ke sebuah <strong>Indikator Bakat</strong>. Indikator dianggap terpenuhi jika <em>seluruh</em> variabel yang terhubung bernilai TRUE (jawaban ≥ threshold).</p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-[#c7c4d8]/40 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge text="Level 2 (L2)" color="#d4760f" />
                      <span className="text-sm font-bold">Aturan Indikator → Kriteria</span>
                    </div>
                    <p className="text-xs text-[#464555] leading-relaxed">Menghubungkan satu atau lebih <strong>Indikator</strong> ke sebuah <strong>Kriteria Bakat</strong>. Kriteria terpenuhi jika seluruh indikator yang terhubung bernilai TRUE.</p>
                  </div>
                </div>
              </section>
            )}

            {/* ══════════════════════ ENGINE ══════════════════════ */}
            {activeId === 'engine' && (
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#5c6b1e' }}>
                    <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>settings</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-[#191c1e]">Pengaturan Engine</h1>
                    <p className="text-xs text-[#777587]">Mengatur parameter mesin inferensi</p>
                  </div>
                </div>

                <p className="text-sm text-[#464555] leading-relaxed">
                  Pengaturan Engine memungkinkan admin mengkonfigurasi parameter inti dari mesin inferensi Forward Chaining, khususnya nilai <strong>Threshold Likert</strong>.
                </p>

                <div className="p-5 bg-white rounded-2xl border border-[#c7c4d8]/40 shadow-sm space-y-4">
                  <p className="text-sm font-bold">Apa itu Threshold?</p>
                  <p className="text-xs text-[#464555] leading-relaxed">Threshold menentukan batas minimal nilai jawaban Likert yang dianggap <em>memenuhi</em> suatu variabel (bernilai TRUE). Default threshold adalah <strong>4</strong>.</p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#f8fafc] text-left">
                          <th className="px-4 py-2 border border-[#c7c4d8]/40 font-bold">Nilai</th>
                          <th className="px-4 py-2 border border-[#c7c4d8]/40 font-bold">Label Jawaban</th>
                          <th className="px-4 py-2 border border-[#c7c4d8]/40 font-bold text-center">Threshold = 4</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { val: '1', label: 'Tidak Pernah', pass: false },
                          { val: '2', label: 'Jarang', pass: false },
                          { val: '3', label: 'Kadang', pass: false },
                          { val: '4', label: 'Sering', pass: true },
                          { val: '5', label: 'Selalu', pass: true },
                        ].map((row) => (
                          <tr key={row.val} className={row.pass ? 'bg-emerald-50' : ''}>
                            <td className="px-4 py-2 border border-[#c7c4d8]/40 font-mono font-bold">{row.val}</td>
                            <td className="px-4 py-2 border border-[#c7c4d8]/40">{row.label}</td>
                            <td className="px-4 py-2 border border-[#c7c4d8]/40 text-center">
                              {row.pass
                                ? <span className="inline-flex items-center gap-1 text-emerald-700 font-bold"><span className="material-symbols-outlined text-[14px]">check_circle</span> Terpenuhi</span>
                                : <span className="inline-flex items-center gap-1 text-rose-600 font-bold"><span className="material-symbols-outlined text-[14px]">cancel</span> Tidak</span>
                              }
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <InfoBox icon="lightbulb" title="Cara Mengubah Threshold" color="#5c6b1e">
                  Masuk ke menu <strong>Pengaturan</strong> di sidebar. Ubah nilai threshold dan klik Simpan. Perubahan langsung berdampak pada proses asesmen berikutnya.
                </InfoBox>
              </section>
            )}

            {/* ══════════════════════ ANAK ══════════════════════ */}
            {activeId === 'anak' && (
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#006876' }}>
                    <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>child_care</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-[#191c1e]">Kelola Anak & Konsultasi</h1>
                    <p className="text-xs text-[#777587]">Memantau seluruh proses asesmen yang dilakukan pengguna</p>
                  </div>
                </div>

                <p className="text-sm text-[#464555] leading-relaxed">
                  Menu ini digunakan untuk memantau seluruh proses asesmen yang dilakukan oleh orang tua atau guru. Admin memiliki akses penuh untuk menelusuri data dan hasil asesmen.
                </p>

                <div className="space-y-3">
                  {[
                    { action: 'Melihat Data Anak', icon: 'person_search', desc: 'Lihat daftar seluruh profil anak yang telah terdaftar, lengkap dengan nama, tanggal lahir, jenis kelamin, dan kelompok usia yang terdeteksi.' },
                    { action: 'Melihat Riwayat Asesmen', icon: 'history', desc: 'Akses riwayat semua sesi asesmen per anak, termasuk tanggal dan status penyelesaian.' },
                    { action: 'Melihat Jawaban Pengguna', icon: 'fact_check', desc: 'Detail jawaban per butir pertanyaan yang diberikan pengguna pada setiap sesi asesmen.' },
                    { action: 'Melihat Hasil Analisis', icon: 'analytics', desc: 'Hasil lengkap forward chaining termasuk Top 3 bakat, skor persentase masing-masing kriteria, dan trace log alur penalaran.' },
                  ].map((item) => (
                    <div key={item.action} className="flex gap-4 p-4 bg-white rounded-2xl border border-[#c7c4d8]/40 shadow-sm">
                      <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5 text-[#006876]" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                      <div>
                        <p className="text-sm font-bold text-[#191c1e]">{item.action}</p>
                        <p className="text-xs text-[#464555] leading-relaxed mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ══════════════════════ DEMO ══════════════════════ */}
            {activeId === 'demo' && (
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#6d3b8f' }}>
                    <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-[#191c1e]">Tutorial Demo</h1>
                    <p className="text-xs text-[#777587]">Contoh lengkap menambahkan kategori bakat baru</p>
                  </div>
                </div>

                <InfoBox icon="auto_awesome" title="Skenario Demo" color="#6d3b8f">
                  Tutorial ini memandu Anda menambahkan kategori bakat <strong>"Kecerdasan Naturalis"</strong> secara lengkap — dari variabel, indikator, kriteria, hingga aturan hubungan.
                </InfoBox>

                {[
                  {
                    step: 1, label: 'Tambahkan Kriteria Hasil Akhir',
                    icon: 'verified', color: '#d4760f',
                    route: '/admin/criteria',
                    routeLabel: 'Buka Kelola Kriteria',
                    items: [
                      'Masuk ke menu Kriteria (Manajemen Kriteria)',
                      'Klik tombol "Tambah Kriteria" di kanan atas',
                      'Isi: Kode = K7, Nama = Kecerdasan Naturalis',
                      'Isi deskripsi: "Anak menunjukkan kepekaan tinggi terhadap alam, flora, dan fauna..."',
                      'Isi saran stimulasi: "Ajak anak berkebun, mengamati hewan, atau berwisata alam..."',
                      'Klik Simpan ✓',
                    ]
                  },
                  {
                    step: 2, label: 'Tambahkan Indikator Bakat Terkait',
                    icon: 'leaderboard', color: '#7c4dff',
                    route: '/admin/indicators',
                    routeLabel: 'Buka Kelola Indikator',
                    items: [
                      'Masuk ke menu Indikator (Manajemen Indikator)',
                      'Klik tombol "Tambah Indikator" di kanan atas',
                      'Isi: Kode = I28, Nama = Ketertarikan Tinggi pada Flora/Fauna & Alam Bebas',
                      'Pilih Kelompok Usia yang sesuai',
                      'Klik Simpan ✓',
                    ]
                  },
                  {
                    step: 3, label: 'Tambahkan Variabel Pertanyaan Baru',
                    icon: 'tune', color: '#00677a',
                    route: '/admin/variables',
                    routeLabel: 'Buka Kelola Variabel',
                    items: [
                      'Masuk ke menu Variabel (Manajemen Variabel)',
                      'Klik tombol "Tambah Variabel"',
                      'Isi: Kode = C84',
                      'Pada kolom Kategori: ketik "Naturalist" (kategori baru!)',
                      'Isi teks pertanyaan: "Anak sering mengamati dan tertarik pada tumbuhan atau hewan di sekitarnya"',
                      'Klik Simpan ✓',
                      '→ Tombol filter "Naturalist" otomatis muncul di tabel!',
                    ]
                  },
                  {
                    step: 4, label: 'Hubungkan Aturan di Rule Builder',
                    icon: 'account_tree', color: '#ba1a1a',
                    route: '/admin/rules',
                    routeLabel: 'Buka Rule Builder',
                    items: [
                      'Masuk ke menu Pembuat Aturan (Rule Builder)',
                      'Pada bagian Level L1: klik "Tambah Aturan L1"',
                      'Hubungkan: Variabel C84 → Indikator I28, lalu klik Simpan',
                      'Pada bagian Level L2: klik "Tambah Aturan L2"',
                      'Hubungkan: Indikator I28 → Kriteria K7, lalu klik Simpan ✓',
                      '→ Sistem siap mendeteksi bakat Naturalis!',
                    ]
                  },
                ].map((tutorial) => (
                  <div key={tutorial.step} className="bg-white rounded-2xl border border-[#c7c4d8]/40 shadow-sm overflow-hidden">
                    <div className="flex items-center gap-3 px-5 py-4" style={{ background: tutorial.color + '10', borderBottom: `1px solid ${tutorial.color}20` }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ background: tutorial.color }}>
                        {tutorial.step}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold" style={{ color: tutorial.color }}>{tutorial.label}</p>
                      </div>
                      <button
                        onClick={() => navigate(tutorial.route)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all hover:opacity-80"
                        style={{ background: tutorial.color, color: 'white' }}
                      >
                        <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                        {tutorial.routeLabel}
                      </button>
                    </div>
                    <ul className="px-5 py-4 space-y-2">
                      {tutorial.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-[#464555]">
                          <span className="material-symbols-outlined text-[14px] shrink-0 mt-0.5" style={{ color: tutorial.color }}>
                            {item.startsWith('→') ? 'check_circle' : 'arrow_right'}
                          </span>
                          <span className={item.startsWith('→') ? 'font-semibold text-emerald-700' : ''}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl">
                  <p className="text-xs font-bold text-amber-800 mb-2">🧹 Query SQL untuk Reset Data Demo</p>
                  <pre className="text-[11px] bg-amber-100 text-amber-900 rounded-xl p-3 overflow-x-auto font-mono leading-relaxed">{`-- 1. Hapus relasi aturan L1
DELETE FROM indicator_variables 
WHERE variable_code = 'C84' OR indicator_code = 'I28';

-- 2. Hapus relasi aturan L2
DELETE FROM criterion_indicators 
WHERE criterion_code = 'K7' OR indicator_code = 'I28';

-- 3. Hapus variabel, indikator, kriteria demo
DELETE FROM variables WHERE code = 'C84';
DELETE FROM indicators WHERE code = 'I28';
DELETE FROM criterions WHERE code = 'K7';`}</pre>
                </div>
              </section>
            )}

            {/* ══════════════════════ ALUR SISTEM ══════════════════════ */}
            {activeId === 'alur' && (
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#1e6b5c' }}>
                    <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>route</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-[#191c1e]">Cara Kerja Sistem</h1>
                    <p className="text-xs text-[#777587]">Alur lengkap dari login hingga hasil bakat</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { step: 1, icon: 'login', label: 'Orang Tua / Guru Login', desc: 'Pengguna membuat akun atau masuk menggunakan email dan password yang telah terdaftar.', color: '#3525cd' },
                    { step: 2, icon: 'child_care', label: 'Mengisi Data Anak', desc: 'Pengguna mengisi profil anak: nama, tanggal lahir, jenis kelamin. Sistem otomatis menentukan kelompok usia.', color: '#0077b6' },
                    { step: 3, icon: 'quiz', label: 'Mengisi Asesmen Kuesioner', desc: 'Sistem menampilkan pertanyaan yang sesuai dengan kelompok usia anak. Pengguna memilih skala 1–5 untuk setiap pertanyaan.', color: '#7c4dff' },
                    { step: 4, icon: 'psychology', label: 'Sistem Melakukan Forward Chaining', desc: 'Mesin inferensi memproses jawaban → evaluasi threshold → evaluasi L1 (variabel→indikator) → evaluasi L2 (indikator→kriteria).', color: '#d4760f' },
                    { step: 5, icon: 'emoji_events', label: 'Menampilkan Top 3 Bakat', desc: 'Hasil akhir disajikan dalam bentuk Top 3 kategori bakat dengan skor persentase dan deskripsi pengembangan.', color: '#5c6b1e' },
                    { step: 6, icon: 'save', label: 'Data Tersimpan pada Riwayat', desc: 'Seluruh jawaban, trace log inferensi, dan hasil asesmen disimpan permanen dan dapat diakses kapan saja melalui menu Riwayat.', color: '#006876' },
                  ].map((s, i, arr) => (
                    <div key={s.step}>
                      <div className="flex gap-4 p-4 bg-white rounded-2xl border border-[#c7c4d8]/40 shadow-sm">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: s.color + '18' }}>
                          <span className="material-symbols-outlined text-[18px]" style={{ color: s.color, fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-mono font-bold text-[#777587]">Langkah {s.step}</span>
                          </div>
                          <p className="text-sm font-bold text-[#191c1e]">{s.label}</p>
                          <p className="text-xs text-[#464555] leading-relaxed mt-0.5">{s.desc}</p>
                        </div>
                      </div>
                      {i < arr.length - 1 && (
                        <div className="flex justify-center py-0.5">
                          <span className="material-symbols-outlined text-[#c7c4d8]">arrow_downward</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ══════════════════════ FAQ ══════════════════════ */}
            {activeId === 'faq' && (
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[#444]">
                    <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>quiz</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-[#191c1e]">FAQ</h1>
                    <p className="text-xs text-[#777587]">Pertanyaan yang sering diajukan</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      q: 'Mengapa hasil asesmen tidak muncul?',
                      a: 'Pastikan seluruh pertanyaan telah dijawab sebelum asesmen dikirim. Sistem tidak akan memproses asesmen yang belum lengkap.',
                    },
                    {
                      q: 'Mengapa suatu kriteria tidak terpenuhi?',
                      a: 'Kemungkinan terdapat indikator pendukung yang belum memenuhi aturan berdasarkan nilai threshold. Periksa Rule Builder untuk memastikan relasi aturan L1 dan L2 sudah lengkap.',
                    },
                    {
                      q: 'Mengapa hasil hanya berupa kecenderungan bakat?',
                      a: 'Jika tidak ada aturan yang terpenuhi sepenuhnya, sistem akan menampilkan tiga kriteria dengan skor persentase tertinggi sebagai kecenderungan bakat. Ini adalah desain sistem yang intentional.',
                    },
                    {
                      q: 'Bagaimana jika ingin mengubah threshold?',
                      a: 'Masuk ke menu Pengaturan Engine di sidebar, lalu ubah nilai threshold sesuai kebutuhan dan klik Simpan.',
                    },
                    {
                      q: 'Bisakah admin menambah kategori bakat baru selain K1–K6?',
                      a: 'Ya, admin dapat menambah kriteria baru (misal K7 untuk Kecerdasan Naturalis) melalui menu Kelola Kriteria. Lihat Tutorial Demo untuk panduan lengkap.',
                    },
                    {
                      q: 'Apakah penghapusan variabel/indikator aman?',
                      a: 'Sistem secara otomatis menghapus relasi aturan terkait (cascading delete) saat variabel atau indikator dihapus, sehingga tidak ada data orphan yang tersisa.',
                    },
                  ].map((faq, i) => (
                    <div key={i} className="p-4 bg-white rounded-2xl border border-[#c7c4d8]/40 shadow-sm">
                      <p className="text-sm font-bold text-[#191c1e] mb-1.5 flex items-start gap-2">
                        <span className="text-[#3525cd] shrink-0">Q</span>
                        {faq.q}
                      </p>
                      <p className="text-xs text-[#464555] leading-relaxed pl-5">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ══════════════════════ TROUBLESHOOTING ══════════════════════ */}
            {activeId === 'trouble' && (
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#b54f00' }}>
                    <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>build</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-[#191c1e]">Troubleshooting</h1>
                    <p className="text-xs text-[#777587]">Solusi masalah umum yang ditemukan dalam sistem</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#c7c4d8]/40 shadow-sm overflow-hidden">
                  <table className="w-full text-sm border-collapse">
                    <thead className="bg-[#f8fafc]">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-bold text-[#464555] uppercase tracking-wider border-b border-[#c7c4d8]/40 w-1/2">⚠️ Permasalahan</th>
                        <th className="px-5 py-3 text-left text-xs font-bold text-[#464555] uppercase tracking-wider border-b border-[#c7c4d8]/40">✅ Solusi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#c7c4d8]/20">
                      {[
                        { p: 'Data tidak tersimpan', s: 'Pastikan seluruh field wajib (*) telah diisi dengan benar sebelum menekan Simpan.' },
                        { p: 'Hasil asesmen kosong', s: 'Periksa apakah relasi Variabel → Indikator → Kriteria sudah lengkap di Rule Builder.' },
                        { p: 'Kriteria tidak muncul dalam hasil', s: 'Pastikan aturan L1 dan L2 pada Rule Builder telah dibuat dan disimpan dengan benar.' },
                        { p: 'Statistik dashboard tidak berubah', s: 'Muat ulang halaman (Ctrl+R) atau pastikan asesmen telah selesai diproses sepenuhnya.' },
                        { p: 'Tombol hapus tidak berfungsi', s: 'Pastikan Anda memiliki token admin aktif. Coba logout dan login kembali jika sesi telah kedaluwarsa.' },
                        { p: 'Kategori baru tidak muncul di filter', s: 'Muat ulang halaman Variabel. Filter kategori dibuat secara dinamis berdasarkan data yang ada di database.' },
                        { p: 'Gagal login admin', s: 'Periksa kembali email dan password. Default: admin@talentaku.com / admin123. Hubungi developer jika masih gagal.' },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-[#f8fafc] transition-colors">
                          <td className="px-5 py-3 text-xs text-rose-700 font-semibold">{row.p}</td>
                          <td className="px-5 py-3 text-xs text-[#464555]">{row.s}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* ══════════════════════ SECURITY ══════════════════════ */}
            {activeId === 'security' && (
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#2d4a7a' }}>
                    <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-[#191c1e]">Keamanan Data</h1>
                    <p className="text-xs text-[#777587]">Perlindungan data pengguna dan integritas sistem</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      icon: 'lock',
                      title: 'Hashing Password dengan Bcrypt',
                      color: '#2d4a7a',
                      desc: 'Seluruh password — baik admin maupun pengguna biasa — disimpan dalam bentuk hash Bcrypt dengan salt factor 12. Password tidak pernah disimpan dalam bentuk teks biasa (plaintext) di database.',
                    },
                    {
                      icon: 'token',
                      title: 'Autentikasi JWT (JSON Web Token)',
                      color: '#0077b6',
                      desc: 'Setiap sesi login menghasilkan JWT yang ditandatangani secara kriptografis. Token memiliki masa berlaku terbatas dan harus dikirim di setiap permintaan API yang memerlukan otorisasi.',
                    },
                    {
                      icon: 'manage_search',
                      title: 'Trace Log Inferensi',
                      color: '#5c6b1e',
                      desc: 'Setiap hasil asesmen disertai trace log yang merekam alur penalaran sistem secara detail: variabel mana yang terpenuhi, indikator mana yang aktif, dan mengapa suatu kriteria bakat dihasilkan. Berguna untuk audit dan transparansi.',
                    },
                    {
                      icon: 'verified_user',
                      title: 'Proteksi Rute Admin',
                      color: '#6d3b8f',
                      desc: 'Seluruh halaman admin dilindungi oleh middleware autentikasi. Pengguna yang tidak memiliki token admin valid akan otomatis diarahkan ke halaman login.',
                    },
                    {
                      icon: 'delete_sweep',
                      title: 'Cascading Delete yang Aman',
                      color: '#ba1a1a',
                      desc: 'Penghapusan data variabel atau indikator secara otomatis membersihkan seluruh relasi aturan yang terkait dalam satu transaksi database, mencegah data orphan yang dapat merusak integritas sistem.',
                    },
                  ].map((item) => (
                    <div key={item.title} className="p-5 bg-white rounded-2xl border border-[#c7c4d8]/40 shadow-sm flex gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: item.color + '18' }}>
                        <span className="material-symbols-outlined text-[20px]" style={{ color: item.color, fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#191c1e] mb-1">{item.title}</p>
                        <p className="text-xs text-[#464555] leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>
        </div>
      </main>
    </div>
  )
}
