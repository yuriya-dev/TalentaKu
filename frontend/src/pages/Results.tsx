import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Brain, Award, Sparkles, AlertCircle, Printer, ArrowLeft, Loader2, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { fetchResults, type EvaluationResult, type Child } from "../api";

export default function Results() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const sessionID = parseInt(id || "0");

  const [loading, setLoading] = useState(true);
  const [child, setChild] = useState<Child | null>(null);
  const [createdAt, setCreatedAt] = useState("");
  const [results, setResults] = useState<EvaluationResult[]>([]);
  const [error, setError] = useState("");
  const [showTrace, setShowTrace] = useState(false);

  // Load results
  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetchResults(sessionID);
        setChild(response.child);
        setCreatedAt(response.completed_at || response.created_at);
        setResults(response.results);
      } catch (err: any) {
        setError(err.message || "Gagal memuat hasil observasi");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [sessionID]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="mt-4 text-on-surface-variant text-sm">Menganalisis data observasi...</p>
      </div>
    );
  }

  if (error || !child || results.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
        <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl max-w-md text-center space-y-4">
          <p>{error || "Data hasil observasi tidak ditemukan"}</p>
          <button onClick={() => navigate("/")} className="px-6 py-2 bg-primary text-on-primary rounded-xl font-semibold">
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  const primaryResult = results[0];
  const secondaryResult = results[1];
  const tertiaryResult = results[2];

  // Check if a rule was satisfied or if it's fallback ranking
  const isAnyRuleSatisfied = results.some((r) => r.is_rule_satisfied);

  // Formatting date
  const formattedDate = new Date(createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Collect all satisfied indicators from all categories to show strengths
  const satisfiedIndicators: { code: string; label: string; pct: number }[] = [];
  results.forEach((res) => {
    res.indicators.forEach((ind) => {
      if (ind.is_satisfied) {
        // Prevent duplicate indicators in output list
        if (!satisfiedIndicators.some((existing) => existing.code === ind.code)) {
          satisfiedIndicators.push({
            code: ind.code,
            label: ind.label,
            pct: ind.score_percentage,
          });
        }
      }
    });
  });

  return (
    <div className="min-h-screen flex flex-col bg-background print:bg-white">
      {/* Top Navigation Bar */}
      <header className="bg-surface/80 glass-header sticky top-0 z-50 flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 shadow-sm border-b border-slate-100 print:hidden">
        <div className="flex items-center gap-2">
          <Brain className="text-primary w-8 h-8" />
          <span className="text-headline-md font-bold text-primary">TalentaKu</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.print()}
            className="p-2.5 border border-outline-variant text-on-surface-variant hover:text-primary rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm font-semibold"
          >
            <Printer className="w-4.5 h-4.5" />
            Cetak Hasil
          </button>
          <Link
            to="/history"
            className="px-5 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-semibold hover:scale-[1.02] active:scale-95 transition-all shadow-sm"
          >
            Riwayat
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-10 pb-24 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto w-full space-y-12">
        {/* Back navigation print:hidden */}
        <div className="print:hidden">
          <Link to="/" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>

        {/* Header Celebration Section */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary border border-primary/20">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <span className="text-xs font-bold uppercase tracking-wider">Hasil Analisis Selesai</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-on-background">
            Laporan Bakat: {child.name}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-on-surface-variant font-medium">
            <span>Usia: <strong>{child.age} Tahun</strong></span>
            <span className="text-slate-300">|</span>
            <span>Gender: <strong>{child.gender === "male" ? "Laki-laki" : "Perempuan"}</strong></span>
            <span className="text-slate-300">|</span>
            <span>Sekolah: <strong>{child.school}</strong></span>
            <span className="text-slate-300">|</span>
            <span>Tanggal: <strong>{formattedDate}</strong></span>
          </div>
        </header>

        {/* Results Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Primary Result Card (Gold Medal) */}
          <section className="lg:col-span-8 bg-white rounded-[2rem] border border-outline-variant p-8 relative overflow-hidden group shadow-sm">
            <div className="absolute top-0 right-0 p-8 text-right z-10">
              <span className="block text-primary text-5xl font-extrabold leading-none">{primaryResult.score_percentage}%</span>
              <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Confidence Score</span>
            </div>

            <div className="flex flex-col gap-6 max-w-xl relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shadow-sm border border-amber-200">
                  <Award className="w-9 h-9" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-on-surface">{primaryResult.criterion_label}</h2>
                  <p className="text-xs text-on-surface-variant font-medium">
                    {isAnyRuleSatisfied ? "Kriteria Bakat Utama Teridentifikasi" : "Kecenderungan Bakat Tertinggi (Fallback)"}
                  </p>
                </div>
              </div>

              {!isAnyRuleSatisfied && (
                <div className="p-3.5 bg-amber-50 text-amber-800 text-xs rounded-xl border border-amber-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>
                    Tidak ada kriteria bakat yang terpenuhi 100% secara logika biner forward chaining. Hasil ini menampilkan kecenderungan tertinggi berdasarkan ranking skor persentase. Disarankan berkonsultasi dengan psikolog anak.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="text-lg font-bold text-primary">Deskripsi Naratif</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed font-light">
                  {primaryResult.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-surface-container-low border border-slate-100">
                  <span className="block text-xl font-bold text-primary">{primaryResult.criterion_code}</span>
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold">Kode Kriteria</span>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-low border border-slate-100">
                  <span className="block text-xl font-bold text-primary">{primaryResult.indicators.length} Indikator</span>
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold">Jumlah Parameter</span>
                </div>
              </div>
            </div>
            {/* Decorative BG element */}
            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-700"></div>
          </section>

          {/* Secondary & Tertiary Medals */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider px-2">Bakat Lain yang Terdeteksi</h3>

            {/* Silver (Rank 2) */}
            {secondaryResult && (
              <div className="bg-white rounded-2xl border border-outline-variant p-5 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface">{secondaryResult.criterion_label}</h4>
                    <p className="text-xs text-on-surface-variant">{secondaryResult.criterion_code} &bull; Match: <strong>{secondaryResult.score_percentage}%</strong></p>
                  </div>
                </div>
              </div>
            )}

            {/* Bronze (Rank 3) */}
            {tertiaryResult && (
              <div className="bg-white rounded-2xl border border-outline-variant p-5 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-700 font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface">{tertiaryResult.criterion_label}</h4>
                    <p className="text-xs text-on-surface-variant">{tertiaryResult.criterion_code} &bull; Match: <strong>{tertiaryResult.score_percentage}%</strong></p>
                  </div>
                </div>
              </div>
            )}

            {/* Hint Box */}
            <div className="bg-primary-container text-on-primary-container rounded-2xl p-6 relative overflow-hidden shadow-sm">
              <h4 className="font-bold text-base mb-2 flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                Catatan Stimulus
              </h4>
              <p className="text-xs opacity-90 leading-relaxed font-light">
                Anak usia 4-6 tahun berada pada masa keemasan penyerapan stimulus. Berikan stimulasi yang menyenangkan tanpa memberikan paksaan berlebih.
              </p>
            </div>
          </aside>
        </div>

        {/* Strengths & Suggestions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Strengths checklist */}
          <section className="bg-white rounded-[2rem] border border-outline-variant p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="w-6 h-6 text-success" />
              <h3 className="text-xl font-bold text-on-surface">Kekuatan Teridentifikasi</h3>
            </div>
            {satisfiedIndicators.length === 0 ? (
              <p className="text-sm text-on-surface-variant italic p-4 text-center">Belum ada indikator yang terpenuhi penuh secara biner.</p>
            ) : (
              <ul className="space-y-3">
                {satisfiedIndicators.map((ind) => (
                  <li key={ind.code} className="flex gap-3 items-start p-3 bg-surface-container-low rounded-xl border border-slate-100">
                    <span className="font-bold text-xs text-success bg-white border border-success/20 rounded-md px-1.5 py-0.5 mt-0.5 shrink-0">{ind.code}</span>
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{ind.label}</p>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wide">Persentase Variabel Penyusun: {ind.pct}%</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Development Path Suggestions */}
          <section className="bg-white rounded-[2rem] border border-outline-variant p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-secondary" />
              <h3 className="text-xl font-bold text-on-surface">Rekomendasi Pola Asuh / Stimulus</h3>
            </div>
            <div className="space-y-4">
              <div className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:bottom-0 before:w-1.5 before:bg-secondary-container rounded-r-xl p-3 bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                <h4 className="font-bold text-sm text-secondary">Aktivitas Stimulan</h4>
                <p className="text-on-surface-variant text-xs mt-1 leading-relaxed font-light">
                  {primaryResult.suggestions}
                </p>
              </div>
              <div className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:bottom-0 before:w-1.5 before:bg-secondary-container rounded-r-xl p-3 bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                <h4 className="font-bold text-sm text-secondary">Tingkat Lanjut</h4>
                <p className="text-on-surface-variant text-xs mt-1 leading-relaxed font-light">
                  Fasilitasi anak untuk berinteraksi di lingkungan kelompok kecil terlebih dahulu untuk mengasah bakat sosial dan asertivitas dirinya.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Inference Trace Section */}
        <section className="bg-surface-container/50 border border-outline-variant rounded-2xl p-6 md:p-8 space-y-6 print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-lg font-bold text-on-surface">Transparansi Proses Mesin Inferensi</h4>
              <p className="text-xs text-on-surface-variant mt-1">
                Ingin melihat bagaimana sistem menyimpulkan hasil bakat anak Anda secara logis? Buka riwayat trace di bawah ini.
              </p>
            </div>
            <button
              onClick={() => setShowTrace(!showTrace)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-outline-variant rounded-xl text-xs font-bold hover:bg-slate-50 transition-all text-primary"
            >
              {showTrace ? (
                <>
                  Sembunyikan Trace
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  Lihat Jalur Inferensi (Trace)
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {showTrace && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 animate-slide-in">
              <p className="text-xs text-on-surface-variant font-light">
                Metode **Forward Chaining** mengevaluasi 83 variabel biner teramati (Skor $\ge$ 4 = TRUE) untuk mengonfirmasi 27 indikator pada level 1. Masing-masing kriteria bakat pada level 2 membutuhkan seluruh indikator penyusunnya bernilai TRUE agar kriteria tersebut bernilai TRUE secara biner.
              </p>
              <div className="space-y-6">
                {results.map((res) => (
                  <div key={res.criterion_code} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-primary">{res.criterion_label} ({res.criterion_code})</span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                        res.is_rule_satisfied ? "bg-success/20 text-success" : "bg-slate-200 text-slate-600"
                      }`}>
                        {res.is_rule_satisfied ? "Rule Satisfied (TRUE)" : "Rule Not Satisfied (FALSE)"}
                      </span>
                    </div>
                    {/* Log list */}
                    <div className="space-y-1 bg-white border border-slate-100 p-3 rounded-lg text-xs font-mono max-h-40 overflow-y-auto">
                      {res.trace.map((t, idx) => (
                        <p key={idx} className={t.startsWith("✓") ? "text-success" : t.startsWith("Aturan") ? "text-primary font-bold" : "text-slate-500"}>
                          {t}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-container-highest border-t border-slate-200 print:hidden">
        <p className="text-xs text-on-surface-variant">© 2026 TalentaKu Expert Systems. Landasan Akademis Tepercaya.</p>
        <div className="flex gap-6 text-xs text-on-surface-variant">
          <Link to="/" className="hover:text-primary transition-colors">Beranda</Link>
          <Link to="/history" className="hover:text-primary transition-colors">Daftar Riwayat</Link>
        </div>
      </footer>
    </div>
  );
}
