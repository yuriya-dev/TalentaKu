import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

interface Question {
  id: number
  category: string
  code: string
  text: string
  example?: string
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
  'Seni Visual & Pertunjukan': 'Seni Visual & Pertunjukan menilai kepekaan estetika anak pada bidang seni rupa, musik, drama, dan ekspresi gerak tubuh.',
  'Psikomotorik': 'Psikomotorik menilai koordinasi fisik, ketangkasan, dan kemampuan kinestetik anak dalam aktivitas sehari-hari.',
}

function getCategoryName(cat: string) {
  switch (cat) {
    case 'General Intellectual': return 'Bahasa & Intelektual Umum'
    case 'Specific Academic': return 'Akademik Khusus'
    case 'Creative Thinking': return 'Kreatif & Seni'
    case 'Leadership': return 'Kepemimpinan'
    case 'Visual & Performing Arts': return 'Seni Visual & Pertunjukan'
    case 'Psychomotor': return 'Psikomotorik'
    default: return cat
  }
}

const questionExamples: Record<string, string> = {
  // Toddler
  T1: 'Misal: Menyebut "Adek Budi" saat ditanya siapa namanya dan menunjuk hidung atau mata.',
  T2: 'Misal: Menirukan kata "kucing" atau "makan" setelah didiktekan.',
  T3: 'Misal: Menunjuk mainannya satu-satu sambil berhitung "satu, dua, tiga".',
  T4: 'Misal: Bisa membedakan bola merah dengan bola biru ketika diminta mengambilnya.',
  T5: 'Misal: Membuat coretan melingkar-lingkar tidak beraturan menggunakan krayon besar.',
  T6: 'Misal: Menyodorkan sendok mainan kosong ke mulut boneka teddy bear.',
  T7: 'Misal: Mendekat dan mengusap pundak temannya yang sedang menangis.',
  T8: 'Misal: Mengikuti perintah "Tolong ambilkan bola merah itu".',
  T9: 'Misal: Menggoyangkan tubuh ke kiri dan kanan sambil tersenyum saat lagu "Balonku" diputar.',
  T10: 'Misal: Antusias memukul-mukul mainan drum atau piano kecil.',
  T11: 'Misal: Berlari di halaman rumah dengan langkah stabil tanpa sering tersandung.',
  T12: 'Misal: Memegang krayon menggunakan kelima jarinya secara mantap saat mencoret.',

  // Preschool
  C1: 'Misal: Menirukan kalimat "Ayo kita pergi bermain" secara lengkap tanpa salah ucap.',
  C2: 'Misal: Mengulangi kata "meja, kursi, buku, lemari" setelah diucapkan oleh orang tua.',
  C3: 'Misal: Mengulangi instruksi "Tolong ambilkan krayon warna biru di atas meja belajar kakak."',
  C4: 'Misal: Menghafal lirik dan melodi lagu anak seperti Balonku, Pelangi, Bintang Kecil, dll.',
  C5: 'Misal: Menunjuk dan melafalkan huruf \'A\', \'B\', \'C\', \'O\', \'U\' pada poster atau kartu kata.',
  C6: 'Misal: Bernyanyi dengan keras dan berirama tanpa malu-malu saat mendengar musik.',
  C7: 'Misal: Mengumpulkan semua mainan mobil-mobilan di satu kotak, dan balok kayu di kotak lainnya.',
  C8: 'Misal: Menyalin tulisan huruf vokal/konsonan yang dicontohkan di buku tulis.',
  C9: 'Misal: Membedakan piring/sendok dengan sabun/sikat gigi ke tempatnya masing-masing.',
  C10: 'Misal: Sering bertanya "Mengapa daun warnanya hijau?" atau "Berapa banyak mainan ini?".',
  C11: 'Misal: Menjelaskan gambar rumah dengan cerita "Ini rumahku, ada pohon besar di sampingnya dan awan di atas".',
  C12: 'Misal: Menyatakan "Aku mau makan buah" atau "Mereka sedang bermain di luar".',
  C13: 'Misal: Menceritakan kunjungannya ke kebun binatang atau kejadian saat bermain di taman sekolah.',
  C14: 'Misal: Tiba-tiba bercerita "Tadi kucing warna jingga itu melompati pagar rumah tetangga".',
  C15: 'Misal: Lancar berhitung satu sampai sepuluh tanpa ada angka yang terlewat.',
  C16: 'Misal: Menunjuk angka 7 dengan benar saat ditanyakan pada kartu angka acak.',
  C17: 'Misal: Menyalin penulisan angka 3 atau 8 di atas kertas pasir atau buku tulis.',
  C18: 'Misal: Mampu mengidentifikasi angka belasan (11-20) pada buku atau jam dinding.',
  C19: 'Misal: Membagi 5 permen di kiri dan 3 permen di kanan, lalu menyebutkan mana yang lebih banyak.',
  C20: 'Misal: Menunjuk jam dinding sebagai bulat dan atap rumah sebagai segitiga.',
  C21: 'Misal: Mencampur kuning dengan biru, lalu gembira berteriak "Wah, jadi hijau!".',
  C22: 'Misal: Memasukkan batu (tenggelam) dan daun (terapung) ke dalam wadah air saat mandi atau bermain.',
  C23: 'Misal: Menirukan dan menceritakan macam-macam bunyi alam atau kendaraan sekitar.',
  C24: 'Misal: Menyebut gula itu manis, garam itu asin, dan obat itu pahit dengan ekspresif.',
  C25: 'Misal: Menyebut bau masakan ibu harum atau bau tempat sampah busuk.',
  C26: 'Misal: Mengusulkan ide mainan atau kegiatan saat guru/orang tua bertanya.',
  C27: 'Misal: Cepat dan bersemangat menjawab saat ditanya siapa nama temannya di sekolah.',
  C28: 'Misal: Melambaikan tangan dan berseru "Halo!" saat berpapasan dengan teman di taman.',
  C29: 'Misal: Mengucapkan "Assalamualaikum" atau "Selamat pagi" saat masuk kelas.',
  C30: 'Misal: Mengatakan terima kasih saat diberi permen tanpa harus diingatkan terlebih dahulu.',
  C31: 'Misal: Menangis sebentar saat sedih lalu tenang kembali setelah diberi penjelasan.',
  C32: 'Misal: Berkata "Nanti aku mau susun lego tinggi dulu, baru buat jalan mobil".',
  C33: 'Misal: Memilih baju warna merah dibanding biru saat bersiap untuk bepergian.',
  C34: 'Misal: Mencoret-coret kertas dengan warna-warni yang berani membentuk garis-garis imajinatif.',
  C35: 'Misal: Mengetahui bahwa membuang sampah sembarangan itu salah dan menaruhnya di tempat sampah itu benar.',
  C36: 'Misal: Spontan membantu membangunkan temannya yang tersandung di arena bermain.',
  C37: 'Misal: Langsung bergaul dengan anak baru tanpa ragu-ragu.',
  C38: 'Misal: Tidak merusak menara balok yang dibuat temannya dan melihatnya dengan kagum.',
  C39: 'Misal: Memuji temannya dengan berkata "Wah, lari kamu cepat sekali!".',
  C40: 'Misal: Berkata "Ayo kita main petak umpet bersama!".',
  C41: 'Misal: Berkata "Tidak apa-apa kok" ketika baloknya tidak sengaja tersenggol runtuh oleh teman.',
  C42: 'Misal: Menghormati saat temannya berdoa sebelum makan dengan cara yang berbeda.',
  C43: 'Misal: Mengatakan "Gambar buatanmu bagus sekali!" secara spontan.',
  C44: 'Misal: Merapikan bajunya sendiri setelah dari kamar mandi atau menjaga sikap di restoran.',
  C45: 'Misal: Mencium tangan orang tua saat berpamitan pergi sekolah atau berbicara dengan nada lembut.',
  C46: 'Misal: Tidak memotong pembicaraan orang lain dan memperhatikan dengan kontak mata.',
  C47: 'Misal: Menyimpan gambar buatannya dengan rapi di laci atau menaruh mainan balok ke tempatnya.',
  C48: 'Misal: Tidak berbuat curang saat bermain ular tangga atau bersedia menjadi pencari saat bermain petak umpet.',
  C49: 'Misal: Mengacungkan tangan tinggi-tinggi saat guru bertanya atau menanyakan keheranan ilmiah.',
  C50: 'Misal: Menggunakan krayon/spidol secara mandiri dan mengembalikannya ke tempat semula.',
  C51: 'Misal: Terus mewarnai gambarnya sampai selesai meskipun teman-teman lain sudah mulai bermain.',
  C52: 'Misal: Mampu mengingat perintah: "Ambil tasmu, pakai sepatumu, lalu tunggu bunda di teras".',
  C53: 'Misal: Mengatur temannya "Kamu yang cari daun, aku yang tempel di kertas ya".',
  C54: 'Misal: Membantu memegang kardus saat temannya menempelkan perekat saat membuat prakarya bersama.',
  C55: 'Misal: Cepat akrab dan mulai mengobrol dengan anak lain saat berkunjung ke tempat rekreasi baru.',
  C56: 'Misal: Membantu membagikan krayon untuk teman sebangkunya yang belum memilikinya.',
  C57: 'Misal: Berkata "Sudah jangan berebut, kita mainnya gantian saja ya".',
  C58: 'Misal: Memberikan sebagian biskuit bekalnya kepada teman yang tidak membawa makanan.',
  C59: 'Misal: Menyodorkan boneka atau mobil-mobilan kesayangannya saat teman datang berkunjung.',
  C60: 'Misal: Menunggu di belakang perosotan dengan tenang sampai anak di depannya meluncur ke bawah.',
  C61: 'Misal: Tidak menangis menjerit-jerit atau melempar barang ketika dilarang membeli permen.',
  C62: 'Misal: Mau memperbaiki cara memegang pensil saat diarahkan tanpa merajuk atau marah.',
  C63: 'Misal: Menggambar kucing lengkap dengan telinga segitiga, kaki empat, dan ekor panjang di tempatnya.',
  C64: 'Misal: Menggabungkan persegi dan segitiga untuk membentuk sebuah rumah dengan matahari bulat di atasnya.',
  C65: 'Misal: Memukul alat musik mainan mengikuti tempo lambat dan cepat secara konsisten.',
  C66: 'Misal: Mengenali suara burung bernada tinggi dan suara gong bernada rendah secara intuitif.',
  C67: 'Misal: Menari berputar dan melompat tepat mengikuti ketukan lagu tari yang diputar.',
  C68: 'Misal: Memasang wajah terkejut yang berlebihan saat menceritakan tokoh dongeng yang kaget.',
  C69: 'Misal: Berpura-pura menjadi dokter dengan suara berwibawa memeriksa detak jantung bonekanya.',
  C70: 'Misal: Berlari cepat dan langsung berbelok tajam tanpa goyah atau jatuh.',
  C71: 'Misal: Menangkap bola kasti yang dilempar pelan dari jarak 2 meter menggunakan kedua tangannya.',
  C72: 'Misal: Berjalan lurus di atas seutas tali yang dibentangkan di lantai dengan merentangkan tangannya.',
  C73: 'Misal: Menyendok sup makanan masuk ke mulutnya tanpa tumpah berceceran di meja.',
  C74: 'Misal: Mampu memasukkan kancing baju ke lubangnya satu per satu dari atas ke bawah.',
  C75: 'Misal: Menyusun menara balok setinggi 10 tingkat tanpa runtuh atau menyelesaikan puzzle gambar hewan.',
  C76: 'Misal: Melipat kertas lipat/origami menyatukan sudut-sudutnya dengan presisi sedang.',
  C77: 'Misal: Menggunting pola gambar lingkaran mengikuti garis hitam secara perlahan dan rapi.',
  C78: 'Misal: Memutar kencang tutup botol minum mineral atau membuka toples makanan ringan.',
  C79: 'Misal: Memasang bagian roda mobil-mobilan mainan rakitan menggunakan obeng plastik mainannya.',
  C80: 'Misal: Menjepit pensil di antara ibu jari, jari telunjuk, dan disangga jari tengah saat menggambar.',
  C81: 'Misal: Memukul pasak mainan kayu hingga masuk rata ke dalam lubang papan pasak.',
  C82: 'Misal: Mengangkat kaki kirinya dan berdiri tegak dengan kaki kanan tanpa limbung saat berolahraga pagi.',
  C83: 'Misal: Menggantungkan tubuhnya pada monkey bar selama beberapa detik menggunakan kekuatan tangannya.',

  // Early Elementary
  E1: 'Misal: Dapat menceritakan alur utama cerita dan karakter dalam buku yang baru dibacanya.',
  E2: 'Misal: Menggunakan kata-kata seperti "sebaliknya", "mungkin saja", atau "berarti" dengan tepat.',
  E3: 'Misal: Mampu memecahkan teka-teki logika bergambar atau bermain rubik/puzzle.',
  E4: 'Misal: Memahami bahwa "jika tanaman tidak disiram, maka ia akan layu dan mati".',
  E5: 'Misal: Menyelesaikan soal matematika sekolah seperti 15 + 8 atau 24 - 7 tanpa menghitung jari.',
  E6: 'Misal: Senang bermain game matematika komputer atau sudoku anak.',
  E7: 'Misal: Mengamati semut berbaris dengan kaca pembesar atau mengoleksi daun kering.',
  E8: 'Misal: Tertarik menceritakan planet-planet di tata surya atau nama-nama dinosaurus.',
  E9: 'Misal: Membuat kastil atau stasiun luar angkasa unik dari lego tanpa mengikuti buku panduan.',
  E10: 'Misal: Menulis cerita petualangan pendek lengkap dengan ilustrasi buatannya sendiri.',
  E11: 'Misal: Mencoba memperbaiki roda mainan yang lepas menggunakan lem atau selotip secara kreatif.',
  E12: 'Misal: Antusias membuat gantungan kunci, origami hewan rumit, atau kerajinan tangan dari kardus bekas.',
  E13: 'Misal: Mengatur giliran dan peran saat bermain bentengan atau kerja kelompok membuat prakarya.',
  E14: 'Misal: Bersedia meminjamkan mainan langka kepada temannya agar permainan kelompok tetap berjalan.',
  E15: 'Misal: Memasukkan buku pelajaran, botol minum, dan pensil ke tas sesuai jadwal esok hari.',
  E16: 'Misal: Langsung mengerjakan PR sepulang sekolah sebelum pergi bermain.',
  E17: 'Misal: Menggambar pemandangan dengan adanya efek perspektif (jalan mengecil di kejauhan).',
  E18: 'Misal: Mewarnai gradasi warna langit (jingga ke kuning) pada gambar senja.',
  E19: 'Misal: Menyanyikan lagu wajib nasional atau lagu pop anak dengan nada stabil dan tidak fals.',
  E20: 'Misal: Mengikuti audisi pentas seni sekolah atau bernyanyi solo di depan kelas.',
  E21: 'Misal: Bersepeda berkeliling kompleks rumah dengan lincah tanpa goyah.',
  E22: 'Misal: Melompat tali secara konstan sebanyak 15 kali putaran tanpa tersangkut.',
  E23: 'Misal: Menggunting gambar wajah tokoh kartun mengikuti lekukan garis rambutnya dengan presisi.',
  E24: 'Misal: Melipat kertas membentuk burung bangau origami secara mandiri.',

  // Late Elementary
  L1: 'Misal: Mampu menjelaskan arti "kebebasan berpendapat" atau "kenapa kita harus bertoleransi".',
  L2: 'Misal: Menyampaikan argumen "menurut saya bermain game bermanfaat melatih strategi karena..." saat berdiskusi.',
  L3: 'Misal: Menyelesaikan membaca buku novel anak setebal 100+ halaman dalam beberapa hari.',
  L4: 'Misal: Menulis artikel majalah dinding sekolah atau esai liburan dengan struktur paragraf yang baik.',
  L5: 'Misal: Lancar mengerjakan perkalian puluhan atau pembagian bersusun di luar kepala.',
  L6: 'Misal: Mampu membuat diagram batang tentang tinggi badan teman sekelasnya.',
  L7: 'Misal: Membuat laporan praktikum sederhana tentang pertumbuhan kecambah dengan mengukur tingginya setiap hari.',
  L8: 'Misal: Mencoba belajar bahasa pemrograman Scratch atau merakit robot lego mindstorm.',
  L9: 'Misal: Mendesain undangan ulang tahun sendiri menggunakan aplikasi Canva atau menggambar digital.',
  L10: 'Misal: Mengusulkan metode pengumpulan sampah yang unik untuk proyek kebersihan kelas.',
  L11: 'Misal: Menjelaskan alasan menyukai suatu lukisan atau arsitektur gedung dengan kosakata seni.',
  L12: 'Misal: Antusias menceritakan sejarah candi Borobudur atau pakaian adat dari daerah lain.',
  L13: 'Misal: Memimpin rapat kelas untuk menentukan pembagian tugas piket kebersihan.',
  L14: 'Misal: Mendelegasikan peran secara adil dan menyemangati anggota tim saat lomba olahraga.',
  L15: 'Misal: Menyalami lawan yang memenangkan pertandingan futsal di sekolah dengan lapang dada.',
  L16: 'Misal: Membantu menenangkan dan mendamaikan dua teman dekatnya yang sedang bertengkar.',
  L17: 'Misal: Melukis pemandangan menggunakan cat air dengan teknik gradasi dan arsiran bayangan yang matang.',
  L18: 'Misal: Membuat video stop-motion atau animasi pendek menggunakan HP.',
  L19: 'Misal: Memainkan intro lagu populer menggunakan gitar atau keyboard dengan lancar.',
  L20: 'Misal: Menggubah gerakan tari modern sendiri untuk dipentaskan bersama teman kelompok.',
  L21: 'Misal: Bermain sebagai bek atau penyerang dalam tim sepak bola sekolah dengan memahami strategi tim.',
  L22: 'Misal: Memiliki ketahanan fisik berlari memutari lapangan sekolah beberapa kali tanpa kelelahan ekstrem.',
  L23: 'Misal: Memperbaiki rantai sepedanya yang lepas atau membongkar jam dinding mati untuk melihat mesinnya.',
  L24: 'Misal: Merakit model gundam/miniatur kapal dengan lem kayu secara rapi dan sangat detail.'
}

