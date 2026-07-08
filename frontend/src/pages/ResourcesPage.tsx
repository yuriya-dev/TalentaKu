import { useEffect, useState } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import MobileNav from '../components/layout/MobileNav'
import { API_BASE } from '../config'

const categories = [
  {
    code: 'K1',
    label: 'Intelektual Umum',
    icon: 'psychology',
    desc: 'Kemampuan intelektual menyeluruh, mencakup daya tangkap verbal yang baik, ingatan yang kuat, serta kemampuan berpikir menggunakan konsep abstrak.',
    variables: 'Diukur melalui 14 variabel perilaku (C1–C14) seperti kemampuan meniru kalimat panjang, mengingat lagu, dan menggunakan kata tanya secara tepat.',
    stimulus: 'Bacakan buku cerita interaktif, ajak berdiskusi tentang kegiatan sehari-hari, berikan tebak-tebakan kata, dan latih anak menceritakan kembali pengalamannya.'
  },
  {
    code: 'K2',
    label: 'Akademik Khusus',
    icon: 'school',
    desc: 'Kemampuan menonjol pada bidang akademik tertentu, khususnya konsep matematika dasar, pemahaman kuantitas benda, serta keingintahuan ilmiah terhadap alam sekitar.',
    variables: 'Diukur melalui 11 variabel perilaku (C15–C25) seperti mengurutkan angka 1-20, membedakan geometri, dan antusiasme mencampur warna atau bereksperimen dengan air.',
    stimulus: 'Bermain hitung benda nyata, mencocokkan angka dengan jumlah mainan, melakukan eksperimen sains sederhana di rumah (seperti tenggelam-terapung), dan mengeksplorasi alam.'
  },
  {
    code: 'K3',
    label: 'Berpikir Kreatif',
    icon: 'palette',
    desc: 'Kemampuan mengemukakan ide unik yang orisinal, menggambar ekspresif, menunjukkan empati sosial yang tinggi, serta mandiri dalam bertindak.',
    variables: 'Diukur melalui 23 variabel perilaku (C26–C48) seperti keberanian berpendapat, menggambar bebas, menghargai karya teman, serta ketaatan aturan bermain.',
    stimulus: 'Sediakan beragam media seni (cat, spidol, tanah liat), hargai setiap gagasan barunya tanpa langsung mengoreksi, dan libatkan dalam kegiatan bermain peran.'
  },
  {
    code: 'K4',
    label: 'Kepemimpinan',
    icon: 'groups',
    desc: 'Kemampuan sosial untuk memimpin teman sebaya, bertanggung jawab terhadap tugas, bekerja sama dengan baik, mengendalikan emosi, serta bersikap kooperatif.',
    variables: 'Diukur melalui 14 variabel perilaku (C49–C62) seperti keberanian bertanya di kelas, inisiatif membantu teman, membagi peran kelompok, dan sabar mengantre.',
    stimulus: 'Berikan tanggung jawab kecil di rumah (seperti merapikan mainan), libatkan dalam permainan kelompok bergiliran (board games), dan latih mendengarkan pendapat orang lain.'
  },
  {
    code: 'K5',
    label: 'Seni Rupa & Pertunjukan',
    icon: 'theater_comedy',
    desc: 'Kepekaan estetika tinggi pada bidang seni visual (melukis detail), musik (peka nada dan ritme), serta seni pertunjukan (ekspresi gerakan tubuh dan bermain peran).',
    variables: 'Diukur melalui 7 variabel perilaku (C63–C69) seperti melukis proporsional, memainkan ketukan musik, menyelaraskan gerakan tari, dan totalitas bermain peran.',
    stimulus: 'Kenalkan alat musik anak-anak, dengarkan lagu dengan ketukan bervariasi, menari bebas mengikuti musik, dan ajak bermain peran menggunakan boneka tangan.'
  },
  {
    code: 'K6',
    label: 'Psikomotorik',
    icon: 'fitness_center',
    desc: 'Keterampilan fisik dan motorik yang matang, mencakup keseimbangan motorik kasar serta kelenturan dan presisi motorik halus.',
    variables: 'Diukur melalui 14 variabel perilaku (C70–C83) seperti menangkap bola dengan terarah, berjalan di papan titian, mengancingkan baju, melipat origami, dan merakit komponen mainan.',
    stimulus: 'Ajak bersepeda, berlari di taman, berdiri satu kaki, meronce manik-manik, melipat kertas origami dasar, dan merakit mainan bongkar-pasang mekanik.'
  }
]

