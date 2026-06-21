import { useEffect, useState } from 'react'
import AdminSidebar from '../components/layout/AdminSidebar'

const rules = [
  { id: 'R-102', logicParts: ['Logical_Score > 85', 'Pattern_Score > 90'], target: 'Kedalaman Analisis', status: 'Tervalidasi', statusColor: 'bg-[#10B981]/10 text-[#10B981]' },
  { id: 'R-103', logicParts: ['Verbal_Score > 80', 'Creative_Synthesis == High'], target: 'Berkembang Lanjut', status: 'Draf', statusColor: 'bg-[#777587]/10 text-[#777587]' },
  { id: 'R-104', logicParts: ['Abstract_Velocity > 95'], target: 'Kecepatan Kognitif', status: 'Tervalidasi', statusColor: 'bg-[#10B981]/10 text-[#10B981]' },
]

export default function AdminRulesPage() {
  const [panelOpen, setPanelOpen] = useState(false)
  const [selectedRule, setSelectedRule] = useState('R-102')
  const [simOpen, setSimOpen] = useState(false)
  const [logicalScore, setLogicalScore] = useState(88)
  const [patternScore, setPatternScore] = useState(92)

  useEffect(() => {
    document.title = 'Pembuat Aturan | TalentaKu Admin'
  }, [])

  function openPanel(ruleId: string) {
    setSelectedRule(ruleId)
    setPanelOpen(true)
  }

  return (
    <div className="flex h-screen overflow-hidden font-sans text-[#191c1e]">
      <AdminSidebar />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top App Bar */}
        <header className="bg-[#f7f9fb]/80 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center w-full px-4 md:px-10 py-4 shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-[#3525cd]">Pembuat Aturan</h2>
            <div className="hidden md:flex gap-6 ml-8">
              <a href="#" className="text-sm font-bold text-[#3525cd] border-b-2 border-[#3525cd] py-1">Forward Chaining</a>
              <a href="#" className="text-sm font-semibold text-[#464555] hover:text-[#3525cd] transition-colors py-1">Riwayat Inferensi</a>
              <a href="#" className="text-sm font-semibold text-[#464555] hover:text-[#3525cd] transition-colors py-1">Variabel</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSimOpen(true)}
              className="flex items-center gap-2 bg-[#00687a] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-110 shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-base">play_circle</span>
              Jalankan Simulasi
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6">
          {/* Rule Hierarchy Visualizer */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Variables */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-bold text-[#464555] flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">data_object</span>
                  L1: VARIABEL MASUKAN
                </h3>
                <span className="bg-[#3525cd]/10 text-[#3525cd] px-2 py-0.5 rounded text-[10px] font-bold">TOTAL 12</span>
              </div>
              <div className="space-y-4">
                {['Penalaran Logis', 'Pengenalan Pola', 'Kefasihan Verbal'].map((v) => (
                  <div key={v} className="p-3 bg-white border border-[#c7c4d8] rounded-xl shadow-sm flex justify-between items-center group hover:border-[#3525cd] transition-colors cursor-pointer">
                    <span className="text-sm font-semibold">{v}</span>
                    <span className="material-symbols-outlined text-[#3525cd] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                  </div>
                ))}
                <div className="p-3 bg-white/50 border border-dashed border-[#c7c4d8] rounded-xl flex items-center justify-center text-[#777587] text-xs">
                  + 9 variabel lainnya
                </div>
              </div>
            </div>

            {/* Indicators */}
            <div className="glass-card rounded-2xl p-6 bg-[#3525cd]/5 border-[#3525cd]/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-bold text-[#3525cd] flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">hub</span>
                  L2: INDIKATOR BAKAT
                </h3>
                <span className="bg-[#3525cd] text-white px-2 py-0.5 rounded text-[10px] font-bold">8 AKTIF</span>
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-[#3525cd] text-white rounded-xl shadow-md flex justify-between items-center">
                  <span className="text-sm font-semibold">Kedalaman Analisis</span>
                  <span className="material-symbols-outlined">settings_input_component</span>
                </div>
                <div className="p-3 bg-white border border-[#3525cd]/30 rounded-xl shadow-sm flex justify-between items-center">
                  <span className="text-sm font-semibold text-[#3525cd]">Sintesis Kreatif</span>
                  <span className="material-symbols-outlined text-[#3525cd]/50">link</span>
                </div>
                <div className="p-3 bg-white border border-[#c7c4d8] rounded-xl shadow-sm flex justify-between items-center opacity-60">
                  <span className="text-sm font-semibold">Kecepatan Abstrak</span>
                  <span className="material-symbols-outlined text-[#777587]">link</span>
                </div>
              </div>
            </div>

            {/* Criteria */}
            <div className="glass-card rounded-2xl p-6 bg-[#00687a]/5 border-[#00687a]/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-bold text-[#00687a] flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">verified</span>
                  L3: KRITERIA EVALUASI
                </h3>
                <span className="bg-[#00687a] text-white px-2 py-0.5 rounded text-[10px] font-bold">3 KELUARAN</span>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-white border-2 border-[#00687a] rounded-2xl shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#00687a]" />
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-[#FCD34D]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                    <span className="text-sm font-bold">Potensi Luar Biasa</span>
                  </div>
                  <p className="text-xs text-[#464555]">Memerlukan skor tinggi pada 4+ indikator.</p>
                </div>
                <div className="p-4 bg-white border border-[#c7c4d8] rounded-2xl shadow-sm opacity-80">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-[#94A3B8]">workspace_premium</span>
                    <span className="text-sm font-bold">Berkembang Lanjut</span>
                  </div>
                </div>
                <div className="p-4 bg-white border border-[#c7c4d8] rounded-2xl shadow-sm opacity-80">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-[#D97706]">military_tech</span>
                    <span className="text-sm font-bold">Bakat yang Muncul</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Rules Table */}
          <section className="glass-card rounded-3xl overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-[#c7c4d8] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-2xl font-bold">Aturan Mesin Inferensi</h3>
                <p className="text-sm text-[#464555]">Saat ini mengelola 33 aturan forward chaining aktif.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#777587]">search</span>
                  <input
                    className="pl-10 pr-4 py-2 border border-[#c7c4d8] rounded-full text-sm focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] outline-none bg-white/50"
                    placeholder="Cari aturan..."
                    type="text"
                  />
                </div>
                <button className="p-2 border border-[#c7c4d8] rounded-lg hover:bg-[#eceef0] transition-colors">
                  <span className="material-symbols-outlined">filter_list</span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#f2f4f6]">
                  <tr>
                    {['ID', 'Logika Aturan (Cuplikan)', 'Indikator Sasaran', 'Status', 'Aksi'].map((h) => (
                      <th key={h} className="px-8 py-4 text-xs font-bold text-[#464555] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c7c4d8]">
                  {rules.map((rule) => (
                    <tr
                      key={rule.id}
                      className="hover:bg-[#3525cd]/5 transition-colors group cursor-pointer"
                      onClick={() => openPanel(rule.id)}
                    >
                      <td className="px-8 py-4 font-mono text-xs text-[#3525cd]">{rule.id}</td>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-2 text-sm font-semibold flex-wrap">
                          <span className="text-[#464555] font-bold">IF</span>
                          {rule.logicParts.map((p, i) => (
                            <span key={p} className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-[#e6e8ea] rounded text-xs">{p}</span>
                              {i < rule.logicParts.length - 1 && <span className="text-[#464555] font-bold">AND</span>}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <span className="text-sm font-bold text-[#00687a]">{rule.target}</span>
                      </td>
                      <td className="px-8 py-4">
                        <span className={`flex items-center gap-1.5 px-3 py-1 ${rule.statusColor} rounded-full text-xs font-bold w-fit`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {rule.status}
                        </span>
                      </td>
                      <td className="px-8 py-4" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="p-2 text-[#464555] hover:text-[#3525cd] transition-colors"
                          onClick={() => openPanel(rule.id)}
                        >
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-8 py-6 bg-white flex justify-between items-center border-t border-[#c7c4d8]">
              <span className="text-sm text-[#464555]">Menampilkan 3 dari 33 aturan</span>
              <div className="flex items-center gap-2">
                <button className="p-2 border border-[#c7c4d8] rounded hover:bg-[#eceef0] transition-all">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <span className="px-3 py-1 bg-[#3525cd] text-white rounded text-sm font-bold">1</span>
                {[2, 3].map((p) => (
                  <button key={p} className="px-3 py-1 hover:bg-[#eceef0] rounded text-sm">{p}</button>
                ))}
                <button className="p-2 border border-[#c7c4d8] rounded hover:bg-[#eceef0] transition-all">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Edit Rule Side Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-[480px] bg-white shadow-[-10px_0_40px_rgba(0,0,0,0.1)] z-[100] flex flex-col transition-transform duration-300 ${panelOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-8 border-b border-[#c7c4d8] flex justify-between items-center bg-[#f2f4f6]">
          <div>
            <span className="text-[#3525cd] font-mono text-xs font-bold">Mengedit Aturan</span>
            <h3 className="text-2xl font-bold">{selectedRule}</h3>
          </div>
          <button
            onClick={() => setPanelOpen(false)}
            className="w-10 h-10 rounded-full hover:bg-[#eceef0] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <section className="space-y-4">
            <h4 className="text-xs font-bold text-[#464555] uppercase tracking-widest">Struktur Logika</h4>
            <div className="p-6 bg-[#f2f4f6] rounded-2xl border border-[#c7c4d8] space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 px-3 py-1 bg-[#3525cd] text-white rounded text-xs font-bold">IF</div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <select className="bg-white border border-[#c7c4d8] rounded-lg text-sm flex-1 p-2 outline-none focus:border-[#3525cd]">
                      <option>Logical_Reasoning_Score</option>
                      <option>Pattern_Recognition_Score</option>
                      <option>Verbal_Fluency_Score</option>
                    </select>
                    <select className="bg-white border border-[#c7c4d8] rounded-lg text-sm w-20 p-2 outline-none focus:border-[#3525cd]">
                      <option>&gt;</option>
                      <option>&lt;</option>
                      <option>==</option>
                      <option>&gt;=</option>
                    </select>
                    <input className="bg-white border border-[#c7c4d8] rounded-lg text-sm w-20 p-2 outline-none focus:border-[#3525cd]" type="number" defaultValue={85} />
                  </div>
                  <button className="text-[#3525cd] text-xs flex items-center gap-1 font-bold">
                    <span className="material-symbols-outlined text-base">add</span>
                    Tambah kondisi
                  </button>
                </div>
              </div>
              <div className="flex items-start gap-4 pt-4 border-t border-[#c7c4d8]">
                <div className="mt-1 px-3 py-1 bg-[#00687a] text-white rounded text-xs font-bold">THEN</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#464555]">Tetapkan Indikator:</span>
                    <select className="bg-white border border-[#c7c4d8] rounded-lg text-sm flex-1 p-2 font-bold text-[#00687a] outline-none focus:border-[#3525cd]">
                      <option>Kedalaman Analisis</option>
                      <option>Sintesis Kreatif</option>
                      <option>Kecepatan Abstrak</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="space-y-4">
            <h4 className="text-xs font-bold text-[#464555] uppercase tracking-widest">Status & Metadata</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-[#777587]">Status</label>
                <select className="w-full bg-white border border-[#c7c4d8] rounded-lg text-sm p-2 outline-none focus:border-[#3525cd]">
                  <option>Tervalidasi</option>
                  <option>Draf</option>
                  <option>Usang</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#777587]">Bobot Kompleksitas</label>
                <input className="w-full bg-white border border-[#c7c4d8] rounded-lg text-sm p-2 outline-none focus:border-[#3525cd]" step="0.1" type="number" defaultValue={1.5} />
              </div>
            </div>
          </section>
        </div>
        <div className="p-8 border-t border-[#c7c4d8] bg-[#f2f4f6] flex gap-3">
          <button className="flex-1 bg-[#3525cd] text-white py-3 rounded-xl font-bold text-sm shadow-lg hover:brightness-110 transition-all">
            Simpan Perubahan Aturan
          </button>
          <button onClick={() => setPanelOpen(false)} className="px-6 border border-[#c7c4d8] py-3 rounded-xl font-bold text-sm hover:bg-[#eceef0] transition-all">
            Batalkan
          </button>
        </div>
      </div>

      {/* Simulation Modal */}
      {simOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#191c1e]/40 backdrop-blur-sm" onClick={() => setSimOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-[#c7c4d8] flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">Simulasi Inferensi</h3>
                <p className="text-sm text-[#464555]">Uji mesin forward chaining dengan data sampel.</p>
              </div>
              <button onClick={() => setSimOpen(false)} className="w-10 h-10 rounded-full hover:bg-[#eceef0] flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold">Masukan Skor Logis</label>
                  <input className="w-full accent-[#3525cd]" max={100} min={0} type="range" value={logicalScore} onChange={(e) => setLogicalScore(+e.target.value)} />
                  <div className="flex justify-between text-xs text-[#777587]">
                    <span>0</span><span className="font-bold text-[#3525cd]">{logicalScore}</span><span>100</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold">Masukan Skor Pola</label>
                  <input className="w-full accent-[#3525cd]" max={100} min={0} type="range" value={patternScore} onChange={(e) => setPatternScore(+e.target.value)} />
                  <div className="flex justify-between text-xs text-[#777587]">
                    <span>0</span><span className="font-bold text-[#3525cd]">{patternScore}</span><span>100</span>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-[#e6e8ea] rounded-2xl border-2 border-[#3525cd]/20">
                <h4 className="text-xs font-bold text-[#3525cd] uppercase mb-4 tracking-widest">Keluaran Inferensi yang Diharapkan</h4>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center border border-[#3525cd]/20">
                    <span className="material-symbols-outlined text-[#3525cd]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                  </div>
                  <div>
                    <p className="font-bold text-lg">
                      {logicalScore > 85 && patternScore > 90 ? 'Kedalaman Analisis Terpicu' : 'Tidak Ada Aturan yang Cocok'}
                    </p>
                    <p className="text-xs text-[#464555]">
                      {logicalScore > 85 && patternScore > 90 ? 'Aturan R-102 cocok dengan sukses.' : 'Sesuaikan skor untuk memenuhi kondisi aturan.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8 bg-[#f2f4f6] flex justify-end gap-3">
              <button className="bg-[#3525cd] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg">Jalankan Simulasi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
