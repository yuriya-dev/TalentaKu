import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, User, Loader2, ArrowLeft, ArrowRight, Shield } from "lucide-react";
import { childIntake } from "../api";

export default function ChildIntake() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [gender, setGender] = useState("");
  const [school, setSchool] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nama lengkap anak harus diisi");
      return;
    }
    if (!age) {
      setError("Pilih usia anak (usia 4, 5, atau 6 tahun)");
      return;
    }
    if (!gender) {
      setError("Pilih jenis kelamin anak");
      return;
    }
    if (!school.trim()) {
      setError("Nama sekolah / TK harus diisi");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await childIntake({
        name,
        age,
        gender,
        school,
      });
      // Route to wizard
      navigate(`/assessment/${response.consultation_id}`);
    } catch (err: any) {
      setError(err.message || "Gagal memulai sesi konsultasi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* TopAppBar */}
      <header className="bg-surface/80 glass-header sticky top-0 z-50 flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Brain className="text-primary w-8 h-8" />
          <span className="text-headline-md font-bold text-primary">TalentaKu</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/")} className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-slate-100">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="w-full bg-surface-container h-1.5 sticky top-[72px] z-40">
        <div className="bg-primary h-full w-[15%] transition-all duration-700 ease-in-out shadow-[0_0_8px_rgba(79,70,229,0.4)]"></div>
      </div>

      {/* Main Wizard Content */}
      <main className="flex-grow flex flex-col items-center justify-start py-12 px-margin-mobile md:px-margin-desktop relative overflow-hidden">
        {/* Subtle Ambient Background Decorations */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute top-1/2 -right-24 w-64 h-64 bg-secondary/5 rounded-full blur-[80px] -z-10"></div>

        <section className="max-w-wizard-width w-full space-y-6">
          {/* Header Section */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-2">
              <User className="w-4.5 h-4.5" />
              <span className="text-xs font-semibold uppercase tracking-wider">Langkah 1: Identitas Anak</span>
            </div>
            <h1 className="text-3xl font-bold text-on-surface">Data Observasi Anak</h1>
            <p className="text-on-surface-variant text-sm max-w-md mx-auto">
              Informasi ini digunakan untuk menganalisis kecenderungan bakat anak sesuai dengan rentang usianya.
            </p>
          </div>

          {/* Form Card */}
          <div className="glass-card rounded-[2rem] p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
                  {error}
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface block px-1" htmlFor="child-name">
                  Nama Lengkap Anak
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                  <input
                    id="child-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                    placeholder="Masukkan nama lengkap anak"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Age (4-6 Focus) */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-on-surface block px-1">
                  Usia Saat Ini
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {[4, 5, 6].map((ageOption) => (
                    <button
                      key={ageOption}
                      type="button"
                      onClick={() => setAge(ageOption)}
                      disabled={loading}
                      className={`p-4 text-center border-2 rounded-2xl transition-all ${
                        age === ageOption
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-outline-variant hover:border-primary/50 text-on-surface-variant"
                      }`}
                    >
                      <span className="block text-2xl font-bold mb-1">{ageOption}</span>
                      <span className="block text-xs">Tahun</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gender Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-surface block px-1">
                    Jenis Kelamin
                  </label>
                  <div className="flex gap-2 p-1 bg-surface-container rounded-xl">
                    <button
                      type="button"
                      onClick={() => setGender("male")}
                      disabled={loading}
                      className={`flex-1 text-center py-2.5 rounded-lg font-semibold text-sm transition-all ${
                        gender === "male"
                          ? "bg-white shadow-sm text-primary"
                          : "text-on-surface-variant hover:text-primary"
                      }`}
                    >
                      Laki-laki
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender("female")}
                      disabled={loading}
                      className={`flex-1 text-center py-2.5 rounded-lg font-semibold text-sm transition-all ${
                        gender === "female"
                          ? "bg-white shadow-sm text-primary"
                          : "text-on-surface-variant hover:text-primary"
                      }`}
                    >
                      Perempuan
                    </button>
                  </div>
                </div>

                {/* School / Kindergarten */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-surface block px-1" htmlFor="child-school">
                    Sekolah / TK
                  </label>
                  <input
                    id="child-school"
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                    placeholder="Nama Sekolah atau TK"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* CTA Section */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  disabled={loading}
                  className="text-on-surface-variant hover:text-primary font-semibold flex items-center gap-2 px-4 py-2 text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Kembali ke Beranda
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-primary text-on-primary font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/95 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Memulai...
                    </>
                  ) : (
                    <>
                      Mulai Penilaian
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Hint / Trust Badge */}
          <p className="text-center text-xs text-on-surface-variant/70 flex items-center justify-center gap-1.5 pt-4">
            <Shield className="w-4 h-4 text-emerald-500" />
            Data observasi tersimpan aman secara privat untuk identifikasi bakat anak.
          </p>
        </section>
      </main>
    </div>
  );
}
