import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brain, FileText, Users, Award, Shield, CheckCircle, Database, Settings, LogOut, ArrowRight, Activity, Sliders, Save, Loader2 } from "lucide-react";
import { fetchAdminStats, fetchSettings, updateSettings, fetchVariables, fetchHistory, type AdminStats, type Variable, type HistoryItem } from "../api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [thresholdInput, setThresholdInput] = useState("4");
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState("");
  const [error, setError] = useState("");

  const [activeCategory, setActiveCategory] = useState<"C1-C25" | "C26-C50" | "C51-C83">("C1-C25");

  // Load all stats and variables
  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, settingsData, varsData, historyData] = await Promise.all([
          fetchAdminStats(),
          fetchSettings(),
          fetchVariables(),
          fetchHistory(),
        ]);
        setStats(statsData);
        setSettings(settingsData);
        setThresholdInput(settingsData.likert_threshold || "4");
        setVariables(varsData);
        setHistory(historyData.slice(0, 5)); // show top 5 recent
      } catch (err: any) {
        setError(err.message || "Gagal memuat data admin");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsMessage("");
    try {
      await updateSettings({
        likert_threshold: thresholdInput,
        app_name: settings.app_name || "TalentaKu",
      });
      setSettingsMessage("Pengaturan threshold berhasil disimpan!");
      // Reload stats
      const statsData = await fetchAdminStats();
      setStats(statsData);
    } catch (err: any) {
      setSettingsMessage("Gagal menyimpan pengaturan: " + err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="mt-4 text-on-surface-variant text-sm">Menyiapkan Dashboard Admin...</p>
      </div>
    );
  }

  // Filter variables based on selected category
  const filteredVars = variables.filter((v) => {
    const num = parseInt(v.code.replace("C", ""));
    if (activeCategory === "C1-C25") return num >= 1 && num <= 25;
    if (activeCategory === "C26-C50") return num >= 26 && num <= 50;
    return num >= 51 && num <= 83;
  });

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
          <Link to="/admin" className="bg-primary text-on-primary rounded-xl font-bold flex items-center gap-3 px-4 py-3 transition-all duration-200">
            <Activity className="w-5 h-5" />
            <span className="text-sm">Overview</span>
          </Link>
          <Link to="/admin/rules" className="text-on-surface-variant hover:bg-slate-200/50 flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-sm">
            <Sliders className="w-5 h-5" />
            <span>Rule Builder</span>
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
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top App Bar */}
        <header className="glass-header sticky top-0 flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 z-30 shadow-sm border-b border-slate-100 bg-white/80">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-primary font-sans">System Overview</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 bg-indigo-100 flex items-center justify-center font-bold text-primary uppercase text-sm">
              AD
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold leading-none text-on-surface">Admin User</p>
              <p className="text-[10px] text-on-surface-variant mt-0.5">System Manager</p>
            </div>
          </div>
        </header>

        {/* Dashboard Page Wrapper */}
        <div className="p-margin-mobile md:p-margin-desktop space-y-8 max-w-6xl w-full">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">
              {error}
            </div>
          )}

          {/* Stats Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-outline-variant p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:translate-y-[-2px] transition-all">
              <div className="flex justify-between items-start">
                <span className="p-2 bg-primary/10 text-primary rounded-xl"><FileText className="w-5 h-5" /></span>
                <span className="text-success text-xs font-bold flex items-center">+12%</span>
              </div>
              <div className="mt-4">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Konsultasi</p>
                <h3 className="text-3xl font-extrabold text-primary font-sans mt-1">{stats?.total_assessments || 0}</h3>
              </div>
            </div>

            <div className="bg-white border border-outline-variant p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:translate-y-[-2px] transition-all">
              <div className="flex justify-between items-start">
                <span className="p-2 bg-indigo-50 text-indigo-700 rounded-xl"><Users className="w-5 h-5" /></span>
                <span className="text-success text-xs font-bold flex items-center">+5%</span>
              </div>
              <div className="mt-4">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Siswa Terdaftar</p>
                <h3 className="text-3xl font-extrabold text-indigo-700 font-sans mt-1">{stats?.active_students || 0}</h3>
              </div>
            </div>

            <div className="bg-white border border-outline-variant p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:translate-y-[-2px] transition-all">
              <div className="flex justify-between items-start">
                <span className="p-2 bg-emerald-50 text-success rounded-xl"><Award className="w-5 h-5" /></span>
                <span className="text-on-surface-variant text-xs font-bold flex items-center">Stabil</span>
              </div>
              <div className="mt-4">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Aturan Terpenuhi</p>
                <h3 className="text-3xl font-extrabold text-success font-sans mt-1">{stats?.identified_talents || 0}</h3>
              </div>
            </div>

            <div className="bg-white border border-outline-variant p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:translate-y-[-2px] transition-all">
              <div className="flex justify-between items-start">
                <span className="p-2 bg-red-50 text-error rounded-xl"><Shield className="w-5 h-5" /></span>
                <span className="text-error text-xs font-bold flex items-center">Ok</span>
              </div>
              <div className="mt-4">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Logic Health</p>
                <h3 className="text-3xl font-extrabold text-error font-sans mt-1">100%</h3>
              </div>
            </div>
          </div>

          {/* Distribution Chart & System Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Talent Distribution Chart */}
            <div className="lg:col-span-2 bg-white border border-outline-variant p-8 rounded-2xl shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-bold text-on-surface">Distribusi Bakat Teridentifikasi</h4>
              </div>
              <div className="h-64 w-full bg-slate-50 border border-slate-100 rounded-xl flex items-end justify-around px-6 pb-4 pt-8 relative">
                {stats?.talent_distribution.map((dist) => {
                  // Find max count to normalize height
                  const maxCount = Math.max(...stats.talent_distribution.map((d) => d.count), 1);
                  const barHeight = (dist.count / maxCount) * 100;
                  return (
                    <div key={dist.code} className="w-12 bg-primary/80 hover:bg-primary rounded-t-lg relative group transition-all duration-300 flex flex-col items-center justify-end" style={{ height: `${Math.max(barHeight, 5)}%` }}>
                      <span className="absolute -top-7 bg-on-surface text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {dist.count} Anak
                      </span>
                      <span className="text-[10px] text-white font-bold mb-1.5">{dist.count > 0 ? dist.count : ""}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-around text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                {stats?.talent_distribution.map((dist) => (
                  <span key={dist.code} title={dist.label}>{dist.code}</span>
                ))}
              </div>
              <p className="text-[10px] text-on-surface-variant italic text-center font-light">
                Keterangan: K1 (Intelektual), K2 (Akademik), K3 (Kreatif), K4 (Kepemimpinan), K5 (Seni), K6 (Psikomotorik)
              </p>
            </div>

            {/* Threshold Settings Panel */}
            <div className="bg-white border border-outline-variant p-6 rounded-2xl shadow-sm space-y-6">
              <h4 className="text-lg font-bold text-on-surface flex items-center gap-1.5">
                <Settings className="w-5 h-5 text-primary" />
                Konfigurasi Engine
              </h4>
              <form onSubmit={handleSaveSettings} className="space-y-6">
                {settingsMessage && (
                  <p className="p-3 bg-indigo-50 text-indigo-700 text-xs rounded-xl border border-indigo-200">
                    {settingsMessage}
                  </p>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase block">
                    Threshold Likert (Biner)
                  </label>
                  <p className="text-xs text-on-surface-variant font-light">
                    Batas skor minimal (1-5) agar variabel dianggap terpenuhi (TRUE). Default: 4.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="range"
                      min="2"
                      max="5"
                      step="1"
                      value={thresholdInput}
                      onChange={(e) => setThresholdInput(e.target.value)}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <span className="font-bold text-lg text-primary bg-indigo-50 border border-primary/20 px-3 py-1 rounded-lg">
                      {thresholdInput}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingSettings}
                  className="w-full bg-primary text-on-primary py-3 rounded-xl text-sm font-semibold shadow-md hover:bg-primary/95 transition-all flex items-center justify-center gap-2"
                >
                  {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Simpan Perubahan
                </button>
              </form>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
                <h5 className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1">
                  <Database className="w-4 h-4 text-emerald-500" />
                  Status Modul Pakar
                </h5>
                <ul className="text-xs text-on-surface-variant space-y-1.5 font-light">
                  <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-success" /> 83 Variabel Terdaftar</li>
                  <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-success" /> 27 Indikator Terdaftar</li>
                  <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-success" /> 33 Aturan Inferensi Aktif</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Variable List Management */}
          <section className="bg-white border border-outline-variant rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-bold text-on-surface">Ekosistem Variabel Observasi (C1-C83)</h4>
                <p className="text-xs text-on-surface-variant font-light">Daftar variabel penilai tumbuh kembang anak.</p>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                {(["C1-C25", "C26-C50", "C51-C83"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      activeCategory === cat ? "bg-white shadow-sm text-primary" : "text-on-surface-variant hover:text-primary"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="border border-slate-100 rounded-xl overflow-hidden">
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {filteredVars.map((v) => (
                  <div key={v.code} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                    <div className="space-y-1">
                      <span className="inline-block bg-indigo-50 border border-primary/10 text-primary font-bold text-xs px-2 py-0.5 rounded">
                        {v.code}
                      </span>
                      <p className="text-sm text-on-surface leading-normal pr-4">{v.label}</p>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant bg-slate-100 px-2.5 py-1 rounded">
                      {v.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Recent Consultations */}
          <section className="bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h4 className="text-lg font-bold text-on-surface">Riwayat Konsultasi Terbaru</h4>
              <Link to="/history" className="text-primary text-xs font-bold hover:underline">Lihat Semua</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-slate-50 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Nama Anak</th>
                    <th className="px-6 py-4">Bakat Teridentifikasi</th>
                    <th className="px-6 py-4">Confidence</th>
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-on-surface">{item.child_name}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2.5 py-0.5 bg-indigo-50 text-primary rounded-full text-xs font-semibold">
                          {item.top_talent}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-on-surface-variant">{item.confidence_score}%</td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant font-light">
                        {new Date(item.completed_at || item.created_at).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link to={`/results/${item.id}`} className="text-primary hover:underline text-xs font-bold">Detail</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
