import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brain, Sliders, X, Layers, Database, LogOut, ArrowRight, Activity, Cpu, PlayCircle, Loader2, Award } from "lucide-react";
import { fetchRules, simulateInference, type RulesResponse, type EvaluationResult } from "../api";

export default function AdminRules() {
  const navigate = useNavigate();
  const [rules, setRules] = useState<RulesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [simModalOpen, setSimModalOpen] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [simResults, setSimResults] = useState<EvaluationResult[]>([]);
  const [simAnswers, setSimAnswers] = useState<Record<string, number>>({});
  const [simThreshold, setSimThreshold] = useState(4);
  const [error, setError] = useState("");

  const [filterQuery, setFilterQuery] = useState("");

  // Load rules definitions
  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchRules();
        setRules(data);
        // Initialize simAnswers with default score 1 for all variables
        const initialAnswers: Record<string, number> = {};
        data.variables.forEach((v) => {
          initialAnswers[v.code] = 1;
        });
        setSimAnswers(initialAnswers);
      } catch (err: any) {
        setError(err.message || "Gagal memuat aturan pakar");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSimVariableChange = (code: string, score: number) => {
    setSimAnswers((prev) => ({
      ...prev,
      [code]: score,
    }));
  };

  const handleRunSimulation = async () => {
    setSimulating(true);
    try {
      const payload = Object.entries(simAnswers).map(([code, score]) => ({
        variable_code: code,
        score,
      }));
      const response = await simulateInference(payload, simThreshold);
      setSimResults(response.results);
    } catch (err: any) {
      alert("Gagal melakukan simulasi: " + err.message);
    } finally {
      setSimulating(false);
    }
  };

  const setAllSimValues = (score: number) => {
    if (!rules) return;
    const newAnswers: Record<string, number> = {};
    rules.variables.forEach((v) => {
      newAnswers[v.code] = score;
    });
    setSimAnswers(newAnswers);
  };

  if (loading || !rules) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="mt-4 text-on-surface-variant text-sm">Menyiapkan Rule Builder &amp; Simulasi...</p>
      </div>
    );
  }

  // Pre-configured static Level 1 and Level 2 rule logic descriptions for display in table
  const staticRuleLogic = [
    { id: "R-1", logic: "IF C1 AND C2 AND C3", target: "I1: Perbendaharaan Kata Tinggi", status: "Validated" },
    { id: "R-2", logic: "IF C4 AND C5 AND C6 AND C7 AND C8 AND C9", target: "I2: Ingatan Kuat", status: "Validated" },
    { id: "R-3", logic: "IF C10 AND C11 AND C12 AND C13 AND C14", target: "I3: Penguasaan Kata Abstrak", status: "Validated" },
    { id: "R-4", logic: "IF I1 AND I2 AND I3", target: "K1: Intelektual Umum (Bakat Akhir)", status: "Validated" },
    { id: "R-5", logic: "IF C15 AND C16 AND C17 AND C18", target: "I4: Pemikiran Abstrak", status: "Validated" },
    { id: "R-6", logic: "IF C19 AND C20 AND C21 AND C22 AND C23 AND C24 AND C25", target: "I5: Prestasi Matematika", status: "Validated" },
    { id: "R-7", logic: "IF I4 AND I5", target: "K2: Akademik Khusus (Bakat Akhir)", status: "Validated" },
    { id: "R-16", logic: "IF I6 AND I7 AND I8 AND I9 AND I10 AND I11 AND I12 AND I13", target: "K3: Kreatif (Bakat Akhir)", status: "Validated" },
    { id: "R-22", logic: "IF I14 AND I15 AND I16 AND I17 AND I18", target: "K4: Kepemimpinan (Bakat Akhir)", status: "Validated" },
    { id: "R-27", logic: "IF I19 AND I20 AND I21 AND I22", target: "K5: Seni (Bakat Akhir)", status: "Validated" },
    { id: "R-33", logic: "IF I23 AND I24 AND I25 AND I26 AND I27", target: "K6: Psikomotorik (Bakat Akhir)", status: "Validated" },
  ];

  const filteredRules = staticRuleLogic.filter((r) =>
    r.id.toLowerCase().includes(filterQuery.toLowerCase()) ||
    r.logic.toLowerCase().includes(filterQuery.toLowerCase()) ||
    r.target.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-background overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="h-screen w-64 hidden md:flex flex-col bg-surface-container-low py-8 px-4 gap-4 border-r border-outline-variant select-none">
        <div className="flex items-center gap-3 px-2 mb-6">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-on-primary">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-primary leading-tight font-sans">TalentaKu</h1>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Expert System</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          <Link to="/admin" className="text-on-surface-variant hover:bg-slate-200/50 flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-sm">
            <Activity className="w-5 h-5" />
            <span>Overview</span>
          </Link>
          <Link to="/admin/rules" className="bg-primary text-on-primary rounded-xl font-bold flex items-center gap-3 px-4 py-3 transition-all duration-200">
            <Sliders className="w-5 h-5" />
            <span className="text-sm">Rule Builder</span>
          </Link>
          <Link to="/" className="text-on-surface-variant hover:bg-slate-200/50 flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-sm">
            <ArrowRight className="w-5 h-5" />
            <span>Ke Landing Page</span>
          </Link>
        </nav>

        <div className="mt-auto border-t border-slate-200 pt-4 space-y-1">
          <button onClick={() => navigate("/")} className="w-full text-error flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-all font-bold text-sm">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col overflow-y-auto">
        {/* Top App Bar */}
        <header className="glass-header sticky top-0 flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 z-30 shadow-sm border-b border-slate-100 bg-white/80">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-primary font-sans">Rule Builder</h2>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSimModalOpen(true)}
              className="flex items-center gap-2 bg-secondary text-on-secondary px-4 py-2.5 rounded-xl font-semibold text-sm hover:scale-[1.02] active:scale-95 shadow-sm transition-all"
            >
              <PlayCircle className="w-5 h-5" />
              Jalankan Simulasi
            </button>
          </div>
        </header>

        {/* Dashboard Page Wrapper */}
        <div className="p-margin-mobile md:p-margin-desktop space-y-8 max-w-6xl w-full">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">
              {error}
            </div>
          )}

          {/* Rule Hierarchy Visualizer (Bento Style layout) */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* L1: Variables */}
            <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm relative space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5 uppercase tracking-wider">
                  <Database className="w-4.5 h-4.5 text-primary" />
                  L1: Input Variables
                </h3>
                <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded text-[10px] font-bold">83 Total</span>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-on-surface flex justify-between items-center">
                  <span>C1-C14: Intelektual Umum</span>
                  <span className="text-primary font-bold">14 Vars</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-on-surface flex justify-between items-center">
                  <span>C15-C25: Akademik Khusus</span>
                  <span className="text-primary font-bold">11 Vars</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-on-surface flex justify-between items-center">
                  <span>C26-C48: Kreatif &amp; Sosial</span>
                  <span className="text-primary font-bold">23 Vars</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-on-surface flex justify-between items-center">
                  <span>C49-C62: Kepemimpinan</span>
                  <span className="text-primary font-bold">14 Vars</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-on-surface flex justify-between items-center">
                  <span>C63-C69: Seni &amp; Musik</span>
                  <span className="text-primary font-bold">7 Vars</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-on-surface flex justify-between items-center">
                  <span>C70-C83: Motorik / Psikomotorik</span>
                  <span className="text-primary font-bold">14 Vars</span>
                </div>
              </div>
            </div>

            {/* L2: Indicators */}
            <div className="bg-white border border-primary/20 rounded-[2rem] p-6 shadow-sm relative space-y-6 bg-primary/[0.02]">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider">
                  <Layers className="w-4.5 h-4.5" />
                  L2: Talent Indicators
                </h3>
                <span className="bg-primary text-white px-2.5 py-0.5 rounded text-[10px] font-bold">27 Active</span>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-white border border-primary/20 rounded-xl text-xs font-bold text-primary flex justify-between items-center">
                  <span>I1-I3: Bahasa/Verbal</span>
                  <span>3 Ind</span>
                </div>
                <div className="p-3 bg-white border border-primary/20 rounded-xl text-xs font-bold text-primary flex justify-between items-center">
                  <span>I4-I5: Logis/Akademik</span>
                  <span>2 Ind</span>
                </div>
                <div className="p-3 bg-white border border-primary/20 rounded-xl text-xs font-bold text-primary flex justify-between items-center">
                  <span>I6-I13: Karakter Kreatif</span>
                  <span>8 Ind</span>
                </div>
                <div className="p-3 bg-white border border-primary/20 rounded-xl text-xs font-bold text-primary flex justify-between items-center">
                  <span>I14-I18: Interpersonal</span>
                  <span>5 Ind</span>
                </div>
                <div className="p-3 bg-white border border-primary/20 rounded-xl text-xs font-bold text-primary flex justify-between items-center">
                  <span>I19-I22: Kesenian Anak</span>
                  <span>4 Ind</span>
                </div>
                <div className="p-3 bg-white border border-primary/20 rounded-xl text-xs font-bold text-primary flex justify-between items-center">
                  <span>I23-I27: Kelenturan Fisik</span>
                  <span>5 Ind</span>
                </div>
              </div>
            </div>

            {/* L3: Criteria (Final Bakat) */}
            <div className="bg-white border border-secondary/20 rounded-[2rem] p-6 shadow-sm relative space-y-6 bg-secondary/[0.02]">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-secondary flex items-center gap-1.5 uppercase tracking-wider">
                  <Award className="w-4.5 h-4.5" />
                  L3: Evaluation Criteria
                </h3>
                <span className="bg-secondary text-white px-2.5 py-0.5 rounded text-[10px] font-bold">6 Bakat</span>
              </div>
              <div className="space-y-4">
                {rules.criteria.map((crit) => (
                  <div key={crit.code} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-secondary bg-secondary/5 px-2 py-0.5 rounded">
                      {crit.code}
                    </span>
                    <span className="text-xs font-semibold text-on-surface">{crit.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Rules List Table */}
          <section className="bg-white border border-outline-variant rounded-[2rem] overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-on-surface">Aturan Logika Pakar (Forward Chaining)</h3>
                <p className="text-xs text-on-surface-variant font-light mt-0.5">Sistem mengelola 33 percabangan aturan evaluasi.</p>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari aturan..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="pl-4 pr-10 py-2 border border-outline-variant rounded-full text-xs outline-none focus:border-primary w-48"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-slate-50 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  <tr>
                    <th className="px-8 py-4">ID</th>
                    <th className="px-8 py-4">Aturan Logika (AND Clause)</th>
                    <th className="px-8 py-4">Indikator / Bakat yang Dipicu</th>
                    <th className="px-8 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {filteredRules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-indigo-50/10 transition-colors">
                      <td className="px-8 py-4 font-mono text-xs font-bold text-primary">{rule.id}</td>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-on-surface-variant uppercase">IF</span>
                          <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-mono">
                            {rule.logic.replace("IF ", "")}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-4 font-semibold text-secondary text-xs">{rule.target}</td>
                      <td className="px-8 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-success/10 text-success rounded-full text-[10px] font-bold uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                          {rule.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* Simulation Modal */}
      {simModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-on-surface/40 backdrop-blur-sm">
          <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-slide-in">
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-100 flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-xl font-bold text-on-surface">Konsol Simulasi Inferensi</h3>
                <p className="text-xs text-on-surface-variant font-light mt-0.5">Simulasikan observasi input untuk menelusuri penentuan bakat.</p>
              </div>
              <button
                onClick={() => {
                  setSimModalOpen(false);
                  setSimResults([]);
                }}
                className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors text-slate-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-grow overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Side: Mock Inputs */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm text-on-surface uppercase tracking-wider">Nilai Input Observasi</h4>
                  <div className="flex gap-2">
                    <button onClick={() => setAllSimValues(1)} className="px-2.5 py-1 bg-slate-100 rounded text-[10px] font-bold text-on-surface-variant">Min (1)</button>
                    <button onClick={() => setAllSimValues(5)} className="px-2.5 py-1 bg-primary/10 text-primary rounded text-[10px] font-bold">Max (5)</button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-on-surface-variant uppercase block">Simulasi Threshold Biner</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="2"
                      max="5"
                      step="1"
                      value={simThreshold}
                      onChange={(e) => setSimThreshold(parseInt(e.target.value))}
                      className="w-full accent-primary h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="font-bold text-sm text-primary bg-indigo-50 border border-primary/20 px-2 py-0.5 rounded-md">{simThreshold}</span>
                  </div>
                </div>

                <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 max-h-80 overflow-y-auto divide-y divide-slate-200/50 space-y-3">
                  {/* Highlight core variables to toggle rather than rendering all 83 inside the modal */}
                  <p className="text-[10px] text-on-surface-variant italic leading-normal font-light">
                    Tingkatkan skor variabel di bawah ini ke nilai $\ge$ {simThreshold} untuk mensimulasikan pemenuhan logika AND:
                  </p>
                  {[
                    { code: "C1", label: "C1: Menirukan kalimat sederhana" },
                    { code: "C2", label: "C2: Meniru kembali 4-5 urutan kata" },
                    { code: "C3", label: "C3: Mengulangi kalimat panjang" },
                    { code: "C15", label: "C15: Menyebutkan urutan bilangan 1-10" },
                    { code: "C16", label: "C16: Menunjuk lambang bilangan 1-10" },
                    { code: "C26", label: "C26: Mengungkapkan pendapat sederhana" },
                    { code: "C27", label: "C27: Menjawab pertanyaan informasi" },
                    { code: "C49", label: "C49: Berani bertanya kritis" },
                    { code: "C50", label: "C50: Bertanggung jawab merapikan mainan" },
                    { code: "C63", label: "C63: Melukiskan apa yang dilihat/didengar" },
                    { code: "C70", label: "C70: Berjalan, berlari seimbang" },
                    { code: "C71", label: "C71: Melempar dan menangkap bola" },
                    { code: "C72", label: "C72: Meniti di atas papan titian" },
                  ].map((v) => (
                    <div key={v.code} className="flex justify-between items-center py-2 text-xs">
                      <span className="font-medium text-on-surface-variant">{v.label}</span>
                      <select
                        value={simAnswers[v.code] || 1}
                        onChange={(e) => handleSimVariableChange(v.code, parseInt(e.target.value))}
                        className="bg-white border border-outline-variant rounded-md text-xs py-1 px-2 focus:ring-primary focus:border-primary outline-none"
                      >
                        <option value="1">1 (Tidak Pernah)</option>
                        <option value="2">2 (Jarang)</option>
                        <option value="3">3 (Kadang)</option>
                        <option value="4">4 (Sering)</option>
                        <option value="5">5 (Selalu)</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side: Simulated Results */}
              <div className="space-y-6 flex flex-col">
                <h4 className="font-bold text-sm text-on-surface uppercase tracking-wider">Output Hasil Simulasi</h4>
                {simulating ? (
                  <div className="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-6">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="mt-2 text-xs text-on-surface-variant">Menghitung inferensi...</p>
                  </div>
                ) : simResults.length === 0 ? (
                  <div className="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-6 text-center text-on-surface-variant space-y-3">
                    <Sliders className="w-8 h-8 text-slate-300" />
                    <p className="text-xs font-light max-w-xs">
                      Atur skor variabel di panel kiri lalu klik tombol "Jalankan Inferensi" untuk mensimulasikan hasil penentuan bakat.
                    </p>
                  </div>
                ) : (
                  <div className="flex-grow space-y-4 max-h-[45vh] overflow-y-auto pr-2">
                    {simResults.slice(0, 3).map((res) => (
                      <div key={res.criterion_code} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-primary bg-primary/5 px-2 py-0.5 rounded">{res.criterion_code}</span>
                            <span className="font-bold text-xs text-on-surface">{res.criterion_label}</span>
                          </div>
                          <p className="text-[10px] text-on-surface-variant">
                            Biner Rule: <strong className={res.is_rule_satisfied ? "text-success" : "text-slate-500"}>
                              {res.is_rule_satisfied ? "TRUE (Satisfied)" : "FALSE"}
                            </strong>
                          </p>
                        </div>
                        <span className="text-lg font-extrabold text-primary">{res.score_percentage}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button
                onClick={() => {
                  setSimModalOpen(false);
                  setSimResults([]);
                }}
                className="px-6 py-3 border border-outline-variant font-semibold text-sm rounded-xl hover:bg-slate-100 transition-colors"
              >
                Tutup
              </button>
              <button
                onClick={handleRunSimulation}
                disabled={simulating}
                className="px-8 py-3 bg-primary text-on-primary font-semibold text-sm rounded-xl shadow-lg hover:bg-primary/95 transition-all flex items-center gap-2"
              >
                {simulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
                Jalankan Inferensi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
