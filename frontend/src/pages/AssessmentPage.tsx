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

export default function AssessmentPage() {
  const { questionId } = useParams()
  const navigate = useNavigate()
  const currentId = parseInt(questionId || '1', 10)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [animating, setAnimating] = useState(false)

  const question = questions.find((q) => q.id === currentId) || questions[0]
  const progress = ((currentId - 1) / TOTAL_QUESTIONS) * 100
  const selected = answers[currentId]

  useEffect(() => {
    document.title = `Assessment Wizard — C${currentId} | Talentku`
    setAnimating(true)
    const t = setTimeout(() => setAnimating(false), 50)
    return () => clearTimeout(t)
  }, [currentId])

  function handleNext() {
    if (!selected) {
      alert('Silakan pilih salah satu opsi sebelum melanjutkan.')
      return
    }
    if (currentId >= TOTAL_QUESTIONS) {
      navigate('/results/1')
      return
    }
    setAnimating(true)
    setTimeout(() => navigate(`/assessment/${currentId + 1}`), 200)
  }

  function handleBack() {
    if (currentId <= 1) return
    navigate(`/assessment/${currentId - 1}`)
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
          <span className="text-2xl font-bold text-[#3525cd]">Talentku</span>
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
          className={`max-w-[640px] w-full mb-8 animate-slide-in transition-opacity duration-200 ${animating ? 'opacity-0' : 'opacity-100'}`}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#57dffe] text-[#006172] text-xs font-semibold mb-2">
                <span className="material-symbols-outlined text-sm mr-1.5">category</span>
                {question.category}
              </span>
              <h2 className="text-2xl md:text-[32px] font-bold text-[#191c1e]">Indikator {question.code}</h2>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-[#464555]">Pertanyaan {currentId} dari {TOTAL_QUESTIONS}</p>
              <div className="w-32 h-1 bg-[#eceef0] rounded-full mt-2 ml-auto overflow-hidden">
                <div className="h-full bg-[#00687a]" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <section
          className={`max-w-[640px] w-full bg-white p-8 md:p-12 rounded-[2rem] border border-[#e0e3e5] shadow-sm transition-all duration-200 ${animating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        >
          <div className="mb-12">
            <p className="text-xl text-[#191c1e] text-center leading-relaxed">
              "{question.text}"
            </p>
            <p className="text-sm text-[#464555] text-center mt-4 italic">{question.example}</p>
          </div>

          {/* Likert Scale */}
          <div className="grid grid-cols-5 gap-2 md:gap-4 mb-12">
            {likertOptions.map((opt) => (
              <label key={opt.value} className="flex flex-col items-center gap-3 cursor-pointer group">
                <input
                  className="hidden peer"
                  name="assessment"
                  type="radio"
                  value={opt.value}
                  checked={selected === opt.value}
                  onChange={() => setAnswers({ ...answers, [currentId]: opt.value })}
                />
                <div
                  className={`w-full aspect-square md:w-16 md:h-16 rounded-2xl border-2 flex items-center justify-center transition-all shadow-sm group-hover:bg-[#e0e3e5]/50 ${
                    selected === opt.value
                      ? 'bg-[#4f46e5]/10 text-[#4f46e5] border-[#3525cd] scale-110 shadow-[0_0_0_2px_#3525cd,0_8px_20px_rgba(53,37,205,0.15)]'
                      : 'bg-[#eceef0] border-transparent text-[#464555]'
                  }`}
                >
                  <span className="font-bold text-xl">{opt.value}</span>
                </div>
                <span className="text-xs font-medium text-center text-[#464555] group-hover:text-[#3525cd] transition-colors">{opt.label}</span>
              </label>
            ))}
          </div>

          {/* Wizard Controls */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handleBack}
              disabled={currentId <= 1}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#e0e3e5] text-sm font-semibold text-[#464555] hover:bg-[#eceef0] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Sebelumnya
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-10 py-3 rounded-xl bg-[#3525cd] text-white text-sm font-semibold shadow-lg shadow-[#3525cd]/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              {currentId >= TOTAL_QUESTIONS ? 'Lihat Hasil' : 'Berikutnya'}
              <span className="material-symbols-outlined">
                {currentId >= TOTAL_QUESTIONS ? 'emoji_events' : 'arrow_forward'}
              </span>
            </button>
          </div>
        </section>

        {/* Encouraging Quote */}
        <div className="max-w-[640px] w-full mt-12 text-center">
          <div className="p-6 rounded-2xl bg-[#f2f4f6] border border-dashed border-[#c7c4d8] inline-block max-w-sm">
            <p className="text-sm font-semibold text-[#464555] italic">
              "Setiap anak adalah bintang yang bersinar dengan caranya sendiri. Mari kita temukan cahayanya bersama."
            </p>
          </div>
        </div>
      </main>

      {/* Desktop Floating Insight */}
      <aside className="hidden xl:block fixed right-12 top-1/2 -translate-y-1/2 w-64 bg-[#e6e8ea]/50 p-6 rounded-3xl border border-[#e0e3e5]">
        <h4 className="text-sm font-semibold text-[#3525cd] mb-3">Informasi Bakat</h4>
        <p className="text-xs text-[#464555] leading-relaxed">
          {categoryInsights[question.category]}
        </p>
        <div className="mt-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#464555]">Metode Forward Chaining</span>
        </div>
      </aside>

      {/* Footer */}
      <footer className="w-full py-8 px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-[#e0e3e5]/50">
        <p className="text-xs text-[#464555]">© 2024 Talentku Expert Systems. Profesional & Bersahabat.</p>
        <div className="flex gap-6">
          <a href="#" className="text-xs text-[#464555] hover:text-[#3525cd] transition-colors">Bantuan</a>
          <a href="#" className="text-xs text-[#464555] hover:text-[#3525cd] transition-colors">Kebijakan Privasi</a>
        </div>
      </footer>
    </div>
  )
}
