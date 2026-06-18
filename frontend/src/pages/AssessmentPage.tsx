import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const TOTAL_QUESTIONS = 83

interface Question {
  id: number
  category: string
  code: string
  text: string
  example: string
}

const questions: Question[] = [
  { id: 1,  category: 'Bahasa & Intelektual Umum', code: 'C1',  text: 'Apakah anak dapat menirukan kalimat sederhana?', example: 'Misal: Menirukan kalimat "Ayo kita pergi bermain" dengan jelas.' },
  { id: 2,  category: 'Bahasa & Intelektual Umum', code: 'C2',  text: 'Apakah anak menggunakan kosakata yang beragam dalam percakapan sehari-hari?', example: 'Misal: Menggunakan lebih dari 200 kata yang berbeda secara aktif.' },
  { id: 3,  category: 'Bahasa & Intelektual Umum', code: 'C3',  text: 'Apakah anak mampu mengingat urutan 3 atau lebih instruksi?', example: 'Misal: "Ambil buku, taruh di meja, lalu cuci tangan."' },
  { id: 4,  category: 'Bahasa & Intelektual Umum', code: 'C4',  text: 'Apakah anak dapat menceritakan kembali cerita sederhana dengan urutan yang benar?', example: 'Misal: Menceritakan ulang dongeng dengan urutan awal, tengah, dan akhir.' },
  { id: 5,  category: 'Akademik Khusus', code: 'C5', text: 'Apakah anak menunjukkan ketertarikan pada angka dan berhitung?', example: 'Misal: Menghitung benda-benda di sekitarnya secara spontan.' },
  { id: 6,  category: 'Akademik Khusus', code: 'C6', text: 'Apakah anak mampu mengenali pola sederhana (misalnya urutan warna atau bentuk)?', example: 'Misal: Melanjutkan pola merah-biru-merah-biru.' },
  { id: 7,  category: 'Kreatif & Seni', code: 'C7', text: 'Apakah anak sering membuat gambar atau karya seni secara spontan?', example: 'Misal: Menggambar tanpa diminta untuk mengekspresikan ide.' },
  { id: 8,  category: 'Kreatif & Seni', code: 'C8', text: 'Apakah anak menunjukkan imajinasi tinggi dalam permainan pura-pura?', example: 'Misal: Menciptakan cerita kompleks saat bermain boneka atau balok.' },
  { id: 9,  category: 'Kepemimpinan', code: 'C9', text: 'Apakah anak sering mengambil inisiatif dalam kegiatan kelompok?', example: 'Misal: Mengusulkan aturan permainan atau mengarahkan teman.' },
  { id: 10, category: 'Kepemimpinan', code: 'C10', text: 'Apakah anak mampu menyelesaikan konflik antar teman dengan cara yang damai?', example: 'Misal: Membantu teman yang bertengkar menemukan solusi bersama.' },
  { id: 11, category: 'Psikomotorik', code: 'C11', text: 'Apakah anak memiliki koordinasi tangan-mata yang baik?', example: 'Misal: Mampu menangkap bola kecil atau menyusun puzzle dengan tepat.' },
  { id: 12, category: 'Psikomotorik', code: 'C12', text: 'Apakah anak aktif dalam kegiatan fisik dan olahraga?', example: 'Misal: Berlari, melompat, atau memanjat dengan percaya diri.' },
]

// Fill remaining questions to 83
for (let i = 13; i <= 83; i++) {
  questions.push({
    id: i,
    category: i <= 25 ? 'Bahasa & Intelektual Umum' : i <= 45 ? 'Akademik Khusus' : i <= 60 ? 'Kreatif & Seni' : i <= 70 ? 'Kepemimpinan' : 'Psikomotorik',
    code: `C${i}`,
    text: `Pertanyaan penilaian ke-${i} untuk mengidentifikasi bakat anak.`,
    example: `Contoh perilaku yang dapat diamati untuk indikator C${i}.`,
  })
}

const likertOptions = [
  { value: 1, label: 'Tidak Pernah' },
  { value: 2, label: 'Jarang' },
  { value: 3, label: 'Kadang' },
  { value: 4, label: 'Sering' },
  { value: 5, label: 'Selalu' },
]

const categoryInsights: Record<string, string> = {
  'Bahasa & Intelektual Umum': 'Intelektual Umum mencakup kemampuan verbal dan memori dasar. Tahap ini membantu mengidentifikasi potensi dasar komunikasi anak.',
  'Akademik Khusus': 'Akademik Khusus menilai kemampuan numerik dan logis yang mendasari potensi akademik di bidang sains dan matematika.',
  'Kreatif & Seni': 'Kreativitas mencerminkan kemampuan anak untuk berpikir orisinal dan mengekspresikan diri melalui berbagai media artistik.',
  'Kepemimpinan': 'Kepemimpinan mencakup kecerdasan sosial, kemampuan memotivasi orang lain, dan inisiatif dalam situasi kelompok.',
  'Psikomotorik': 'Psikomotorik menilai koordinasi fisik, ketangkasan, dan kemampuan kinestetik anak dalam aktivitas sehari-hari.',
}

