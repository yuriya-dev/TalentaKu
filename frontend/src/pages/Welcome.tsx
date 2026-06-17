import { useNavigate, Link } from "react-router-dom";
import { Brain, Award, GraduationCap, Palette, Users, Activity, ArrowRight, Sparkles, Shield, Library } from "lucide-react";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* TopAppBar */}
      <header className="bg-surface/80 glass-header sticky top-0 z-50 flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 shadow-sm border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Brain className="text-primary w-8 h-8" />
          <span className="text-headline-md font-bold text-primary font-sans">TalentaKu</span>
        </div>
        <nav className="hidden md:flex gap-8">
          <Link className="font-semibold text-primary border-b-2 border-primary pb-1" to="/">Home</Link>
          <Link className="text-on-surface-variant hover:text-primary transition-colors font-medium" to="/history">Riwayat Konsultasi</Link>
          <Link className="text-on-surface-variant hover:text-primary transition-colors font-medium" to="/admin">Admin Panel</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/intake" className="px-5 py-2 bg-primary text-on-primary rounded-xl text-sm font-semibold hover:scale-[1.02] active:scale-95 transition-all shadow-sm">
            Mulai Tes
          </Link>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-24 px-margin-mobile md:px-margin-desktop">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="z-10 text-center lg:text-left space-y-6">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Assessment Kecerdasan Ilmiah Anak
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-on-background leading-tight">
                Temukan <span className="text-primary">Bakat Alami</span> Anak Anda Sejak Dini.
              </h1>
              <p className="text-lg md:text-xl text-on-surface-variant max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
                Menggunakan metode pakar ilmiah **Forward Chaining** untuk mengidentifikasi potensi bakat anak usia TK (4-6 tahun) secara akurat melalui observasi perilaku terstruktur.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <button
                  onClick={() => navigate("/intake")}
                  className="px-8 py-4 bg-primary text-on-primary rounded-2xl font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Mulai Observasi Sekarang
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate("/history")}
                  className="px-8 py-4 bg-surface-container-lowest text-primary border border-outline-variant rounded-2xl font-semibold hover:bg-surface-container transition-all flex items-center justify-center gap-2"
                >
                  Lihat Riwayat
                </button>
              </div>
              <div className="mt-8 flex items-center gap-6 justify-center lg:justify-start text-sm text-on-surface-variant">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">A</div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-cyan-100 flex items-center justify-center text-xs font-bold text-cyan-700">B</div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700">C</div>
                </div>
                <p><span className="font-bold text-on-surface">500+ Orang Tua & Guru</span> telah mempercayakan TalentaKu</p>
              </div>
            </div>
            <div className="relative mx-auto lg:mx-0 max-w-md lg:max-w-none">
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-secondary-container/30 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-primary-container/20 rounded-full blur-3xl"></div>
              <div className="relative rounded-[2rem] overflow-hidden card-shadow bg-surface-container-lowest p-4 border border-slate-200">
                <img
                  alt="Anak mengeksplorasi bakat kreatif"
                  className="rounded-[1.5rem] w-full aspect-[4/3] object-cover"
                  src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800"
                />
                <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur rounded-2xl p-4 shadow-xl border border-white/50 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center text-success">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant">Hasil Teridentifikasi</p>
                    <p className="text-sm font-bold text-on-surface">Kecenderungan Berpikir Kreatif 94%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Method Section (Forward Chaining) */}
        <section className="py-24 bg-surface-container-low px-margin-mobile md:px-margin-desktop">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl font-bold">Akurasi Pakar Ilmiah yang Mudah Digunakan</h2>
              <p className="text-on-surface-variant text-base">
                Sistem pakar kami mengevaluasi indikator perilaku menggunakan mesin penalaran **Forward Chaining** dua tingkat berdasarkan standar pendidikan USOE.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-surface-container-lowest p-8 rounded-3xl border border-slate-200 card-shadow hover:translate-y-[-4px] transition-all">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6 text-on-primary">
                  <Activity className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-4">1. Observasi Mandiri</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Isi 83 pertanyaan sederhana mengenai kebiasaan sehari-hari, kosakata, koordinasi motorik, dan respons sosial anak.
                </p>
              </div>
              {/* Step 2 */}
              <div className="bg-surface-container-lowest p-8 rounded-3xl border border-slate-200 card-shadow hover:translate-y-[-4px] transition-all relative">
                <div className="w-14 h-14 bg-secondary-container rounded-2xl flex items-center justify-center mb-6 text-on-secondary-container">
                  <Brain className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-4">2. Penalaran Forward Chaining</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Sistem menganalisis jawaban dengan mencocokkan fakta-fakta biner (IF-THEN) dari variabel teramati menuju indikator dan bakat akhir.
                </p>
              </div>
              {/* Step 3 */}
              <div className="bg-surface-container-lowest p-8 rounded-3xl border border-slate-200 card-shadow hover:translate-y-[-4px] transition-all">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 text-success">
                  <Award className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-4">3. Rekomendasi Bakat</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Dapatkan laporan top-3 kategori bakat dari 6 kriteria utama lengkap dengan kekuatan spesifik dan saran stimulus tumbuh kembang.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Talent Categories (Bento Grid style) */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div className="max-w-xl space-y-2">
                <h2 className="text-3xl font-bold">Kategori Bakat Anak Usia 4-6 Tahun</h2>
                <p className="text-on-surface-variant text-sm font-light">
                  Berdasarkan penelitian di jurnal ilmiah (Salisah, Lidya, & Defit), berikut 6 kriteria bakat yang diukur dalam sistem:
                </p>
              </div>
              <button onClick={() => navigate("/intake")} className="text-primary font-semibold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                Mulai Evaluasi Sekarang <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
              {/* K1: Intelektual Umum */}
              <div className="md:col-span-3 bg-primary text-on-primary p-8 rounded-[2rem] flex flex-col justify-between group overflow-hidden relative min-h-[200px]">
                <div className="z-10 space-y-4">
                  <Brain className="w-10 h-10 opacity-90" />
                  <div>
                    <h4 className="text-xl font-bold mb-2">Intelektual Umum</h4>
                    <p className="text-sm opacity-90">Kosakata melimpah, ingatan runtut, penalaran abstrak, bercerita deskriptif.</p>
                  </div>
                </div>
                <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
              </div>
              {/* K2: Akademik Khusus */}
              <div className="md:col-span-3 bg-slate-100 p-8 rounded-[2rem] flex flex-col justify-between border border-slate-200 min-h-[200px]">
                <div className="space-y-4">
                  <GraduationCap className="w-10 h-10 text-primary" />
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-on-surface">Akademik Khusus</h4>
                    <p className="text-sm text-on-surface-variant">Menghitung bilangan, mengenal bentuk geometri, pengenalan bau, rasa, dan suara.</p>
                  </div>
                </div>
              </div>
              {/* K3: Berpikir Kreatif */}
              <div className="md:col-span-2 bg-cyan-700 text-on-primary p-8 rounded-[2rem] flex flex-col justify-between min-h-[200px] relative overflow-hidden">
                <div className="space-y-4">
                  <Palette className="w-10 h-10" />
                  <div>
                    <h4 className="text-xl font-bold mb-2">Berpikir Kreatif</h4>
                    <p className="text-sm opacity-90">Menggambar ekspresif, ide orisinal, empati sosial tinggi, pemecahan masalah.</p>
                  </div>
                </div>
              </div>
              {/* K4: Kepemimpinan */}
              <div className="md:col-span-2 bg-surface-container-lowest p-8 rounded-[2rem] border border-primary/20 flex flex-col justify-between min-h-[200px] shadow-sm">
                <div className="space-y-4">
                  <Users className="w-10 h-10 text-primary" />
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-primary">Kepemimpinan</h4>
                    <p className="text-sm text-on-surface-variant">Tanggung jawab kelompok, kerja sama tim, sabar menunggu antrean, asertif.</p>
                  </div>
                </div>
              </div>
              {/* K6: Psikomotorik */}
              <div className="md:col-span-2 bg-slate-200 p-8 rounded-[2rem] flex flex-col justify-between border border-slate-300 min-h-[200px]">
                <div className="space-y-4">
                  <Activity className="w-10 h-10 text-on-surface" />
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-on-surface">Psikomotorik</h4>
                    <p className="text-sm text-on-surface-variant">Keseimbangan fisik kasar, koordinasi origami, presisi potong kertas, ketangkasan mekanik.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scientific Backing Badges */}
        <section className="py-12 border-t border-b border-slate-200 bg-surface-container-low px-margin-mobile md:px-margin-desktop">
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-8">Landasan Ilmiah Sistem Pakar</p>
            <div className="flex flex-wrap justify-center items-center gap-12 text-slate-500 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-bold">Standar USOE America</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                <span className="font-bold">Forward Chaining Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <Library className="w-5 h-5 text-primary" />
                <span className="font-bold">Jurnal Rekayasa & Sistem Informasi 2015</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop">
          <div className="max-w-4xl mx-auto bg-surface-container-highest rounded-[3rem] p-12 text-center border border-slate-200 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 text-primary/5 pointer-events-none">
              <Brain className="w-64 h-64" />
            </div>
            <h2 className="text-3xl font-bold mb-6">Siap melihat di mana potensi bakat anak Anda berada?</h2>
            <p className="text-on-surface-variant max-w-xl mx-auto mb-10 text-base font-light">
              Proses observasi memakan waktu sekitar 15 menit. Hasil akan disimpan secara permanen di riwayat sehingga dapat diakses kembali kapan saja.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/intake")}
                className="px-10 py-4 bg-primary text-on-primary rounded-2xl font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                Mulai Observasi Sekarang
                <Sparkles className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate("/history")}
                className="px-10 py-4 bg-white text-on-surface border border-slate-200 rounded-2xl font-semibold hover:bg-slate-50 transition-all"
              >
                Riwayat Konsultasi
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-container-highest border-t border-slate-200">
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="text-primary w-5 h-5" />
            <span className="font-bold text-on-surface text-sm">TalentaKu</span>
          </div>
          <p className="text-xs text-on-surface-variant">© 2026 TalentaKu Expert Systems. Dibuat berdasarkan metodologi ilmiah.</p>
        </div>
        <div className="flex gap-8 text-xs text-on-surface-variant">
          <Link to="/admin" className="hover:text-primary transition-colors">Admin Panel</Link>
          <a href="#" className="hover:text-primary transition-colors">Kebijakan Privasi</a>
          <a href="#" className="hover:text-primary transition-colors">Kontak Bantuan</a>
        </div>
      </footer>
    </div>
  );
}
