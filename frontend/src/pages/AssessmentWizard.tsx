import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Brain, ArrowLeft, ArrowRight, Loader2, Award, BookOpen, Calculator, Sparkles, Trophy, Music, Flame } from "lucide-react";
import { fetchVariables, fetchConsultation, submitAnswers, type Variable } from "../api";

interface QuestionSection {
  title: string;
  desc: string;
  icon: React.ReactNode;
  rangeStart: number; // 1-based index in variables array
  rangeEnd: number;
}

export default function AssessmentWizard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const sessionID = parseInt(id || "0");

  const [childName, setChildName] = useState("");
  const [variables, setVariables] = useState<Variable[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0); // index in variables array
  const [showSectionTransition, setShowSectionTransition] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Section configuration
  const sections: QuestionSection[] = [
    {
      title: "Bahasa & Intelektual Umum",
      desc: "Bagian pertama mengukur perbendaharaan kata, daya ingat verbal, dan ekspresi bercerita anak.",
      icon: <BookOpen className="w-12 h-12 text-primary" />,
      rangeStart: 0,
      rangeEnd: 13, // C1-C14 (14 questions)
    },
    {
      title: "Akademik Khusus",
      desc: "Bagian ini mengukur pemahaman numerik dasar, bentuk geometri, serta eksplorasi sensori dan ilmiah.",
      icon: <Calculator className="w-12 h-12 text-indigo-600" />,
      rangeStart: 14,
      rangeEnd: 24, // C15-C25 (11 questions)
    },
    {
      title: "Kreativitas & Sosial",
      desc: "Bagian ini mengukur orisinalitas ide, apresiasi karya orang lain, kepedulian sosial, dan kemandirian.",
      icon: <Sparkles className="w-12 h-12 text-cyan-600" />,
      rangeStart: 25,
      rangeEnd: 48, // C26-C48 (23 questions)
    },
    {
      title: "Kepemimpinan",
      desc: "Bagian ini mengukur tanggung jawab, inisiatif memimpin kelompok, kerja sama tim, dan kematangan emosional.",
      icon: <Trophy className="w-12 h-12 text-amber-600" />,
      rangeStart: 49,
      rangeEnd: 62, // C49-C62 (14 questions)
    },
    {
      title: "Seni Visual & Pertunjukan",
      desc: "Bagian ini mengukur bakat menggambar, pemahaman irama musik, kepekaan nada, dan pengekspresian tubuh.",
      icon: <Music className="w-12 h-12 text-purple-600" />,
      rangeStart: 63,
      rangeEnd: 69, // C63-C69 (7 questions)
    },
    {
      title: "Psikomotorik",
      desc: "Bagian terakhir mengukur keseimbangan fisik kasar, koordinasi motorik halus, origami, dan penguasaan mekanik.",
      icon: <Flame className="w-12 h-12 text-emerald-600" />,
      rangeStart: 70,
      rangeEnd: 82, // C70-C83 (14 questions)
    },
  ];

  // Fetch session and variables
  useEffect(() => {
    async function loadData() {
      try {
        const [sessionData, varsData] = await Promise.all([
          fetchConsultation(sessionID),
          fetchVariables(),
        ]);
        setChildName(sessionData.child.name);
        setVariables(varsData);

        if (sessionData.status === "COMPLETED") {
          navigate(`/results/${sessionID}`);
        }
      } catch (err: any) {
        setError(err.message || "Gagal memuat data observasi");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [sessionID, navigate]);

  // Determine current section
  const currentSectionIndex = sections.findIndex(
    (sec) => currentIndex >= sec.rangeStart && currentIndex <= sec.rangeEnd
  );
  const currentSection = sections[currentSectionIndex] || sections[0];

  // Handle section transition check
  useEffect(() => {
    // If we just entered a new section (excluding the first question of the first section)
    const isFirstQuestionOfSection = sections.some(
      (sec, idx) => idx > 0 && currentIndex === sec.rangeStart
    );
    if (isFirstQuestionOfSection) {
      setShowSectionTransition(true);
    }
  }, [currentIndex]);

  const handleScoreSelect = (score: number) => {
    const currentVar = variables[currentIndex];
    setAnswers((prev) => ({
      ...prev,
      [currentVar.code]: score,
    }));
  };

  const handleNext = async () => {
    const currentVar = variables[currentIndex];
    if (answers[currentVar.code] === undefined) {
      alert("Silakan pilih salah satu skor terlebih dahulu sebelum melanjutkan.");
      return;
    }

    if (currentIndex < variables.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Submit Answers
      setSubmitting(true);
      setError("");

      try {
        const payload = Object.entries(answers).map(([code, score]) => ({
          variable_code: code,
          score,
        }));
        await submitAnswers(sessionID, payload);
        navigate(`/results/${sessionID}`);
      } catch (err: any) {
        setError(err.message || "Gagal mengirimkan jawaban. Coba kirim ulang.");
        setSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="mt-4 text-on-surface-variant text-sm">Menyiapkan lembar observasi...</p>
      </div>
    );
  }

  if (error && variables.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
        <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl max-w-md text-center space-y-4">
          <p>{error}</p>
          <button onClick={() => navigate("/")} className="px-6 py-2 bg-primary text-on-primary rounded-xl font-semibold">
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  const currentVar = variables[currentIndex];
  const progressPercent = ((currentIndex + 1) / variables.length) * 100;
  const currentAnswer = answers[currentVar?.code];

  // Section Interstitial Screen
  if (showSectionTransition) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-container-low p-6 animate-fade-in">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-[2rem] p-10 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 text-primary/5">
            <Brain className="w-32 h-32" />
          </div>
          <div className="flex justify-center">{currentSection.icon}</div>
          <div className="space-y-2">
            <span className="text-xs font-bold text-primary uppercase tracking-widest block">Bagian Baru</span>
            <h2 className="text-2xl font-bold text-on-surface">{currentSection.title}</h2>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">{currentSection.desc}</p>
          <div className="pt-4">
            <button
              onClick={() => setShowSectionTransition(false)}
              className="w-full bg-primary text-on-primary font-semibold py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all flex items-center justify-center gap-2"
            >
              Lanjutkan Observasi
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navigation Bar */}
      <header className="bg-surface/80 glass-header sticky top-0 z-50 flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 shadow-sm border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Brain className="text-primary w-8 h-8" />
          <span className="text-headline-md font-bold text-primary">TalentaKu</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-on-surface-variant block">Observasi Anak:</span>
            <span className="text-sm font-bold text-primary block">{childName}</span>
          </div>
        </div>
      </header>

      {/* Global Progress Bar (Top of Screen) */}
      <div className="w-full h-1.5 bg-surface-container sticky top-[72px] z-40">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out shadow-[0_0_8px_rgba(79,70,229,0.4)]"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Main Content: The Wizard */}
      <main className="flex-grow flex flex-col items-center justify-center px-margin-mobile py-12 relative">
        {/* Subtle Ambient Background Decorations */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute top-1/2 -right-24 w-64 h-64 bg-secondary/5 rounded-full blur-[80px] -z-10"></div>

        {/* Category & Progress Info */}
        <div className="max-w-wizard-width w-full mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold mb-2 shadow-sm">
                {currentSection.title}
              </span>
              <h2 className="text-2xl font-bold text-on-surface">Indikator {currentVar.code}</h2>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-on-surface-variant">Pertanyaan {currentIndex + 1} dari {variables.length}</p>
              <div className="w-32 h-1 bg-surface-container rounded-full mt-2 ml-auto overflow-hidden">
                <div
                  className="h-full bg-secondary transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <section className="max-w-wizard-width w-full bg-surface-container-lowest p-8 md:p-12 rounded-[2rem] border border-outline-variant shadow-sm space-y-8">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
              {error}
            </div>
          )}

          <div className="text-center space-y-4">
            <p className="text-xl md:text-2xl font-medium text-on-surface leading-relaxed">
              &ldquo;{currentVar.label}&rdquo;
            </p>
            <p className="text-sm text-on-surface-variant italic">
              Seberapa sering anak melakukan perilaku di atas dalam kesehariannya?
            </p>
          </div>

          {/* Likert Scale */}
          <div className="grid grid-cols-5 gap-2 sm:gap-4">
            {[
              { score: 1, label: "Tidak Pernah" },
              { score: 2, label: "Jarang" },
              { score: 3, label: "Kadang" },
              { score: 4, label: "Sering" },
              { score: 5, label: "Selalu" },
            ].map((option) => (
              <button
                key={option.score}
                type="button"
                onClick={() => handleScoreSelect(option.score)}
                disabled={submitting}
                className={`flex flex-col items-center gap-3 group focus:outline-none`}
              >
                <div
                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl border-2 flex items-center justify-center font-bold text-lg transition-all ${
                    currentAnswer === option.score
                      ? "bg-primary-container border-primary text-on-primary-container scale-110 shadow-lg shadow-primary/10"
                      : "bg-surface-container border-transparent text-on-surface-variant group-hover:bg-surface-container-high"
                  }`}
                >
                  {option.score}
                </div>
                <span
                  className={`text-[10px] sm:text-xs text-center leading-tight transition-colors ${
                    currentAnswer === option.score ? "text-primary font-bold" : "text-on-surface-variant"
                  }`}
                >
                  {option.label}
                </span>
              </button>
            ))}
          </div>

          {/* Wizard Controls */}
          <div className="flex items-center justify-between gap-4 pt-6 border-t border-slate-100">
            <button
              onClick={handleBack}
              disabled={currentIndex === 0 || submitting}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border border-outline-variant text-sm font-semibold transition-all ${
                currentIndex === 0
                  ? "opacity-40 cursor-not-allowed text-on-surface-variant"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Sebelumnya
            </button>
            <button
              onClick={handleNext}
              disabled={submitting}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-on-primary text-sm font-semibold shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Mengirim...
                </>
              ) : currentIndex === variables.length - 1 ? (
                <>
                  Selesai &amp; Evaluasi
                  <Award className="w-4 h-4" />
                </>
              ) : (
                <>
                  Berikutnya
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </section>

        {/* Floating Side Info Panel (Desktop Only) */}
        <aside className="hidden xl:block fixed right-12 top-1/2 -translate-y-1/2 w-64 bg-surface-container-high/50 p-6 rounded-3xl border border-outline-variant space-y-4">
          <h4 className="text-sm font-bold text-primary flex items-center gap-1.5">
            <Brain className="w-4.5 h-4.5" />
            Metodologi Evaluasi
          </h4>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Jawaban Anda dipetakan langsung ke basis pengetahuan pakar. Nilai **4 (Sering)** atau **5 (Selalu)** dianggap memenuhi indikator dalam aturan *AND-logic*.
          </p>
          <div className="pt-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-success"></span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Forward Chaining</span>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-margin-mobile md:px-margin-desktop flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-100 bg-surface-container-lowest">
        <p className="text-xs text-on-surface-variant">© 2026 TalentaKu Expert Systems. Profesional &amp; Bersahabat.</p>
        <div className="flex gap-6 text-xs text-on-surface-variant">
          <a href="#" className="hover:text-primary transition-colors">Bantuan</a>
          <a href="#" className="hover:text-primary transition-colors">Kebijakan Privasi</a>
        </div>
      </footer>
    </div>
  );
}