const QUESTIONS_PER_PAGE = 5
const TOTAL_PAGES = Math.ceil(TOTAL_QUESTIONS / QUESTIONS_PER_PAGE)

export default function AssessmentPage() {
  const { pageId } = useParams()
  const navigate = useNavigate()
  const currentPage = parseInt(pageId || '1', 10)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [animating, setAnimating] = useState(false)

  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE
  const endIndex = Math.min(startIndex + QUESTIONS_PER_PAGE, TOTAL_QUESTIONS)
  const pageQuestions = questions.slice(startIndex, endIndex)

  const progress = ((currentPage - 1) / TOTAL_PAGES) * 100
  const pageCategory = pageQuestions[0]?.category || 'Assessment'
  
  // Check if all questions on this page are answered
  const allAnswered = pageQuestions.every((q) => answers[q.id] !== undefined)

  useEffect(() => {
    document.title = `Assessment Wizard — Page ${currentPage} | TalentaKu`
    setAnimating(true)
    const t = setTimeout(() => setAnimating(false), 50)
    return () => clearTimeout(t)
  }, [currentPage])

  function handleNext() {
    if (!allAnswered) {
      alert('Silakan jawab semua pertanyaan di halaman ini sebelum melanjutkan.')
      return
    }
    if (currentPage >= TOTAL_PAGES) {
      navigate('/results/1')
      return
    }
    setAnimating(true)
    setTimeout(() => navigate(`/assessment/${currentPage + 1}`), 200)
  }

  function handleBack() {
    if (currentPage <= 1) return
    navigate(`/assessment/${currentPage - 1}`)
  }

  function confirmExit() {
    if (confirm('Apakah Anda yakin ingin menghentikan sesi penilaian ini? Kemajuan Anda tidak akan disimpan.')) {
      navigate('/')
    }
  }

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] font-sans min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#f7f9fb]/80 glass-header sticky top-0 z-50 flex justify-between items-center w-full px-4 md:px-10 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#3525cd] text-3xl">psychology</span>
          <span className="text-2xl font-bold text-[#3525cd]">TalentaKu</span>
        </div>
        <button
          onClick={confirmExit}
          className="flex items-center gap-2 text-[#464555] text-sm font-semibold hover:text-[#3525cd] transition-colors px-4 py-2 rounded-lg"
        >
          <span className="material-symbols-outlined">close</span>
          <span className="hidden md:inline">Keluar Sesi</span>
        </button>
      </header>

      {/* Global Progress Bar */}
      <div className="w-full h-1.5 bg-[#eceef0]">
        <div
          className="h-full bg-[#3525cd] transition-all duration-700 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12">
        {/* Category & Progress Info */}
        <div
          className={`max-w-[850px] w-full mb-8 animate-slide-in transition-opacity duration-200 ${animating ? 'opacity-0' : 'opacity-100'}`}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#57dffe] text-[#006172] text-xs font-semibold mb-2">
                <span className="material-symbols-outlined text-sm mr-1.5">category</span>
                {pageCategory}
              </span>
              <h2 className="text-2xl md:text-[32px] font-bold text-[#191c1e]">Evaluasi Bakat Anak</h2>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-[#464555]">Halaman {currentPage} dari {TOTAL_PAGES}</p>
              <div className="w-32 h-1 bg-[#eceef0] rounded-full mt-2 ml-auto overflow-hidden">
                <div className="h-full bg-[#00687a]" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <section
          className={`max-w-[850px] w-full bg-white p-6 md:p-10 rounded-[2rem] border border-[#e0e3e5] shadow-sm transition-all duration-200 ${animating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        >
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto mb-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#eceef0] text-xs font-bold text-[#464555] uppercase tracking-wider">
                  <th className="pb-4 text-left font-semibold text-[#464555]">Variabel Perilaku</th>
                  {likertOptions.map((opt) => (
                    <th key={opt.value} className="pb-4 text-center font-semibold text-[#464555] px-2 w-[85px]">
                      <span className="block text-sm font-bold text-[#191c1e]">{opt.value}</span>
                      <span className="text-[9px] text-[#777587] font-normal block mt-0.5 capitalize">{opt.label}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eceef0]/60">
                {pageQuestions.map((q) => {
                  const selectedVal = answers[q.id]
                  return (
                    <tr key={q.id} className="hover:bg-[#f8fafc]/50 transition-colors">
                      <td className="py-4 pr-4 align-top">
                        <div className="flex gap-3 items-start">
                          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-[#3525cd]/15 text-[#3525cd] text-[10px] font-bold font-mono mt-0.5">{q.code}</span>
                          <div className="space-y-0.5">
                            <p className="text-sm text-[#191c1e] font-medium leading-relaxed">{q.text}</p>
                            {q.example && <p className="text-xs text-[#777587] italic">{q.example}</p>}
                          </div>
                        </div>
                      </td>
                      {likertOptions.map((opt) => (
                        <td key={opt.value} className="py-4 text-center align-middle px-2">
                          <label className="cursor-pointer inline-flex items-center justify-center p-0.5 group">
                            <input
                              type="radio"
                              name={`question-${q.id}`}
                              value={opt.value}
                              checked={selectedVal === opt.value}
                              onChange={() => setAnswers({ ...answers, [q.id]: opt.value })}
                              className="sr-only"
                            />
                            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-semibold text-xs transition-all group-hover:scale-105 ${
                              selectedVal === opt.value
                                ? 'bg-[#3525cd] text-white border-[#3525cd] shadow-[0_4px_8px_rgba(53,37,205,0.2)] scale-110'
                                : 'bg-[#eceef0] border-transparent text-[#464555] group-hover:bg-[#e0e3e5]/70'
                            }`}>
                              {opt.value}
                            </div>
                          </label>
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden flex flex-col gap-6 mb-10">
            {pageQuestions.map((q) => {
              const selectedVal = answers[q.id]
              return (
                <div key={q.id} className="border-b border-[#eceef0]/80 pb-6 last:border-0 last:pb-0 space-y-3">
                  <div className="flex gap-2 items-start">
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-[#3525cd]/15 text-[#3525cd] text-[10px] font-bold font-mono mt-0.5">{q.code}</span>
                    <div>
                      <p className="text-base text-[#191c1e] font-medium leading-normal">{q.text}</p>
                      {q.example && <p className="text-xs text-[#777587] italic mt-1">{q.example}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-2 pt-1">
                    {likertOptions.map((opt) => (
                      <label key={opt.value} className="flex flex-col items-center gap-1 cursor-pointer group">
                        <input
                          type="radio"
                          name={`mobile-question-${q.id}`}
                          value={opt.value}
                          checked={selectedVal === opt.value}
                          onChange={() => setAnswers({ ...answers, [q.id]: opt.value })}
                          className="sr-only"
                        />
                        <div className={`w-full aspect-square flex items-center justify-center rounded-xl border text-sm font-semibold transition-all ${
                          selectedVal === opt.value
                            ? 'bg-[#3525cd] text-white border-[#3525cd] shadow-[0_3px_6px_rgba(53,37,205,0.2)] scale-105'
                            : 'bg-[#eceef0] border-transparent text-[#464555]'
                        }`}>
                          {opt.value}
                        </div>
                        <span className="text-[8px] font-medium text-[#777587] text-center truncate max-w-full capitalize">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Wizard Controls */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handleBack}
              disabled={currentPage <= 1}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#e0e3e5] text-sm font-semibold text-[#464555] hover:bg-[#eceef0] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Sebelumnya
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-10 py-3 rounded-xl bg-[#3525cd] text-white text-sm font-semibold shadow-lg shadow-[#3525cd]/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              {currentPage >= TOTAL_PAGES ? 'Lihat Hasil' : 'Berikutnya'}
              <span className="material-symbols-outlined">
                {currentPage >= TOTAL_PAGES ? 'emoji_events' : 'arrow_forward'}
              </span>
            </button>
          </div>
        </section>

        {/* Encouraging Quote */}
        <div className="max-w-[850px] w-full mt-12 text-center">
          <div className="p-6 rounded-2xl bg-[#f2f4f6] border border-dashed border-[#c7c4d8] inline-block max-w-sm">
            <p className="text-sm font-semibold text-[#464555] italic">
              "Setiap anak adalah bintang yang bersinar dengan caranya sendiri. Mari kita temukan cahayanya bersama."
            </p>
          </div>
        </div>
      </main>

      {/* Desktop Floating Insight */}
      <aside className="hidden xl:block fixed right-12 top-1/2 -translate-y-1/2 w-64 bg-[#e6e8ea]/50 p-6 rounded-3xl border border-[#e0e3e5]">
        <h4 className="text-sm font-semibold text-[#3525cd] mb-3">Informasi Kategori</h4>
        <p className="text-xs text-[#464555] leading-relaxed">
          {categoryInsights[pageCategory]}
        </p>
        <div className="mt-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#464555]">Metode Forward Chaining</span>
        </div>
      </aside>

      {/* Footer */}
      <footer className="w-full py-8 px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-[#e0e3e5]/50">
        <p className="text-xs text-[#464555]">© 2024 TalentaKu Expert Systems. Profesional & Bersahabat.</p>
        <div className="flex gap-6">
          <a href="#" className="text-xs text-[#464555] hover:text-[#3525cd] transition-colors">Bantuan</a>
          <a href="#" className="text-xs text-[#464555] hover:text-[#3525cd] transition-colors">Kebijakan Privasi</a>
        </div>
      </footer>
    </div>
  )
}
