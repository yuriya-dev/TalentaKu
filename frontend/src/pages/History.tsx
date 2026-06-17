import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brain, FileText, ArrowLeft, Loader2, Eye } from "lucide-react";
import { fetchHistory, type HistoryItem } from "../api";

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchHistory();
        setHistory(data);
      } catch (err: any) {
        setError(err.message || "Gagal memuat riwayat konsultasi");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="mt-4 text-on-surface-variant text-sm">Memuat riwayat konsultasi...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* TopAppBar */}
      <header className="bg-surface/80 glass-header sticky top-0 z-50 flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 shadow-sm border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Brain className="text-primary w-8 h-8" />
          <span className="text-headline-md font-bold text-primary">TalentaKu</span>
        </div>
        <nav className="hidden md:flex gap-8">
          <Link className="text-on-surface-variant hover:text-primary transition-colors font-medium" to="/">Home</Link>
          <Link className="font-semibold text-primary border-b-2 border-primary pb-1" to="/history">Riwayat Konsultasi</Link>
          <Link className="text-on-surface-variant hover:text-primary transition-colors font-medium" to="/admin">Admin Panel</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/intake" className="px-5 py-2 bg-primary text-on-primary rounded-xl text-sm font-semibold hover:scale-[1.02] active:scale-95 transition-all shadow-sm">
            Mulai Tes
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-10 pb-24 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto w-full space-y-8">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-on-background">Daftar Riwayat Konsultasi</h1>
          <p className="text-on-surface-variant text-sm font-light">
            Berikut adalah daftar riwayat observasi dan penentuan bakat anak yang pernah dilakukan di sistem.
          </p>
        </div>

        {error ? (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-center text-sm">
            {error}
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white rounded-[2rem] border border-outline-variant p-12 text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto">
              <FileText className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-on-surface">Belum Ada Riwayat</h3>
              <p className="text-sm text-on-surface-variant max-w-sm mx-auto">
                Anda belum pernah melakukan observasi bakat anak. Mulai sekarang untuk melihat hasilnya di sini.
              </p>
            </div>
            <Link to="/intake" className="inline-flex px-6 py-3 bg-primary text-on-primary rounded-xl font-semibold shadow-md">
              Mulai Konsultasi Pertama
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] border border-outline-variant shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container text-xs text-on-surface-variant uppercase font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Nama Anak</th>
                    <th className="px-6 py-4">Usia</th>
                    <th className="px-6 py-4">Sekolah / TK</th>
                    <th className="px-6 py-4">Bakat Teridentifikasi</th>
                    <th className="px-6 py-4">Matching Score</th>
                    <th className="px-6 py-4">Waktu Selesai</th>
                    <th className="px-6 py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold uppercase">
                            {item.child_name.slice(0, 2)}
                          </div>
                          <span className="font-semibold text-on-surface">{item.child_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant">
                        {item.child_age} Tahun &bull; {item.child_gender === "male" ? "Boy" : "Girl"}
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant font-light">
                        {item.child_school}
                      </td>
                      <td className="px-6 py-4">
                        {item.status === "COMPLETED" ? (
                          <span className="inline-flex px-3 py-1 bg-primary/5 text-primary text-xs font-semibold rounded-full">
                            {item.top_talent}
                          </span>
                        ) : (
                          <span className="inline-flex px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-semibold rounded-full border border-yellow-100">
                            Dalam Proses
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {item.status === "COMPLETED" ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-success h-full" style={{ width: `${item.confidence_score}%` }}></div>
                            </div>
                            <span className="text-xs font-bold text-on-surface-variant">{item.confidence_score}%</span>
                          </div>
                        ) : (
                          <span className="text-xs text-on-surface-variant font-light">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant font-light">
                        {new Date(item.completed_at || item.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {item.status === "COMPLETED" ? (
                          <button
                            onClick={() => navigate(`/results/${item.id}`)}
                            className="p-2 text-outline hover:text-primary rounded-lg hover:bg-slate-100 transition-all"
                            title="Lihat Detail Hasil"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => navigate(`/assessment/${item.id}`)}
                            className="text-xs font-bold text-primary hover:underline"
                          >
                            Lanjutkan Tes
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-margin-mobile md:px-margin-desktop flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-container-highest border-t border-slate-200 mt-auto">
        <p className="text-xs text-on-surface-variant">© 2026 TalentaKu Expert Systems. Data Observasi Runtut.</p>
        <div className="flex gap-6 text-xs text-on-surface-variant">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <a href="#" className="hover:text-primary transition-colors">Kebijakan Privasi</a>
        </div>
      </footer>
    </div>
  );
}
