import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import MobileNav from '../components/layout/MobileNav'

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

  // User login status
  const [userToken, setUserToken] = useState<string | null>(null)

  // Form states for Variable
  const [varCode, setVarCode] = useState('')
  const [varLabel, setVarLabel] = useState('')
  const [varCategory, setVarCategory] = useState('General Intellectual')
  const [varAgeGroup, setVarAgeGroup] = useState('preschool')
  const [varLoading, setVarLoading] = useState(false)

  // Form states for Indicator
  const [indCode, setIndCode] = useState('')
  const [indLabel, setIndLabel] = useState('')
  const [indAgeGroup, setIndAgeGroup] = useState('preschool')
  const [indLoading, setIndLoading] = useState(false)

  const [successToast, setSuccessToast] = useState<string | null>(null)
  const [errorToast, setErrorToast] = useState<string | null>(null)

  const handleAddVariable = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userToken) return
    setVarLoading(true)
    setErrorToast(null)
    setSuccessToast(null)

    try {
      const res = await fetch('http://localhost:8080/api/user/variables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          code: varCode.trim(),
          label: varLabel.trim(),
          category: varCategory,
          age_group: varAgeGroup
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Gagal menambahkan variabel.')
      }

      setSuccessToast('Variabel masukan baru berhasil ditambahkan!')
      setVarCode('')
      setVarLabel('')
      setTimeout(() => setSuccessToast(null), 4000)
    } catch (err: any) {
      setErrorToast(err.message || 'Terjadi kesalahan.')
      setTimeout(() => setErrorToast(null), 4000)
    } finally {
      setVarLoading(false)
    }
  }

  const handleAddIndicator = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userToken) return
    setIndLoading(true)
    setErrorToast(null)
    setSuccessToast(null)

    try {
      const res = await fetch('http://localhost:8080/api/user/indicators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          code: indCode.trim(),
          label: indLabel.trim(),
          age_group: indAgeGroup
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Gagal menambahkan indikator.')
      }

      setSuccessToast('Indikator bakat baru berhasil ditambahkan!')
      setIndCode('')
      setIndLabel('')
      setTimeout(() => setSuccessToast(null), 4000)
    } catch (err: any) {
      setErrorToast(err.message || 'Terjadi kesalahan.')
      setTimeout(() => setErrorToast(null), 4000)
    } finally {
      setIndLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'Sumber Daya & Metodologi | TalentaKu'
    window.scrollTo(0, 0)
    
    // Check user token
    const token = localStorage.getItem('user_token')
    setUserToken(token)
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
            { id: 'kontribusi', label: 'Kontribusi Data', icon: 'volunteer_activism' }
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
              {/* Introduction */}
              <section className="space-y-4">
                <h3 className="text-2xl font-bold text-[#3525cd]">Bagaimana Sistem Pakar Bekerja?</h3>
                <p className="text-base text-[#464555] leading-relaxed">
                  Aplikasi <strong>TalentaKu</strong> didasarkan pada penelitian ilmiah sistem pakar oleh <strong>Salisah, Lidya, dan Defit (2015)</strong> yang memanfaatkan metode <strong>Forward Chaining</strong>. Metode ini melakukan pelacakan ke depan dimulai dari fakta-fakta perilaku anak yang diamati untuk menarik kesimpulan jenis bakat anak.
                </p>
              </section>

              {/* Chaining Hierarchy */}
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
                  <div className="bg-white bg-[#3525cd] text-white p-4 rounded-xl shadow-md flex-1 w-full">
                    <span className="material-symbols-outlined text-[#3525cd] text-3xl mb-1">workspace_premium</span>
                    <h5 className="font-bold text-sm text-[#3525cd]">6 Kriteria Bakat</h5>
                    <p className="text-[11px] text-[#464555] mt-1">Evaluasi aturan Level 2 (K1 - K6)</p>
                  </div>
                </div>
              </section>

              {/* Conversion explanation */}
              <section className="space-y-4">
                <h3 className="text-xl font-bold">Konversi Skala Likert ke Logika Biner</h3>
                <p className="text-sm text-[#464555] leading-relaxed">
                  Dalam penelitian asli di jurnal, masukan fakta bersifat biner (Ya/Tidak melalui checkbox). Untuk membuat pengalaman observasi lebih ramah dan akurat bagi orang tua, sistem kami mengadaptasinya dengan **skala Likert 5 poin**:
                </p>
                <div className="grid sm:grid-cols-2 gap-6 pt-2">
                  <div className="p-5 rounded-xl border border-[#c7c4d8]/40 bg-[#f8fafc]">
                    <h5 className="font-bold text-sm text-[#3525cd] mb-1">1. Ambang Batas Biner (Threshold)</h5>
                    <p className="text-xs text-[#464555] leading-relaxed">
                      Respons orang tua berskala 1 sampai 5. Suatu variabel perilaku (C-code) dinyatakan terpenuhi (**TRUE**) hanya jika anak melakukannya dalam tingkatan **Sering (4)** atau **Selalu (5)**. Nilai threshold ini dapat disesuaikan di dasbor admin.
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

              {/* Research citation */}
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
              {/* Observational Guidelines */}
              <div className="clay-card p-8 space-y-6">
                <h3 className="text-2xl font-bold">Panduan Observasi Mandiri</h3>
                <div className="grid gap-6 text-sm">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">1</div>
                    <div>
                      <h4 className="font-bold mb-1">Fokus pada Kebiasaan Berulang</h4>
                      <p className="text-[#464555] leading-relaxed">Jangan menilai berdasarkan kejadian satu kali saja. Nilailah perilaku yang konsisten dilakukan anak dalam aktivitas bermain maupun bersosialisasi.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">2</div>
                    <div>
                      <h4 className="font-bold mb-1">Berikan Contoh Nyata</h4>
                      <p className="text-[#464555] leading-relaxed">Gunakan bantuan teks "Misal" di bawah setiap pertanyaan untuk mencocokkan tindakan spesifik anak Anda dengan indikator perilaku yang dimaksud.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">3</div>
                    <div>
                      <h4 className="font-bold mb-1">Hindari Bias Penilaian</h4>
                      <p className="text-[#464555] leading-relaxed">Orang tua cenderung memandang anak selalu hebat. Cobalah menilai secara realistis dan objektif agar sistem dapat memetakan kekuatan asli anak secara presisi.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accordion FAQs */}
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

          {/* TAB 4: KONTRIBUSI DATA */}
          {activeTab === 'kontribusi' && (
            <div className="animate-fade-in space-y-8 relative">
              {/* Success Toast */}
              {successToast && (
                <div className="fixed top-20 right-10 z-[110] bg-emerald-600 text-white px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-2 text-sm animate-bounce">
                  <span className="material-symbols-outlined">check_circle</span>
                  <span>{successToast}</span>
                </div>
              )}
              {/* Error Toast */}
              {errorToast && (
                <div className="fixed top-20 right-10 z-[110] bg-rose-600 text-white px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-2 text-sm animate-bounce">
                  <span className="material-symbols-outlined">error</span>
                  <span>{errorToast}</span>
                </div>
              )}

              {!userToken ? (
                <div className="bg-white border border-[#c7c4d8]/40 rounded-[2rem] p-8 md:p-12 text-center max-w-2xl mx-auto space-y-6 shadow-sm">
                  <div className="w-16 h-16 bg-[#3525cd]/15 rounded-full flex items-center justify-center text-[#3525cd] mx-auto">
                    <span className="material-symbols-outlined text-3xl">lock</span>
                  </div>
                  <h3 className="text-2xl font-bold">Akses Kontribusi Terbatas</h3>
                  <p className="text-sm text-[#464555] leading-relaxed">
                    Untuk ikut serta menyumbangkan data berupa **Variabel Masukan** atau **Indikator Bakat baru** ke dalam sistem pakar TalentaKu, Anda harus masuk log atau membuat akun terlebih dahulu.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Link
                      to="/login"
                      className="bg-[#3525cd] text-white px-6 py-2.5 text-sm font-semibold rounded-xl hover:brightness-110 shadow-md active:scale-95 transition-all"
                    >
                      Masuk Log
                    </Link>
                    <Link
                      to="/register"
                      className="px-6 py-2.5 border border-[#c7c4d8]/40 hover:bg-[#eceef0] rounded-xl text-sm font-semibold transition-all"
                    >
                      Daftar Akun
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                  {/* Form Variable */}
                  <div className="bg-white border border-[#c7c4d8]/40 rounded-[2rem] p-6 md:p-8 space-y-6 shadow-sm">
                    <div>
                      <h3 className="text-lg font-bold text-[#3525cd] flex items-center gap-2">
                        <span className="material-symbols-outlined">playlist_add</span>
                        Tambah Variabel Masukan
                      </h3>
                      <p className="text-xs text-[#464555] mt-1">Variabel masukan baru merupakan perilaku anak yang dapat diobservasi.</p>
                    </div>

                    <form onSubmit={handleAddVariable} className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-[#464555] block mb-1">Kode Variabel</label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: C84, T13, E25"
                          value={varCode}
                          onChange={(e) => setVarCode(e.target.value)}
                          className="w-full px-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs outline-none bg-white shadow-sm font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#464555] block mb-1">Kategori Bakat</label>
                        <select
                          value={varCategory}
                          onChange={(e) => setVarCategory(e.target.value)}
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
                          value={varAgeGroup}
                          onChange={(e) => setVarAgeGroup(e.target.value)}
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
                          placeholder="Contoh: Apakah anak dapat bernyanyi..."
                          value={varLabel}
                          onChange={(e) => setVarLabel(e.target.value)}
                          className="w-full px-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs outline-none bg-white shadow-sm resize-none font-semibold"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={varLoading}
                        className="w-full py-2.5 bg-[#3525cd] text-white rounded-xl text-xs font-bold hover:brightness-110 shadow-md active:scale-95 transition-all disabled:opacity-50"
                      >
                        {varLoading ? 'Mengirim...' : 'Kirim Variabel'}
                      </button>
                    </form>
                  </div>

                  {/* Form Indicator */}
                  <div className="bg-white border border-[#c7c4d8]/40 rounded-[2rem] p-6 md:p-8 space-y-6 shadow-sm">
                    <div>
                      <h3 className="text-lg font-bold text-[#00687a] flex items-center gap-2">
                        <span className="material-symbols-outlined">add_task</span>
                        Tambah Indikator Bakat
                      </h3>
                      <p className="text-xs text-[#464555] mt-1">Indikator baru untuk memicu kriteria bakat pada aturan Forward Chaining.</p>
                    </div>

                    <form onSubmit={handleAddIndicator} className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-[#464555] block mb-1">Kode Indikator</label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: I28, TI7, EI13, LI13"
                          value={indCode}
                          onChange={(e) => setIndCode(e.target.value)}
                          className="w-full px-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs outline-none bg-white shadow-sm font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#464555] block mb-1">Nama Indikator Bakat</label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Kemampuan Verbal Tingkat Lanjut"
                          value={indLabel}
                          onChange={(e) => setIndLabel(e.target.value)}
                          className="w-full px-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs outline-none bg-white shadow-sm font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#464555] block mb-1">Grup Usia</label>
                        <select
                          value={indAgeGroup}
                          onChange={(e) => setIndAgeGroup(e.target.value)}
                          className="w-full px-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs outline-none bg-white shadow-sm font-semibold text-[#464555]"
                        >
                          <option value="toddler">Batita (Toddler)</option>
                          <option value="preschool">Prasekolah / TK (Preschool)</option>
                          <option value="early_elementary">SD Awal (Early Elementary)</option>
                          <option value="late_elementary">SD Akhir (Late Elementary)</option>
                        </select>
                      </div>
                      <button
                        type="submit"
                        disabled={indLoading}
                        className="w-full py-2.5 bg-[#00687a] text-white rounded-xl text-xs font-bold hover:brightness-110 shadow-md active:scale-95 transition-all disabled:opacity-50"
                      >
                        {indLoading ? 'Mengirim...' : 'Kirim Indikator'}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  )
}