const faqs = [
  {
    q: 'Bagaimana cara orang tua melakukan observasi secara objektif?',
    a: 'Amatilah anak dalam kondisi santai/bermain sehari-hari tanpa menekannya untuk melakukan sesuatu secara instan. Jawablah kuesioner berdasarkan kebiasaan yang benar-benar sering ia lakukan secara mandiri dalam beberapa minggu terakhir.'
  },
  {
    q: 'Apa perbedaan antara "Bakat Teridentifikasi" dan "Kecenderungan Bakat"?',
    a: 'Bakat Teridentifikasi berarti anak memenuhi kriteria aturan inferensi Forward Chaining secara penuh (semua indikator terpenuhi). Kecenderungan Bakat berarti sistem melihat skor kecocokan tertinggi pada kategori tersebut, meskipun beberapa syarat biner belum terpenuhi sepenuhnya.'
  },
  {
    q: 'Berapa lama waktu yang dibutuhkan untuk menyelesaikan asesmen?',
    a: 'Asesmen terdiri dari 83 pertanyaan observasi singkat. Biasanya memakan waktu sekitar 10 hingga 15 menit. Anda dapat mengerjakannya secara santai dan kembali ke halaman sebelumnya jika ingin merevisi jawaban.'
  },
  {
    q: 'Apakah hasil asesmen ini bersifat mutlak?',
    a: 'Tidak. Aplikasi ini berfungsi sebagai sistem penyaringan awal (screening) berbasis kecerdasan buatan dan penelitian ilmiah. Hasilnya sangat bermanfaat untuk stimulasi dini, namun untuk diagnosis formal silakan berkonsultasi dengan psikolog anak profesional.'
  }
]

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<'bakat' | 'metode' | 'panduan' | 'kontribusi'>('bakat')
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  // Suggestion form states
  const [userName, setUserName] = useState('')
  const [suggCategory, setSuggCategory] = useState('Umum')
  const [suggSubject, setSuggSubject] = useState('')
  const [suggMessage, setSuggMessage] = useState('')
  const [suggLoading, setSuggLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [successToast, setSuccessToast] = useState<string | null>(null)
  const [errorToast, setErrorToast] = useState<string | null>(null)

  const handleSubmitSuggestion = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuggLoading(true)
    setErrorToast(null)

    try {
      const token = localStorage.getItem('user_token')
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const res = await fetch(`${API_BASE}/api/suggestions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          user_name: userName.trim(),
          category: suggCategory,
          subject: suggSubject.trim(),
          message: suggMessage.trim(),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal mengirim saran.')

      setSubmitted(true)
      setSuccessToast(data.message || 'Saran berhasil dikirim!')
      setTimeout(() => setSuccessToast(null), 5000)
    } catch (err: any) {
      setErrorToast(err.message || 'Terjadi kesalahan.')
      setTimeout(() => setErrorToast(null), 4000)
    } finally {
      setSuggLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'Sumber Daya & Metodologi | TalentaKu'
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] font-sans min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-12 pb-24 px-4 md:px-10 max-w-screen-xl mx-auto w-full">
        {/* Page Header */}
        <header className="text-center mb-12 space-y-4">
          <span className="inline-flex items-center gap-2 bg-[#3525cd]/10 px-4 py-2 rounded-full text-[#3525cd]">
            <span className="material-symbols-outlined text-sm">library_books</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Sumber Informasi & Metodologi</span>
          </span>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-[#191c1e]">
            Memahami Potensi Anak
          </h1>
          <p className="text-lg text-[#464555] max-w-2xl mx-auto">
            Pelajari landasan ilmiah di balik evaluasi bakat anak serta cara mengoptimalkan stimulasi tumbuh kembang mereka.
          </p>
        </header>

        {/* Tab Controls */}
        <div className="flex border-b border-[#c7c4d8]/40 mb-10 overflow-x-auto gap-2 md:gap-8 justify-start md:justify-center">
          {[
            { id: 'bakat', label: '6 Kategori Bakat', icon: 'stars' },
            { id: 'metode', label: 'Metodologi Forward Chaining', icon: 'account_tree' },
            { id: 'panduan', label: 'Panduan Observasi & FAQ', icon: 'help_center' },
            { id: 'kontribusi', label: 'Saran & Masukan', icon: 'volunteer_activism' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all shrink-0 pb-4 ${
                activeTab === tab.id
                  ? 'border-[#3525cd] text-[#3525cd] font-bold'
                  : 'border-transparent text-[#464555] hover:text-[#3525cd]'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="min-h-[400px]">

          {/* TAB 1: KATEGORI BAKAT */}
          {activeTab === 'bakat' && (
            <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
              {categories.map((cat) => (
                <div key={cat.code} className="clay-card p-6 md:p-8 relative overflow-hidden group">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-[#3525cd]/10 rounded-xl flex items-center justify-center text-[#3525cd] shrink-0">
                      <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-[#3525cd]/15 text-[#3525cd] px-1.5 py-0.5 rounded font-mono">{cat.code}</span>
                        <h3 className="text-xl font-bold">{cat.label}</h3>
                      </div>
                      <p className="text-sm text-[#464555] mt-2 leading-relaxed">{cat.desc}</p>
                    </div>
                  </div>
                  <div className="space-y-4 pt-4 border-t border-dashed border-[#c7c4d8]/30">
                    <div>
                      <h4 className="text-xs font-bold text-[#3525cd] uppercase tracking-wider mb-1">Bagaimana kami mengukurnya:</h4>
                      <p className="text-xs text-[#464555] leading-relaxed">{cat.variables}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Tips Stimulasi Orang Tua:</h4>
                      <p className="text-xs text-[#464555] leading-relaxed">{cat.stimulus}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: METODE INFERENSI */}
          {activeTab === 'metode' && (
            <div className="clay-card p-8 md:p-12 space-y-10 animate-fade-in">
              <section className="space-y-4">
                <h3 className="text-2xl font-bold text-[#3525cd]">Bagaimana Sistem Pakar Bekerja?</h3>
                <p className="text-base text-[#464555] leading-relaxed">
                  Aplikasi <strong>TalentaKu</strong> didasarkan pada penelitian ilmiah sistem pakar oleh <strong>Salisah, Lidya, dan Defit (2015)</strong> yang memanfaatkan metode <strong>Forward Chaining</strong>. Metode ini melakukan pelacakan ke depan dimulai dari fakta-fakta perilaku anak yang diamati untuk menarik kesimpulan jenis bakat anak.
                </p>
              </section>

              <section className="p-6 bg-[#f2f4f6] rounded-2xl border border-[#c7c4d8]/40 relative overflow-hidden">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#191c1e] mb-4">Hierarki Inferensi 2 Tingkat</h4>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 text-center max-w-3xl mx-auto">
                  <div className="bg-white border border-[#c7c4d8]/80 p-4 rounded-xl shadow-sm flex-1 w-full">
                    <span className="material-symbols-outlined text-[#3525cd] text-3xl mb-1">checklist_rtl</span>
                    <h5 className="font-bold text-sm">83 Variabel Perilaku</h5>
                    <p className="text-[11px] text-[#464555] mt-1">Fakta observasi harian anak (C1 - C83)</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 rotate-90 md:rotate-0 text-2xl">arrow_forward</span>
                  <div className="bg-white border border-[#c7c4d8]/40 p-4 rounded-xl shadow-sm flex-1 w-full">
                    <span className="material-symbols-outlined text-[#00687a] text-3xl mb-1">hub</span>
                    <h5 className="font-bold text-sm text-[#00687a]">27 Indikator Bakat</h5>
                    <p className="text-[11px] text-[#464555] mt-1">Evaluasi aturan Level 1 (I1 - I27)</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 rotate-90 md:rotate-0 text-2xl">arrow_forward</span>
                  <div className="bg-[#3525cd] text-white p-4 rounded-xl shadow-md flex-1 w-full">
                    <span className="material-symbols-outlined text-white text-3xl mb-1">workspace_premium</span>
                    <h5 className="font-bold text-sm">6 Kriteria Bakat</h5>
                    <p className="text-[11px] text-white/80 mt-1">Evaluasi aturan Level 2 (K1 - K6)</p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-xl font-bold">Konversi Skala Likert ke Logika Biner</h3>
                <p className="text-sm text-[#464555] leading-relaxed">
                  Dalam penelitian asli di jurnal, masukan fakta bersifat biner (Ya/Tidak melalui checkbox). Untuk membuat pengalaman observasi lebih ramah dan akurat bagi orang tua, sistem kami mengadaptasinya dengan <strong>skala Likert 5 poin</strong>.
                </p>
                <div className="grid sm:grid-cols-2 gap-6 pt-2">
                  <div className="p-5 rounded-xl border border-[#c7c4d8]/40 bg-[#f8fafc]">
                    <h5 className="font-bold text-sm text-[#3525cd] mb-1">1. Ambang Batas Biner (Threshold)</h5>
                    <p className="text-xs text-[#464555] leading-relaxed">
                      Respons orang tua berskala 1 sampai 5. Suatu variabel perilaku (C-code) dinyatakan terpenuhi (<strong>TRUE</strong>) hanya jika anak melakukannya dalam tingkatan <strong>Sering (4)</strong> atau <strong>Selalu (5)</strong>. Nilai threshold ini dapat disesuaikan di dasbor admin.
                    </p>
                  </div>
                  <div className="p-5 rounded-xl border border-[#c7c4d8]/40 bg-[#f8fafc]">
                    <h5 className="font-bold text-sm text-[#00687a] mb-1">2. Skor Persentase Keyakinan</h5>
                    <p className="text-xs text-[#464555] leading-relaxed">
                      Sistem menghitung persentase rata-rata respons untuk menghasilkan skor kecocokan dalam skala 0–100%. Ini berguna untuk menampilkan bakat alternatif (peringkat kedua dan ketiga) meskipun aturan biner tidak terpenuhi sepenuhnya.
                    </p>
                  </div>
                </div>
              </section>

              <section className="pt-6 border-t border-[#c7c4d8]/30 flex flex-col md:flex-row gap-4 items-center justify-between text-xs text-[#464555]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#3525cd] text-xl">menu_book</span>
                  <span><strong>Jurnal Referensi:</strong> Salisah, Lidya, & Defit (2015). Jurnal Rekayasa dan Manajemen Sistem Informasi Vol. 1, No. 2.</span>
                </div>
                <a
                  href="https://ejournal.uin-suska.ac.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#3525cd] font-bold hover:underline shrink-0"
                >
                  Kunjungi Jurnal UIN Suska
                </a>
              </section>
            </div>
          )}

          {/* TAB 3: PANDUAN & FAQ */}
          {activeTab === 'panduan' && (
            <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
              <div className="clay-card p-8 space-y-6">
                <h3 className="text-2xl font-bold">Panduan Observasi Mandiri</h3>
                <div className="grid gap-6 text-sm">
                  {[
                    { n: 1, title: 'Fokus pada Kebiasaan Berulang', desc: 'Jangan menilai berdasarkan kejadian satu kali saja. Nilailah perilaku yang konsisten dilakukan anak dalam aktivitas bermain maupun bersosialisasi.' },
                    { n: 2, title: 'Berikan Contoh Nyata', desc: 'Gunakan bantuan teks "Misal" di bawah setiap pertanyaan untuk mencocokkan tindakan spesifik anak Anda dengan indikator perilaku yang dimaksud.' },
                    { n: 3, title: 'Hindari Bias Penilaian', desc: 'Orang tua cenderung memandang anak selalu hebat. Cobalah menilai secara realistis dan objektif agar sistem dapat memetakan kekuatan asli anak secara presisi.' },
                  ].map((s) => (
                    <div key={s.n} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">{s.n}</div>
                      <div>
                        <h4 className="font-bold mb-1">{s.title}</h4>
                        <p className="text-[#464555] leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-center mb-6">Tanya Jawab (FAQ)</h3>
                {faqs.map((faq, idx) => (
                  <div key={idx} className="bg-white border border-[#c7c4d8]/40 rounded-2xl overflow-hidden shadow-sm">
                    <button
                      onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left font-semibold text-base focus:outline-none hover:bg-slate-50 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <span className="material-symbols-outlined text-[#777587] transition-transform duration-200" style={{ transform: faqOpen === idx ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        expand_more
                      </span>
                    </button>
                    {faqOpen === idx && (
                      <div className="px-6 pb-5 pt-1 text-sm text-[#464555] leading-relaxed border-t border-[#c7c4d8]/10 bg-[#fbfcfd]">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SARAN & MASUKAN */}
          {activeTab === 'kontribusi' && (
            <div className="animate-fade-in max-w-2xl mx-auto space-y-8">
              {/* Toast */}
              {successToast && (
                <div className="fixed top-20 right-10 z-[110] bg-emerald-600 text-white px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-2 text-sm">
                  <span className="material-symbols-outlined">check_circle</span>
                  <span>{successToast}</span>
                </div>
              )}
              {errorToast && (
                <div className="fixed top-20 right-10 z-[110] bg-rose-600 text-white px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-2 text-sm">
                  <span className="material-symbols-outlined">error</span>
                  <span>{errorToast}</span>
                </div>
              )}

              {/* Header info */}
              <div className="bg-[#3525cd]/8 border border-[#3525cd]/20 rounded-[2rem] p-6 flex gap-4">
                <div className="w-10 h-10 bg-[#3525cd] rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#3525cd] mb-1">Kirim Saran & Masukan</h3>
                  <p className="text-sm text-[#464555] leading-relaxed">
                    Punya ide variabel pertanyaan baru, indikator bakat, atau masukan lain untuk memperkaya sistem TalentaKu? Sampaikan di sini — tim kami akan meninjau dan mempertimbangkan setiap masukan yang masuk.
                  </p>
                </div>
              </div>

              {submitted ? (
                <div className="bg-white border border-[#c7c4d8]/40 rounded-[2rem] p-10 text-center shadow-sm space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-emerald-600 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#191c1e]">Terima Kasih! 🎉</h3>
                  <p className="text-sm text-[#464555]">Saran Anda telah berhasil dikirim dan akan ditinjau oleh tim admin TalentaKu.</p>
                  <button
                    onClick={() => { setSubmitted(false); setSuggSubject(''); setSuggMessage(''); setUserName('') }}
                    className="mt-2 text-sm text-[#3525cd] font-semibold hover:underline"
                  >
                    Kirim saran lainnya →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitSuggestion} className="bg-white border border-[#c7c4d8]/40 rounded-[2rem] p-6 md:p-8 shadow-sm space-y-5">
                  {/* Nama */}
                  <div>
                    <label className="text-xs font-bold text-[#464555] block mb-1.5">Nama Anda <span className="text-[#777587] font-normal">(opsional)</span></label>
                    <input
                      type="text"
                      placeholder="Misal: Budi Santoso"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-sm outline-none bg-[#fbfcfd] font-medium transition-colors"
                    />
                  </div>

                  {/* Kategori */}
                  <div>
                    <label className="text-xs font-bold text-[#464555] block mb-1.5">Kategori Masukan <span className="text-rose-500">*</span></label>
                    <div className="flex flex-wrap gap-2">
                      {['Variabel', 'Indikator', 'Kriteria Bakat', 'Umum', 'Lainnya'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSuggCategory(cat)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                            suggCategory === cat
                              ? 'bg-[#3525cd] text-white border-[#3525cd]'
                              : 'border-[#c7c4d8]/60 text-[#464555] hover:border-[#3525cd]/50'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subjek */}
                  <div>
                    <label className="text-xs font-bold text-[#464555] block mb-1.5">Subjek / Judul Saran <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder={
                        suggCategory === 'Variabel' ? 'Contoh: Tambah variabel observasi alam bebas'
                        : suggCategory === 'Indikator' ? 'Contoh: Indikator ketertarikan terhadap flora/fauna'
                        : 'Contoh: Saran perbaikan sistem'
                      }
                      value={suggSubject}
                      onChange={(e) => setSuggSubject(e.target.value)}
                      maxLength={200}
                      className="w-full px-4 py-2.5 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-sm outline-none bg-[#fbfcfd] font-medium transition-colors"
                    />
                  </div>

                  {/* Pesan */}
                  <div>
                    <label className="text-xs font-bold text-[#464555] block mb-1.5">Isi Saran / Masukan <span className="text-rose-500">*</span></label>
                    <textarea
                      required
                      rows={5}
                      placeholder={
                        suggCategory === 'Variabel'
                          ? 'Jelaskan teks pertanyaan observasi yang Anda usulkan, beserta alasan mengapa perilaku ini relevan untuk mendeteksi bakat anak...'
                          : 'Jelaskan saran atau masukan Anda secara detail...'
                      }
                      value={suggMessage}
                      onChange={(e) => setSuggMessage(e.target.value)}
                      maxLength={2000}
                      className="w-full px-4 py-2.5 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-sm outline-none bg-[#fbfcfd] font-medium transition-colors resize-none leading-relaxed"
                    />
                    <p className="text-[11px] text-[#777587] mt-1 text-right">{suggMessage.length}/2000 karakter</p>
                  </div>

                  <button
                    type="submit"
                    disabled={suggLoading}
                    className="w-full py-3 bg-[#3525cd] text-white rounded-xl text-sm font-bold hover:brightness-110 shadow-md active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {suggLoading ? (
                      <><span className="material-symbols-outlined text-[18px]" style={{ animation: 'spin 1s linear infinite' }}>progress_activity</span> Mengirim...</>
                    ) : (
                      <><span className="material-symbols-outlined text-[18px]">send</span> Kirim Saran</>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-[#777587]">
                    Saran diterima sebagai masukan dan tidak langsung masuk ke sistem. Tim admin akan meninjau setiap saran secara manual.
                  </p>
                </form>
              )}

              {/* Tips */}
              <div className="bg-white border border-[#c7c4d8]/40 rounded-[2rem] p-6 shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-[#191c1e] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#d4760f]" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
                  Tips Saran yang Berkualitas
                </h4>
                <ul className="space-y-2">
                  {[
                    { text: 'Saran Variabel: Jelaskan perilaku spesifik yang dapat diamati orang tua/guru dalam kehidupan sehari-hari anak.' },
                    { text: 'Saran Indikator: Sebutkan aspek kemampuan apa yang ingin diukur dan kaitannya dengan kategori bakat tertentu.' },
                    { text: 'Saran Kriteria: Jelaskan definisi bakat baru beserta ciri-ciri dan cara stimulasinya.' },
                    { text: 'Sertakan referensi ilmiah atau pengalaman nyata jika memungkinkan untuk memperkuat saran Anda.' },
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-[#464555]">
                      <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5 text-[#3525cd]">arrow_right</span>
                      <span>{tip.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  )
}