const QUESTIONS_PER_PAGE = 5

export default function AssessmentPage() {
  const { pageId } = useParams()
  const navigate = useNavigate()
  const currentPage = parseInt(pageId || '1', 10)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loadingQuestions, setLoadingQuestions] = useState(true)
  const [answers, setAnswers] = useState<Record<number, number>>(() => {
    const cached = sessionStorage.getItem('assessment_answers')
    return cached ? JSON.parse(cached) : {}
  })
  const [animating, setAnimating] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const consId = sessionStorage.getItem('consultation_id')

  useEffect(() => {
    async function loadQuestions() {
      if (!consId) {
        setSubmitError('Sesi penilaian tidak ditemukan. Silakan mulai ulang dari halaman awal.')
        setLoadingQuestions(false)
        return
      }
      setLoadingQuestions(true)
      try {
        const res = await fetch(`http://localhost:8080/api/consultation/${consId}/questions`)
        if (!res.ok) {
          throw new Error('Gagal memuat pertanyaan dari server.')
        }
        const data = await res.json()
        const mappedQuestions: Question[] = data.map((v: any, index: number) => ({
          id: index + 1,
          category: getCategoryName(v.category),
          code: v.code,
          text: v.label,
          example: questionExamples[v.code] || ''
        }))
        setQuestions(mappedQuestions)
      } catch (err: any) {
        setSubmitError(err.message || 'Terjadi kesalahan saat memuat pertanyaan.')
      } finally {
        setLoadingQuestions(false)
      }
    }
    loadQuestions()
  }, [consId])

  const TOTAL_QUESTIONS = questions.length
  const TOTAL_PAGES = Math.ceil(TOTAL_QUESTIONS / QUESTIONS_PER_PAGE)

  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE
  const endIndex = Math.min(startIndex + QUESTIONS_PER_PAGE, TOTAL_QUESTIONS)
  const pageQuestions = questions.slice(startIndex, endIndex)

  const progress = TOTAL_PAGES > 0 ? ((currentPage - 1) / TOTAL_PAGES) * 100 : 0
  const pageCategory = pageQuestions[0]?.category || 'Asesmen'
  
  // Check if all questions on this page are answered
  const allAnswered = pageQuestions.length > 0 && pageQuestions.every((q) => answers[q.id] !== undefined)

  useEffect(() => {
    document.title = `Panduan Asesmen — Halaman ${currentPage} | TalentaKu`
    setAnimating(true)
    const t = setTimeout(() => setAnimating(false), 50)
    return () => clearTimeout(t)
  }, [currentPage])

  // Persist answers to sessionStorage whenever they change
  useEffect(() => {
    sessionStorage.setItem('assessment_answers', JSON.stringify(answers))
  }, [answers])

  async function handleNext() {
    if (!allAnswered) {
      alert('Silakan jawab semua pertanyaan di halaman ini sebelum melanjutkan.')
      return
    }
    if (currentPage >= TOTAL_PAGES) {
      setSubmitting(true)
      setSubmitError(null)
      const consId = sessionStorage.getItem('consultation_id')
      if (!consId) {
        setSubmitError('Sesi penilaian tidak ditemukan. Silakan mulai ulang dari halaman awal.')
        setSubmitting(false)
        return
      }

      // Format answers from Record<number, number> to array of { variable_code: string, score: number }
      const payloadAnswers = questions.map((q) => ({
        variable_code: q.code,
        score: answers[q.id] || 3, // Default fallback to 3
      }))

      try {
        const res = await fetch(`http://localhost:8080/api/consultation/${consId}/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ answers: payloadAnswers }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Gagal menyimpan hasil penilaian.')
        }

        // Navigate to the results page for this assessment
        navigate(`/results/${consId}`)
      } catch (err: any) {
        setSubmitError(err.message || 'Gagal mengirimkan jawaban. Silakan coba lagi.')
      } finally {
        setSubmitting(false)
      }
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
      sessionStorage.removeItem('assessment_answers')
      navigate('/')
    }
  }

  if (loadingQuestions) {
    return (
      <div className="bg-[#f7f9fb] text-[#191c1e] font-sans min-h-screen flex flex-col justify-between">
        <header className="bg-[#f7f9fb]/80 glass-header sticky top-0 z-50 flex justify-between items-center w-full px-4 md:px-10 py-4 shadow-sm">
          <Link to="/" className="flex items-center">
            <img src="/logo_text.svg" alt="TalentaKu Logo" className="h-7 w-auto shrink-0" />
          </Link>
        </header>
        <main className="flex-grow pt-24 pb-32 px-4 max-w-2xl mx-auto w-full">
          <phantom-ui loading="true" className="block">
            {/* Progress bar skeleton */}
            <div className="space-y-2 mb-8">
              <div className="h-2 w-full bg-slate-100 rounded-full"></div>
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-slate-100 rounded"></div>
                <div className="h-4 w-12 bg-slate-100 rounded"></div>
              </div>
            </div>

            {/* Question card skeleton */}
            <div className="bg-white border border-[#c7c4d8]/40 rounded-[2.5rem] p-8 shadow-lg space-y-6">
              <div className="h-4 w-32 bg-slate-100 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-6 w-full bg-slate-100 rounded"></div>
                <div className="h-6 w-3/4 bg-slate-100 rounded"></div>
              </div>
              <div className="grid grid-cols-5 gap-2 pt-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-slate-100 rounded-full"></div>
                    <div className="h-3 w-8 bg-slate-100 rounded"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation buttons skeleton */}
            <div className="flex justify-between mt-8">
              <div className="h-12 w-28 bg-slate-100 rounded-full"></div>
              <div className="h-12 w-28 bg-slate-100 rounded-full"></div>
            </div>
          </phantom-ui>
        </main>
        <footer className="w-full py-8 px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-[#e0e3e5]/50">
          <p className="text-xs text-[#464555]">© 2026 TalentaKu Expert Systems. Profesional & Bersahabat.</p>
        </footer>
      </div>
    )
  }

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] font-sans min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#f7f9fb]/80 glass-header sticky top-0 z-50 flex justify-between items-center w-full px-4 md:px-10 py-4 shadow-sm">
        <Link to="/" className="flex items-center">
          <img src="/logo_text.svg" alt="TalentaKu Logo" className="h-7 w-auto shrink-0" />
        </Link>
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
          className={`max-w-[850px] w-full clay-card p-6 md:p-10 transition-all duration-200 ${animating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
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

          {submitError && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 rounded-lg text-red-800 text-sm flex items-start gap-2 shadow-sm">
              <span className="material-symbols-outlined text-red-600 text-lg">error</span>
              <span>{submitError}</span>
            </div>
          )}

          {/* Wizard Controls */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handleBack}
              disabled={currentPage <= 1 || submitting}
              className="clay-btn-secondary flex items-center gap-2 px-6 py-3 text-sm font-semibold"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Sebelumnya
            </button>
            <button
              onClick={handleNext}
              disabled={submitting}
              className="clay-btn-primary flex items-center gap-2 px-10 py-3 text-sm font-semibold"
            >
              {submitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin">sync</span>
                  Memproses...
                </>
              ) : currentPage >= TOTAL_PAGES ? (
                'Lihat Hasil'
              ) : (
                'Berikutnya'
              )}
              {!submitting && (
                <span className="material-symbols-outlined">
                  {currentPage >= TOTAL_PAGES ? 'emoji_events' : 'arrow_forward'}
                </span>
              )}
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
        <p className="text-xs text-[#464555]">© 2026 TalentaKu Expert Systems. Profesional & Bersahabat.</p>
        <div className="flex gap-6">
          <a href="#" className="text-xs text-[#464555] hover:text-[#3525cd] transition-colors">Bantuan</a>
          <a href="#" className="text-xs text-[#464555] hover:text-[#3525cd] transition-colors">Kebijakan Privasi</a>
        </div>
      </footer>
    </div>
  )
}
