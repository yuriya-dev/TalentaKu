import { useEffect, useState } from 'react'
import AdminSidebar from '../components/layout/AdminSidebar'

interface Variable {
  code: string
  label: string
  category: string
  age_group: string
}

interface Indicator {
  code: string
  label: string
  age_group: string
}

interface Criterion {
  code: string
  label: string
  description: string
  suggestions: string
  age_group: string
}

interface IndicatorVariable {
  indicator_code: string
  variable_code: string
}

interface CriterionIndicator {
  criterion_code: string
  indicator_code: string
}

interface RuleItem {
  id: string
  type: 'L1' | 'L2'
  logicParts: string[]
  target: string
  targetCode: string
  sourceCodes: string[]
  status: string
  statusColor: string
}

export default function AdminRulesPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Knowledge Base State
  const [variables, setVariables] = useState<Variable[]>([])
  const [indicators, setIndicators] = useState<Indicator[]>([])
  const [criteria, setCriteria] = useState<Criterion[]>([])

  // Rules list
  const [rules, setRules] = useState<RuleItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'ALL' | 'L1' | 'L2'>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  // Edit panel
  const [panelOpen, setPanelOpen] = useState(false)
  const [selectedRule, setSelectedRule] = useState<RuleItem | null>(null)
  const [editSourceCodes, setEditSourceCodes] = useState<string[]>([])
  const [successToast, setSuccessToast] = useState<string | null>(null)

  // Create Criterion Modal States
  const [isCritModalOpen, setIsCritModalOpen] = useState(false)
  const [newCritCode, setNewCritCode] = useState('')
  const [newCritLabel, setNewCritLabel] = useState('')
  const [newCritDescription, setNewCritDescription] = useState('')
  const [newCritSuggestions, setNewCritSuggestions] = useState('')
  const [newCritAgeGroup, setNewCritAgeGroup] = useState('preschool')
  const [critSubmitLoading, setCritSubmitLoading] = useState(false)

  // Create Variable Modal States (in Rules Page)
  const [isVarModalOpen, setIsVarModalOpen] = useState(false)
  const [newVarCode, setNewVarCode] = useState('')
  const [newVarLabel, setNewVarLabel] = useState('')
  const [newVarCategory, setNewVarCategory] = useState('General Intellectual')
  const [newVarAgeGroup, setNewVarAgeGroup] = useState('preschool')
  const [varSubmitLoading, setVarSubmitLoading] = useState(false)

  // Create Indicator Modal States (in Rules Page)
  const [isIndModalOpen, setIsIndModalOpen] = useState(false)
  const [newIndCode, setNewIndCode] = useState('')
  const [newIndLabel, setNewIndLabel] = useState('')
  const [newIndAgeGroup, setNewIndAgeGroup] = useState('preschool')
  const [indSubmitLoading, setIndSubmitLoading] = useState(false)

  // Create Rule Modal States
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false)
  const [newRuleType, setNewRuleType] = useState<'L1' | 'L2'>('L1')
  const [newRuleTargetCode, setNewRuleTargetCode] = useState('')
  const [newRuleSourceCodes, setNewRuleSourceCodes] = useState<string[]>([])
  const [ruleSubmitLoading, setRuleSubmitLoading] = useState(false)

  const handleCreateVariable = async (e: React.FormEvent) => {
    e.preventDefault()
    setVarSubmitLoading(true)
    const token = localStorage.getItem('admin_token')
    try {
      const res = await fetch('http://localhost:8080/api/admin/variables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code: newVarCode.trim(),
          label: newVarLabel.trim(),
          category: newVarCategory,
          age_group: newVarAgeGroup
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Gagal menambahkan variabel.')
      }

      const created = await res.json()
      setVariables([created, ...variables])
      setIsVarModalOpen(false)
      setNewVarCode('')
      setNewVarLabel('')
      
      setSuccessToast('Variabel masukan baru berhasil ditambahkan!')
      setTimeout(() => setSuccessToast(null), 4000)
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan.')
    } finally {
      setVarSubmitLoading(false)
    }
  }

  const handleCreateIndicator = async (e: React.FormEvent) => {
    e.preventDefault()
    setIndSubmitLoading(true)
    const token = localStorage.getItem('admin_token')
    try {
      const res = await fetch('http://localhost:8080/api/admin/indicators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code: newIndCode.trim(),
          label: newIndLabel.trim(),
          age_group: newIndAgeGroup
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Gagal menambahkan indikator.')
      }

      const created = await res.json()
      setIndicators([created, ...indicators])
      
      // Also append a new L1 rule locally with empty source codes for now
      const newRule: RuleItem = {
        id: `RULE-${created.code}`,
        type: 'L1',
        logicParts: [],
        target: created.label,
        targetCode: created.code,
        sourceCodes: [],
        status: 'Draft (Belum Konfigurasi)',
        statusColor: 'bg-amber-100 text-amber-800'
      }
      setRules((prevRules) => [newRule, ...prevRules])

      setIsIndModalOpen(false)
      setNewIndCode('')
      setNewIndLabel('')
      
      setSuccessToast('Indikator bakat baru berhasil ditambahkan!')
      setTimeout(() => setSuccessToast(null), 4000)
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan.')
    } finally {
      setIndSubmitLoading(false)
    }
  }

  const handleCreateCriterion = async (e: React.FormEvent) => {
    e.preventDefault()
    setCritSubmitLoading(true)
    const token = localStorage.getItem('admin_token')
    try {
      const res = await fetch('http://localhost:8080/api/admin/criteria', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code: newCritCode.trim(),
          label: newCritLabel.trim(),
          description: newCritDescription.trim(),
          suggestions: newCritSuggestions.trim(),
          age_group: newCritAgeGroup
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Gagal menambahkan kriteria evaluasi.')
      }

      const created = await res.json()
      setCriteria([...criteria, created])
      
      // Also append a new L2 rule locally for the new criterion with empty source codes for now
      const newRule: RuleItem = {
        id: `RULE-${created.code}`,
        type: 'L2',
        logicParts: [],
        target: created.label,
        targetCode: created.code,
        sourceCodes: [],
        status: 'Draft (Belum Konfigurasi)',
        statusColor: 'bg-amber-100 text-amber-800'
      }
      setRules((prevRules) => [newRule, ...prevRules])

      setIsCritModalOpen(false)
      setNewCritCode('')
      setNewCritLabel('')
      setNewCritDescription('')
      setNewCritSuggestions('')
      
      setSuccessToast('Kriteria evaluasi baru berhasil ditambahkan!')
      setTimeout(() => setSuccessToast(null), 4000)
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan.')
    } finally {
      setCritSubmitLoading(false)
    }
  }

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRuleTargetCode) {
      alert('Pilih target hasil (THEN) terlebih dahulu.')
      return
    }
    if (newRuleSourceCodes.length === 0) {
      alert('Pilih setidaknya satu kondisi input (IF) untuk aturan ini.')
      return
    }

    setRuleSubmitLoading(true)
    const token = localStorage.getItem('admin_token')
    try {
      const res = await fetch('http://localhost:8080/api/admin/rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: newRuleType,
          target_code: newRuleTargetCode,
          source_codes: newRuleSourceCodes
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Gagal menyimpan aturan baru.')
      }

      // Update state locally
      const targetLabel = newRuleType === 'L1'
        ? indicators.find((ind) => ind.code === newRuleTargetCode)?.label || newRuleTargetCode
        : criteria.find((crit) => crit.code === newRuleTargetCode)?.label || newRuleTargetCode

      const ruleId = `RULE-${newRuleTargetCode}`
      const exists = rules.some((r) => r.id === ruleId && r.type === newRuleType)
      const parts = newRuleSourceCodes.map((c) =>
        newRuleType === 'L1' ? `${c} >= Threshold` : `${c} == TRUE`
      )

      if (exists) {
        setRules((prev) =>
          prev.map((r) => {
            if (r.id === ruleId && r.type === newRuleType) {
              return {
                ...r,
                sourceCodes: newRuleSourceCodes,
                logicParts: parts,
                status: newRuleSourceCodes.length > 0 ? 'Tervalidasi' : 'Draft (Belum Konfigurasi)',
                statusColor: newRuleSourceCodes.length > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }
            }
            return r
          })
        )
      } else {
        const newRuleItem: RuleItem = {
          id: ruleId,
          type: newRuleType,
          logicParts: parts,
          target: targetLabel,
          targetCode: newRuleTargetCode,
          sourceCodes: newRuleSourceCodes,
          status: newRuleSourceCodes.length > 0 ? 'Tervalidasi' : 'Draft (Belum Konfigurasi)',
          statusColor: newRuleSourceCodes.length > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
        }
        setRules((prev) => [newRuleItem, ...prev])
      }

      setIsRuleModalOpen(false)
      setNewRuleTargetCode('')
      setNewRuleSourceCodes([])

      setSuccessToast('Aturan inferensi baru berhasil dikonfigurasi dan disimpan!')
      setTimeout(() => setSuccessToast(null), 4000)
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan.')
    } finally {
      setRuleSubmitLoading(false)
    }
  }

  // Simulation
  const [simOpen, setSimOpen] = useState(false)
  const [simThreshold, setSimThreshold] = useState(4)
  const [simAnswers, setSimAnswers] = useState<Record<string, number>>({}) // variable_code -> score
  const [simLoading, setSimLoading] = useState(false)
  const [simResults, setSimResults] = useState<any[]>([])
  const [simSearch, setSimSearch] = useState('')
  const [selectedTraceCode, setSelectedTraceCode] = useState<string | null>(null)

  // Fetch Knowledge Base Rules
  useEffect(() => {
    document.title = 'Pembuat Aturan | TalentaKu Admin'

    const token = localStorage.getItem('admin_token')

    async function fetchRules() {
      try {
        const res = await fetch('http://localhost:8080/api/admin/rules', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!res.ok) {
          throw new Error('Gagal memuat aturan dari server.')
        }

        const data = await res.json()

        setVariables(data.variables || [])
        setIndicators(data.indicators || [])
        setCriteria(data.criteria || [])

        // Build dynamic rules list
        const builtRules: RuleItem[] = []

        // Level 1 rules: Variables -> Indicators
        const indicatorsList: Indicator[] = data.indicators || []
        const indVarsList: IndicatorVariable[] = data.indicator_variables || []
        indicatorsList.forEach((ind) => {
          const sources = indVarsList
            .filter((iv) => iv.indicator_code === ind.code)
            .map((iv) => iv.variable_code)

          builtRules.push({
            id: `RULE-${ind.code}`,
            type: 'L1',
            logicParts: sources.map((src) => `${src} >= Threshold`),
            target: ind.label,
            targetCode: ind.code,
            sourceCodes: sources,
            status: 'Tervalidasi',
            statusColor: 'bg-emerald-100 text-emerald-800'
          })
        })

        // Level 2 rules: Indicators -> Criteria
        const criteriaList: Criterion[] = data.criteria || []
        const critIndsList: CriterionIndicator[] = data.criteria_indicators || []
        criteriaList.forEach((crit) => {
          const sources = critIndsList
            .filter((ci) => ci.criterion_code === crit.code)
            .map((ci) => ci.indicator_code)

          builtRules.push({
            id: `RULE-${crit.code}`,
            type: 'L2',
            logicParts: sources.map((src) => `${src} == TRUE`),
            target: crit.label,
            targetCode: crit.code,
            sourceCodes: sources,
            status: 'Tervalidasi',
            statusColor: 'bg-emerald-100 text-emerald-800'
          })
        })

        setRules(builtRules)

        // Initialize simulation answers to 3 (Neutral/default)
        const initialAnswers: Record<string, number> = {}
        const varsList: Variable[] = data.variables || []
        varsList.forEach((v) => {
          initialAnswers[v.code] = 3
        })
        setSimAnswers(initialAnswers)

      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan sistem saat memuat aturan.')
      } finally {
        setLoading(false)
      }
    }

    fetchRules()
  }, [])

  function openPanel(rule: RuleItem) {
    setSelectedRule(rule)
    setEditSourceCodes([...rule.sourceCodes])
    setPanelOpen(true)
  }

  function handleAddSourceCode(code: string) {
    if (code && !editSourceCodes.includes(code)) {
      setEditSourceCodes([...editSourceCodes, code])
    }
  }

  function handleRemoveSourceCode(code: string) {
    setEditSourceCodes(editSourceCodes.filter((c) => c !== code))
  }

  async function handleSaveRule() {
    if (!selectedRule) return
    const token = localStorage.getItem('admin_token')

    try {
      const res = await fetch('http://localhost:8080/api/admin/rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: selectedRule.type,
          target_code: selectedRule.targetCode,
          source_codes: editSourceCodes
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Gagal menyimpan aturan.')
      }

      // Update locally
      const updatedRules = rules.map((r) => {
        if (r.id === selectedRule.id) {
          const parts = editSourceCodes.map((c) =>
            selectedRule.type === 'L1' ? `${c} >= Threshold` : `${c} == TRUE`
          )
          return {
            ...r,
            sourceCodes: editSourceCodes,
            logicParts: parts,
            status: editSourceCodes.length > 0 ? 'Tervalidasi' : 'Draft (Belum Konfigurasi)',
            statusColor: editSourceCodes.length > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }
        }
        return r
      })

      setRules(updatedRules)
      setPanelOpen(false)

      // Trigger success notification
      setSuccessToast(`Aturan ${selectedRule.id} berhasil disimpan ke database.`)
      setTimeout(() => setSuccessToast(null), 4000)
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan saat menyimpan aturan.')
    }
  }

  async function handleRunSimulation() {
    setSimLoading(true)
    const token = localStorage.getItem('admin_token')
    try {
      const answersArray = Object.entries(simAnswers).map(([code, score]) => ({
        variable_code: code,
        score
      }))

      const res = await fetch('http://localhost:8080/api/admin/rules/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          answers: answersArray,
          threshold: simThreshold
        })
      })

      if (!res.ok) {
        throw new Error('Gagal memproses simulasi di server.')
      }

      const data = await res.json()
      setSimResults(data.results || [])
      setSelectedTraceCode(null)
    } catch (err: any) {
      alert(err.message || 'Gagal menjalankan simulasi.')
    } finally {
      setSimLoading(false)
    }
  }

  // Filter and Paginate rules
  const filteredRules = rules.filter((rule) => {
    const matchesSearch =
      rule.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.sourceCodes.some((code) => code.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesType =
      filterType === 'ALL' ||
      (filterType === 'L1' && rule.type === 'L1') ||
      (filterType === 'L2' && rule.type === 'L2')

    return matchesSearch && matchesType
  })

  const totalPages = Math.max(Math.ceil(filteredRules.length / pageSize), 1)
  const paginatedRules = filteredRules.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  // Simulation filtering variables
  const filteredSimVariables = variables.filter((v) =>
    v.code.toLowerCase().includes(simSearch.toLowerCase()) ||
    v.label.toLowerCase().includes(simSearch.toLowerCase()) ||
    v.category.toLowerCase().includes(simSearch.toLowerCase())
  )

  return (
    <div className="flex h-screen overflow-hidden font-sans text-[#191c1e] bg-[#f8fafc]">
      <AdminSidebar />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top App Bar */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center w-full px-4 md:px-10 py-4 shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-[#3525cd]">Pembuat Aturan</h2>
            <div className="hidden md:flex gap-6 ml-8">
              <span className="text-sm font-bold text-[#3525cd] border-b-2 border-[#3525cd] py-1 cursor-default">Forward Chaining</span>
              <span className="text-sm font-semibold text-[#464555] py-1 cursor-default">Status: {rules.length} Aturan Aktif</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setIsRuleModalOpen(true)
                setNewRuleType('L1')
                setNewRuleTargetCode('')
                setNewRuleSourceCodes([])
              }}
              className="flex items-center gap-2 bg-[#3525cd] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:brightness-110 shadow-md active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-base">add_box</span>
              Tambah Aturan
            </button>
            <button
              onClick={() => setIsCritModalOpen(true)}
              className="flex items-center gap-2 bg-white border border-[#c7c4d8] text-[#464555] hover:bg-[#eceef0] px-4 py-2 rounded-xl text-sm font-semibold shadow-sm active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-base">add</span>
              Tambah Kriteria
            </button>
            <button
              onClick={() => {
                setSimOpen(true)
                setSimResults([])
              }}
              className="flex items-center gap-2 bg-[#00687a] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:brightness-110 shadow-md active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-base">play_circle</span>
              Jalankan Simulasi
            </button>
          </div>
        </header>

        {/* Success Toast */}
        {successToast && (
          <div className="absolute top-20 right-10 z-[110] bg-emerald-600 text-white px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-2 text-sm animate-bounce">
            <span className="material-symbols-outlined">check_circle</span>
            <span>{successToast}</span>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex-grow flex flex-col p-4 md:p-10 space-y-6">
            <phantom-ui loading="true" className="block">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white border border-[#c7c4d8]/40 rounded-3xl p-6 shadow-sm space-y-3 min-h-[120px]">
                    <div className="h-4 w-12 bg-slate-100 rounded"></div>
                    <div className="h-6 w-32 bg-slate-100 rounded"></div>
                  </div>
                ))}
              </div>
              <div className="bg-white border border-[#c7c4d8]/40 rounded-[2rem] p-8 shadow-sm space-y-6 mt-6">
                <div className="h-6 w-48 bg-slate-100 rounded"></div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex justify-between items-center py-3 border-b border-[#c7c4d8]/10 last:border-none">
                      <div className="h-5 w-72 bg-slate-100 rounded"></div>
                      <div className="h-6 w-24 bg-slate-100 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </phantom-ui>
          </div>
        ) : error ? (
          <div className="flex-grow p-10 flex items-center justify-center">
            <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-6 text-red-800 text-sm flex gap-3 max-w-xl shadow-sm">
              <span className="material-symbols-outlined text-red-600 shrink-0">error</span>
              <div>
                <h5 className="font-bold mb-1">Gagal Memuat Aturan</h5>
                <p className="opacity-95">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6">
            {/* Rule Hierarchy Visualizer Summary */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* L1: Variables Input */}
              <div className="bg-white border border-[#c7c4d8]/40 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-[#464555] flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">data_object</span>
                      L1: VARIABEL MASUKAN
                    </h3>
                    <span className="bg-[#3525cd]/10 text-[#3525cd] px-2 py-0.5 rounded text-[10px] font-bold">TOTAL {variables.length}</span>
                  </div>
                  <p className="text-xs text-[#464555] mb-4">Pernyataan observasi perilaku anak berbasis skala Likert 1-5.</p>
                  <div className="space-y-2">
                    {variables.slice(0, 3).map((v) => (
                      <div key={v.code} className="p-3 bg-[#f8fafc] border border-[#c7c4d8]/30 rounded-xl flex justify-between items-center text-xs">
                        <span className="font-semibold text-[#3525cd] shrink-0 w-8">{v.code}</span>
                        <span className="text-[#191c1e] truncate flex-1 pr-2">{v.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex gap-2 justify-between items-center">
                  <p className="text-[10px] text-[#777587] font-semibold">Tersedia {variables.length - 3} variabel lainnya</p>
                  <button
                    onClick={() => setIsVarModalOpen(true)}
                    className="text-[10px] bg-[#3525cd] hover:bg-[#2515bd] text-white px-3 py-1.5 rounded-xl font-bold shadow-sm transition-all active:scale-95 flex items-center gap-1 animate-pulse"
                  >
                    <span className="material-symbols-outlined text-[12px]">add</span>
                    Tambah Baru
                  </button>
                </div>
              </div>

              {/* L2: Indicators Bakat */}
              <div className="bg-[#3525cd]/5 border border-[#3525cd]/15 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-[#3525cd] flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">hub</span>
                      L2: INDIKATOR BAKAT
                    </h3>
                    <span className="bg-[#3525cd] text-white px-2 py-0.5 rounded text-[10px] font-bold">{indicators.length} AKTIF</span>
                  </div>
                  <p className="text-xs text-[#464555] mb-4">Hasil kualitatif antara yang terpicu saat skor variabel memenuhi ambang batas.</p>
                  <div className="space-y-2">
                    {indicators.slice(0, 3).map((ind) => (
                      <div key={ind.code} className="p-3 bg-white border border-[#3525cd]/10 rounded-xl flex justify-between items-center text-xs">
                        <span className="font-semibold text-[#00687a] shrink-0 w-8">{ind.code}</span>
                        <span className="text-[#191c1e] truncate flex-1 pr-2">{ind.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex gap-2 justify-between items-center">
                  <p className="text-[10px] text-[#3525cd] font-semibold">Tersedia {indicators.length - 3} indikator lainnya</p>
                  <button
                    onClick={() => setIsIndModalOpen(true)}
                    className="text-[10px] bg-[#3525cd] hover:bg-[#2515bd] text-white px-3 py-1.5 rounded-xl font-bold shadow-sm transition-all active:scale-95 flex items-center gap-1 animate-pulse"
                  >
                    <span className="material-symbols-outlined text-[12px]">add</span>
                    Tambah Baru
                  </button>
                </div>
              </div>

              {/* L3: Criteria Evaluasi */}
              <div className="bg-[#00687a]/5 border border-[#00687a]/15 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-[#00687a] flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">verified</span>
                      L3: KRITERIA EVALUASI
                    </h3>
                    <span className="bg-[#00687a] text-white px-2 py-0.5 rounded text-[10px] font-bold">{criteria.length} KELUARAN</span>
                  </div>
                  <p className="text-xs text-[#464555] mb-4">Klasifikasi potensi bakat anak akhir (K1-K6) berdasarkan aturan inferensi.</p>
                  <div className="space-y-2">
                    {criteria.slice(0, 3).map((crit) => (
                      <div key={crit.code} className="p-3 bg-white border border-[#00687a]/15 rounded-xl flex justify-between items-center text-xs">
                        <span className="font-semibold text-[#ba1a1a] shrink-0 w-8">{crit.code}</span>
                        <span className="text-[#191c1e] truncate flex-1 pr-2">{crit.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex gap-2 justify-between items-center">
                  <p className="text-[10px] text-[#00687a] font-semibold">Tersedia {criteria.length - 3} kriteria lainnya</p>
                  <button
                    onClick={() => setIsCritModalOpen(true)}
                    className="text-[10px] bg-[#00687a] hover:bg-[#005260] text-white px-3 py-1.5 rounded-xl font-bold shadow-sm transition-all active:scale-95 flex items-center gap-1 animate-pulse"
                  >
                    <span className="material-symbols-outlined text-[12px]">add</span>
                    Tambah Baru
                  </button>
                </div>
              </div>
            </section>

            {/* Rules Table */}
            <section className="bg-white border border-[#c7c4d8]/40 rounded-[2rem] overflow-hidden shadow-sm">
              <div className="px-8 py-6 border-b border-[#c7c4d8]/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-2xl font-bold">Aturan Mesin Inferensi</h3>
                  <p className="text-sm text-[#464555]">Mengelola kombinasi aturan logika Forward Chaining sistem pakar.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setIsRuleModalOpen(true)
                      setNewRuleType('L1')
                      setNewRuleTargetCode('')
                      setNewRuleSourceCodes([])
                    }}
                    className="flex items-center gap-2 bg-[#3525cd] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:brightness-110 shadow-md active:scale-95 transition-all shrink-0"
                  >
                    <span className="material-symbols-outlined text-sm">add_box</span>
                    Tambah Aturan
                  </button>
                  {/* Filter Type Tabs */}
                  <div className="bg-[#f2f4f6] rounded-xl p-1 flex">
                    <button
                      onClick={() => { setFilterType('ALL'); setCurrentPage(1); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterType === 'ALL' ? 'bg-white text-[#3525cd] shadow-sm' : 'text-[#464555] hover:text-[#3525cd]'}`}
                    >
                      Semua
                    </button>
                    <button
                      onClick={() => { setFilterType('L1'); setCurrentPage(1); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterType === 'L1' ? 'bg-white text-[#3525cd] shadow-sm' : 'text-[#464555] hover:text-[#3525cd]'}`}
                    >
                      L1: Var ➔ Ind
                    </button>
                    <button
                      onClick={() => { setFilterType('L2'); setCurrentPage(1); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterType === 'L2' ? 'bg-white text-[#3525cd] shadow-sm' : 'text-[#464555] hover:text-[#3525cd]'}`}
                    >
                      L2: Ind ➔ Kriteria
                    </button>
                  </div>

                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#777587] text-lg">search</span>
                    <input
                      className="pl-9 pr-4 py-2 border border-[#c7c4d8] rounded-full text-xs focus:ring-2 focus:ring-[#3525cd]/25 focus:border-[#3525cd] outline-none bg-white w-48"
                      placeholder="Cari aturan..."
                      type="text"
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#f8fafc] text-xs font-bold text-[#464555] uppercase tracking-wider">
                    <tr>
                      <th className="px-8 py-4">ID Aturan</th>
                      <th className="px-8 py-4">Level</th>
                      <th className="px-8 py-4">Logika Input (IF)</th>
                      <th className="px-8 py-4">Indikator / Kriteria Hasil (THEN)</th>
                      <th className="px-8 py-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c7c4d8]/20">
                    {paginatedRules.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-8 py-12 text-center text-sm text-[#464555]">
                          Tidak menemukan aturan yang cocok.
                        </td>
                      </tr>
                    ) : (
                      paginatedRules.map((rule) => (
                        <tr
                          key={rule.id}
                          className="hover:bg-[#3525cd]/5 transition-colors group cursor-pointer"
                          onClick={() => openPanel(rule)}
                        >
                          <td className="px-8 py-4 font-mono text-xs font-bold text-[#3525cd]">{rule.id}</td>
                          <td className="px-8 py-4 text-xs font-bold text-[#464555]">{rule.type}</td>
                          <td className="px-8 py-4">
                            <div className="flex items-center gap-1.5 text-xs font-semibold flex-wrap">
                              <span className="text-[#464555] font-bold">IF</span>
                              {rule.sourceCodes.map((code, idx) => (
                                <span key={code} className="flex items-center gap-1.5">
                                  <span className="px-2 py-0.5 bg-[#e2dfff]/45 text-[#3525cd] rounded font-mono text-[10px]">{code}</span>
                                  {idx < rule.sourceCodes.length - 1 && <span className="text-[#464555] font-bold">AND</span>}
                                </span>
                              ))}
                              {rule.type === 'L1' && (
                                <span className="text-[#777587] font-semibold text-[10px]">(&gt;= Ambang Batas)</span>
                              )}
                            </div>
                          </td>
                          <td className="px-8 py-4">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 bg-[#00687a]/10 text-[#00687a] rounded-full text-xs font-bold shrink-0">{rule.targetCode}</span>
                              <span className="text-sm font-semibold text-[#191c1e] truncate max-w-xs">{rule.target}</span>
                            </div>
                          </td>
                          <td className="px-8 py-4" onClick={(e) => e.stopPropagation()}>
                            <button
                              className="p-2 text-[#464555] hover:text-[#3525cd] transition-colors rounded-lg hover:bg-[#3525cd]/5"
                              onClick={() => openPanel(rule)}
                            >
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-8 py-6 bg-white flex justify-between items-center border-t border-[#c7c4d8]/20">
                <span className="text-xs text-[#464555]">
                  Menampilkan {paginatedRules.length} dari {filteredRules.length} aturan
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 border border-[#c7c4d8]/50 rounded-lg hover:bg-[#eceef0] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  <span className="px-3 py-1 bg-[#3525cd] text-white rounded-lg text-xs font-bold">{currentPage}</span>
                  {currentPage < totalPages && (
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="px-3 py-1 hover:bg-[#eceef0] rounded-lg text-xs"
                    >
                      {currentPage + 1}
                    </button>
                  )}
                  {currentPage + 1 < totalPages && (
                    <span className="text-xs text-[#777587] px-1">...</span>
                  )}
                  {currentPage < totalPages - 1 && (
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className="px-3 py-1 hover:bg-[#eceef0] rounded-lg text-xs"
                    >
                      {totalPages}
                    </button>
                  )}
                  <button
                    onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 border border-[#c7c4d8]/50 rounded-lg hover:bg-[#eceef0] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Edit Rule Side Panel */}
      {selectedRule && (
        <div
          className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-[-10px_0_40px_rgba(0,0,0,0.1)] z-[100] flex flex-col transition-transform duration-300 ${panelOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="p-6 border-b border-[#c7c4d8]/20 flex justify-between items-center bg-[#f8fafc]">
            <div>
              <span className="text-[#3525cd] font-mono text-[10px] font-bold uppercase tracking-wider">Sunting Aturan</span>
              <h3 className="text-xl font-bold text-[#191c1e]">{selectedRule.id}</h3>
            </div>
            <button
              onClick={() => setPanelOpen(false)}
              className="w-10 h-10 rounded-full hover:bg-[#eceef0] flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <section className="space-y-3">
              <h4 className="text-xs font-bold text-[#464555] uppercase tracking-wider">Logika Premis (IF)</h4>
              <div className="p-4 bg-[#f8fafc] rounded-2xl border border-[#c7c4d8]/30 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-[#3525cd]/10 text-[#3525cd] rounded text-xs font-bold">IF</span>
                  <span className="text-[10px] text-[#777587] font-semibold">Memenuhi Kondisi:</span>
                </div>
                <div className="space-y-2">
                  {editSourceCodes.map((code) => {
                    const label = selectedRule.type === 'L1'
                      ? variables.find((v) => v.code === code)?.label
                      : indicators.find((ind) => ind.code === code)?.label

                    return (
                      <div key={code} className="flex items-center justify-between gap-2 p-2 bg-white border border-[#c7c4d8]/20 rounded-xl">
                        <div className="flex-1 min-w-0 pr-2">
                          <span className="font-mono text-xs font-bold text-[#3525cd] block">{code}</span>
                          <span className="text-[11px] text-[#464555] truncate block mt-0.5">{label || 'Label tidak ditemukan'}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveSourceCode(code)}
                          className="p-1 hover:bg-red-50 text-red-600 hover:text-red-700 rounded-lg transition-colors shrink-0"
                          title="Hapus kondisi"
                        >
                          <span className="material-symbols-outlined text-base">remove_circle</span>
                        </button>
                      </div>
                    )
                  })}
                </div>

                {/* Add condition selector */}
                <div className="pt-3 border-t border-[#c7c4d8]/20 space-y-2">
                  <label className="text-[10px] font-bold text-[#464555] uppercase tracking-wider block">Tambah Kondisi Baru</label>
                  <div className="flex gap-2">
                    <select
                      id="newConditionSelect"
                      className="bg-white border border-[#c7c4d8]/50 focus:border-[#3525cd] rounded-xl text-xs flex-1 p-2 outline-none"
                      onChange={(e) => {
                        handleAddSourceCode(e.target.value)
                        e.target.value = ''
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>-- Pilih {selectedRule.type === 'L1' ? 'Variabel' : 'Indikator'} --</option>
                      {selectedRule.type === 'L1'
                        ? variables
                            .filter((v) => !editSourceCodes.includes(v.code))
                            .map((v) => (
                              <option key={v.code} value={v.code}>{v.code} - {v.label.slice(0, 45)}...</option>
                            ))
                        : indicators
                            .filter((ind) => !editSourceCodes.includes(ind.code))
                            .map((ind) => (
                              <option key={ind.code} value={ind.code}>{ind.code} - {ind.label.slice(0, 45)}...</option>
                            ))
                      }
                    </select>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="text-xs font-bold text-[#464555] uppercase tracking-wider">Konsekuensi Hasil (THEN)</h4>
              <div className="p-4 bg-[#f8fafc] rounded-2xl border border-[#c7c4d8]/30 space-y-2">
                <span className="px-2 py-0.5 bg-[#00687a]/15 text-[#00687a] rounded text-xs font-bold inline-block mb-1">THEN</span>
                <p className="text-xs font-bold text-[#191c1e]">{selectedRule.targetCode} - {selectedRule.target}</p>
                <p className="text-[11px] text-[#464555]">
                  Jika semua kondisi di atas terpenuhi, sistem akan menandai status {selectedRule.type === 'L1' ? 'Indikator' : 'Bakat Kriteria'} sebagai <span className="font-bold text-emerald-600">TRUE</span>.
                </p>
              </div>
            </section>

            <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-xl text-amber-800 text-xs flex gap-2 shadow-sm">
              <span className="material-symbols-outlined text-amber-600 shrink-0">info</span>
              <p className="opacity-95">
                Penyuntingan aturan bersifat visual & lokal. Perubahan ini akan memengaruhi hasil aturan dalam simulasi berjalan.
              </p>
            </div>
          </div>

          <div className="p-6 border-t border-[#c7c4d8]/20 bg-[#f8fafc] flex gap-3">
            <button
              onClick={handleSaveRule}
              className="flex-1 bg-[#3525cd] hover:bg-[#4f46e5] text-white py-3 rounded-xl font-bold text-sm shadow-md hover:scale-[1.02] active:scale-95 transition-all"
            >
              Simpan Perubahan
            </button>
            <button
              onClick={() => setPanelOpen(false)}
              className="px-6 border border-[#c7c4d8] py-3 rounded-xl font-semibold text-sm hover:bg-[#eceef0] transition-all"
            >
              Batalkan
            </button>
          </div>
        </div>
      )}

      {/* Simulation Modal */}
      {simOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#191c1e]/40 backdrop-blur-sm" onClick={() => setSimOpen(false)} />
          <div className="relative bg-white w-full max-w-4xl rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-[#c7c4d8]/20 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Simulasi Inferensi Aturan</h3>
                <p className="text-xs text-[#464555]">Uji logika Forward Chaining menggunakan nilai masukan simulasi.</p>
              </div>
              <button
                onClick={() => setSimOpen(false)}
                className="w-10 h-10 rounded-full hover:bg-[#eceef0] flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
              {/* Left Column: Variable Inputs */}
              <div className="flex flex-col space-y-4 min-h-0">
                <div className="flex justify-between items-center gap-2">
                  <h4 className="text-xs font-bold text-[#464555] uppercase tracking-wider">Variabel Skor Masukan</h4>
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] text-[#464555] font-semibold">Ambang Batas:</label>
                    <select
                      className="bg-[#f2f4f6] border-none rounded-lg text-xs font-semibold px-2 py-1 outline-none"
                      value={simThreshold}
                      onChange={(e) => setSimThreshold(+e.target.value)}
                    >
                      {[3, 4, 5].map((t) => (
                        <option key={t} value={t}>&gt;= {t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Variable Search */}
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#777587] text-base">search</span>
                  <input
                    className="pl-9 pr-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs outline-none bg-white w-full"
                    placeholder="Cari kode atau teks variabel..."
                    type="text"
                    value={simSearch}
                    onChange={(e) => setSimSearch(e.target.value)}
                  />
                </div>

                {/* Slider list */}
                <div className="flex-1 overflow-y-auto border border-[#c7c4d8]/20 rounded-2xl bg-[#f8fafc] p-4 space-y-3 pr-2">
                  {filteredSimVariables.map((v) => {
                    const score = simAnswers[v.code] || 3
                    return (
                      <div key={v.code} className="p-3 bg-white border border-[#c7c4d8]/10 rounded-xl space-y-1.5 shadow-sm">
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="font-mono text-xs font-bold text-[#3525cd] shrink-0">{v.code}</span>
                          <span className="text-[10px] text-[#777587] font-semibold truncate flex-1 text-right">{v.category}</span>
                        </div>
                        <p className="text-[11px] text-[#464555] leading-relaxed">{v.label}</p>
                        <div className="flex items-center gap-3 pt-1">
                          <input
                            type="range"
                            min="1"
                            max="5"
                            className="w-full accent-[#3525cd]"
                            value={score}
                            onChange={(e) => {
                              setSimAnswers({
                                ...simAnswers,
                                [v.code]: +e.target.value
                              })
                            }}
                          />
                          <span className={`w-8 text-center text-xs font-bold px-2 py-0.5 rounded shadow-sm ${score >= simThreshold ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                            {score}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Right Column: Simulation Results */}
              <div className="flex flex-col space-y-4 min-h-0 bg-[#3525cd]/5 rounded-3xl p-6 border border-[#3525cd]/10">
                <h4 className="text-xs font-bold text-[#3525cd] uppercase tracking-wider">Hasil Inferensi Simulasi</h4>

                <div className="flex-1 flex flex-col justify-between min-h-0">
                  <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                    {simLoading ? (
                      <phantom-ui loading="true" className="w-full block py-2">
                        <div className="space-y-4">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white border border-[#c7c4d8]/20 rounded-2xl p-4 shadow-sm space-y-2">
                              <div className="flex justify-between items-center">
                                <div className="h-5 w-24 bg-slate-100 rounded"></div>
                                <div className="h-5 w-12 bg-slate-100 rounded"></div>
                              </div>
                              <div className="h-4 w-full bg-slate-100 rounded"></div>
                            </div>
                          ))}
                        </div>
                      </phantom-ui>
                    ) : simResults.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-8">
                        <span className="material-symbols-outlined text-4xl text-[#777587] mb-2">science</span>
                        <p className="text-xs text-[#464555]">
                          Sesuaikan variabel masukan di kolom kiri dan tekan tombol "Jalankan Simulasi" untuk menguji sistem inferensi.
                        </p>
                      </div>
                    ) : (
                      simResults.map((res) => {
                        const isExpanded = selectedTraceCode === res.criterion_code
                        return (
                          <div 
                            key={res.criterion_code} 
                            className={`bg-white border rounded-2xl p-4 shadow-sm space-y-2 transition-all ${
                              isExpanded ? 'border-[#3525cd]/40 ring-1 ring-[#3525cd]/10' : 'border-[#c7c4d8]/20'
                            }`}
                          >
                            {/* Card Header (Clickable to toggle) */}
                            <div 
                              className="flex justify-between items-start gap-2 cursor-pointer group"
                              onClick={() => {
                                setSelectedTraceCode(isExpanded ? null : res.criterion_code)
                              }}
                            >
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="px-2 py-0.5 bg-[#00687a]/10 text-[#00687a] rounded text-[10px] font-bold">{res.criterion_code}</span>
                                  <h5 className="font-bold text-sm text-[#191c1e] group-hover:text-[#3525cd] transition-colors">{res.criterion?.label || res.criterion_code}</h5>
                                </div>
                                <span className="text-[10px] text-[#777587] mt-0.5 block leading-tight">Peringkat #{res.ranking}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                    res.is_rule_satisfied
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {res.is_rule_satisfied ? 'Terpenuhi' : 'Kecenderungan'}
                                </span>
                                <span className={`material-symbols-outlined text-xs text-[#777587] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                                  keyboard_arrow_down
                                </span>
                              </div>
                            </div>

                            {/* Score & Console Button */}
                            <div className="flex items-center justify-between gap-3 pt-1">
                              <div className="flex-grow flex items-center gap-3">
                                <div className="flex-1 bg-[#eceef0] rounded-full h-1.5">
                                  <div
                                    className={`h-1.5 rounded-full ${res.is_rule_satisfied ? 'bg-emerald-500' : 'bg-[#3525cd]'}`}
                                    style={{ width: `${res.score_percentage}%` }}
                                  />
                                </div>
                                <span className={`text-xs font-bold shrink-0 ${res.is_rule_satisfied ? 'text-emerald-700' : 'text-[#3525cd]'}`}>
                                  {Math.round(res.score_percentage)}%
                                </span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedTraceCode(isExpanded ? null : res.criterion_code)
                                }}
                                className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold transition-all border ${
                                  isExpanded
                                    ? 'bg-slate-900 text-white border-slate-900'
                                    : 'text-[#464555] border-[#c7c4d8]/40 hover:bg-[#eceef0]'
                                }`}
                              >
                                <span className="material-symbols-outlined text-[12px]">terminal</span>
                                {isExpanded ? 'Tutup Log' : 'Konsol Pakar'}
                              </button>
                            </div>

                            {/* Log Panel */}
                            {isExpanded && (
                              <div className="mt-3 bg-slate-950 text-slate-100 font-mono text-[11px] rounded-xl p-4 shadow-inner border border-slate-800 relative overflow-hidden">
                                {/* Terminal Header */}
                                <div className="flex justify-between items-center border-b border-slate-800/80 pb-2 mb-3 text-[10px] text-slate-400">
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="ml-1 font-semibold font-mono select-none text-[9px]">forward_chaining_engine.log</span>
                                  </div>
                                  <div>
                                    <span>STATUS: {res.is_rule_satisfied ? 'RULE TRUE' : 'RULE FALSE'}</span>
                                  </div>
                                </div>

                                {/* Terminal Contents */}
                                <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
                                  <div className="text-slate-500 select-none">[SYSTEM] Menginisialisasi logika evaluasi Forward Chaining...</div>
                                  <div className="text-slate-500 select-none">[SYSTEM] Ambang batas verifikasi ditetapkan ke skor &gt;= {simThreshold}</div>

                                  {res.trace && res.trace.map((line: string, idx: number) => {
                                    const isCheck = line.startsWith('✓')
                                    const isCross = line.startsWith('✗')
                                    const isSatisfiedRule = line.includes('RULE TRUE')
                                    const isFailedRule = line.includes('RULE FALSE')

                                    let textColor = 'text-slate-300'
                                    if (isCheck) textColor = 'text-emerald-400 font-medium'
                                    if (isCross) textColor = 'text-rose-400'
                                    if (isSatisfiedRule) textColor = 'text-emerald-300 font-bold bg-emerald-950/40 py-0.5 px-1 rounded border border-emerald-900/50'
                                    if (isFailedRule) textColor = 'text-rose-400 font-bold bg-rose-950/40 py-0.5 px-1 rounded border border-rose-900/50'

                                    return (
                                      <div key={idx} className={`flex items-start gap-2 leading-relaxed ${textColor}`}>
                                        <span className="text-slate-650 select-none font-mono w-6 text-right shrink-0">
                                          {String(idx + 1).padStart(2, '0')}:
                                        </span>
                                        <span className="flex-1 whitespace-pre-wrap">{line}</span>
                                      </div>
                                    )
                                  })}

                                  <div className="text-slate-500 select-none">[SYSTEM] Siklus evaluasi selesai untuk {res.criterion_code}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })
                    )}
                  </div>

                  <button
                    onClick={handleRunSimulation}
                    disabled={simLoading}
                    className="w-full mt-4 py-3.5 bg-[#3525cd] hover:bg-[#4f46e5] disabled:bg-slate-400 text-white rounded-2xl font-bold text-sm shadow-lg hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0"
                  >
                    <span className="material-symbols-outlined text-base">science</span>
                    Jalankan Simulasi Inferensi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Criterion Modal */}
      {isCritModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4"
          onClick={() => setIsCritModalOpen(false)}
        >
          <div 
            className="bg-white rounded-[2rem] max-w-lg w-full p-8 shadow-2xl border border-[#c7c4d8]/40 animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-[#c7c4d8]/20 pb-4 mb-6">
              <h3 className="text-xl font-bold text-[#3525cd]">Tambah Kriteria Evaluasi</h3>
              <button onClick={() => setIsCritModalOpen(false)} className="text-[#464555] hover:text-[#3525cd]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateCriterion} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="text-xs font-bold text-[#464555] block mb-1">Kode Kriteria</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: K7, TK7, EK7, LK7"
                  value={newCritCode}
                  onChange={(e) => setNewCritCode(e.target.value)}
                  className="w-full px-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs outline-none bg-white shadow-sm font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#464555] block mb-1">Nama Kriteria Evaluasi</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kecerdasan Logika Lanjut"
                  value={newCritLabel}
                  onChange={(e) => setNewCritLabel(e.target.value)}
                  className="w-full px-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs outline-none bg-white shadow-sm font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#464555] block mb-1">Grup Usia</label>
                <select
                  value={newCritAgeGroup}
                  onChange={(e) => setNewCritAgeGroup(e.target.value)}
                  className="w-full px-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs outline-none bg-white shadow-sm font-semibold text-[#464555]"
                >
                  <option value="toddler">Batita (Toddler)</option>
                  <option value="preschool">Prasekolah / TK (Preschool)</option>
                  <option value="early_elementary">SD Awal (Early Elementary)</option>
                  <option value="late_elementary">SD Akhir (Late Elementary)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-[#464555] block mb-1">Deskripsi Kriteria</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Deskripsi penjelasan mengenai kriteria bakat/evaluasi ini..."
                  value={newCritDescription}
                  onChange={(e) => setNewCritDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs outline-none bg-white shadow-sm resize-none font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#464555] block mb-1">Saran Pengembangan / Aktivitas</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Saran tindakan nyata atau aktivitas pengembangan untuk anak..."
                  value={newCritSuggestions}
                  onChange={(e) => setNewCritSuggestions(e.target.value)}
                  className="w-full px-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs outline-none bg-white shadow-sm resize-none font-semibold"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#c7c4d8]/20">
                <button
                  type="button"
                  onClick={() => setIsCritModalOpen(false)}
                  className="px-4 py-2 border border-[#c7c4d8]/40 rounded-xl text-xs font-semibold text-[#464555] hover:bg-[#eceef0]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={critSubmitLoading}
                  className="px-4 py-2 bg-[#3525cd] text-white rounded-xl text-xs font-semibold hover:brightness-110 shadow-sm active:scale-95 transition-all disabled:opacity-50"
                >
                  {critSubmitLoading ? 'Menyimpan...' : 'Simpan Kriteria'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Variable Modal */}
      {isVarModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4"
          onClick={() => setIsVarModalOpen(false)}
        >
          <div 
            className="bg-white rounded-[2rem] max-w-lg w-full p-8 shadow-2xl border border-[#c7c4d8]/40 animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-[#c7c4d8]/20 pb-4 mb-6">
              <h3 className="text-xl font-bold text-[#3525cd]">Tambah Variabel Masukan</h3>
              <button onClick={() => setIsVarModalOpen(false)} className="text-[#464555] hover:text-[#3525cd]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateVariable} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#464555] block mb-1">Kode Variabel</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: C84, T13, E25"
                  value={newVarCode}
                  onChange={(e) => setNewVarCode(e.target.value)}
                  className="w-full px-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs outline-none bg-white shadow-sm font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#464555] block mb-1">Kategori</label>
                <select
                  value={newVarCategory}
                  onChange={(e) => setNewVarCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs outline-none bg-white shadow-sm font-semibold text-[#464555]"
                >
                  <option value="General Intellectual">Intelektual Umum (K1)</option>
                  <option value="Specific Academic">Akademik Khusus (K2)</option>
                  <option value="Creative Thinking">Berpikir Kreatif (K3)</option>
                  <option value="Leadership">Kepemimpinan (K4)</option>
                  <option value="Visual & Performing Arts">Seni Rupa & Visual (K5)</option>
                  <option value="Psychomotor">Psikomotorik (K6)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-[#464555] block mb-1">Grup Usia</label>
                <select
                  value={newVarAgeGroup}
                  onChange={(e) => setNewVarAgeGroup(e.target.value)}
                  className="w-full px-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs outline-none bg-white shadow-sm font-semibold text-[#464555]"
                >
                  <option value="toddler">Batita (Toddler)</option>
                  <option value="preschool">Prasekolah / TK (Preschool)</option>
                  <option value="early_elementary">SD Awal (Early Elementary)</option>
                  <option value="late_elementary">SD Akhir (Late Elementary)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-[#464555] block mb-1">Teks Pertanyaan Observasi</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Contoh: Apakah anak dapat melakukan sesuatu..."
                  value={newVarLabel}
                  onChange={(e) => setNewVarLabel(e.target.value)}
                  className="w-full px-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs outline-none bg-white shadow-sm resize-none font-semibold"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#c7c4d8]/20">
                <button
                  type="button"
                  onClick={() => setIsVarModalOpen(false)}
                  className="px-4 py-2 border border-[#c7c4d8]/40 rounded-xl text-xs font-semibold text-[#464555] hover:bg-[#eceef0]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={varSubmitLoading}
                  className="px-4 py-2 bg-[#3525cd] text-white rounded-xl text-xs font-semibold hover:brightness-110 shadow-sm active:scale-95 transition-all disabled:opacity-50"
                >
                  {varSubmitLoading ? 'Menyimpan...' : 'Simpan Variabel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Indicator Modal */}
      {isIndModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4"
          onClick={() => setIsIndModalOpen(false)}
        >
          <div 
            className="bg-white rounded-[2rem] max-w-lg w-full p-8 shadow-2xl border border-[#c7c4d8]/40 animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-[#c7c4d8]/20 pb-4 mb-6">
              <h3 className="text-xl font-bold text-[#3525cd]">Tambah Indikator Bakat</h3>
              <button onClick={() => setIsIndModalOpen(false)} className="text-[#464555] hover:text-[#3525cd]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateIndicator} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#464555] block mb-1">Kode Indikator</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: I28, TI7, EI13, LI13"
                  value={newIndCode}
                  onChange={(e) => setNewIndCode(e.target.value)}
                  className="w-full px-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs outline-none bg-white shadow-sm font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#464555] block mb-1">Nama Indikator Bakat</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kemampuan Verbal Lanjut"
                  value={newIndLabel}
                  onChange={(e) => setNewIndLabel(e.target.value)}
                  className="w-full px-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs outline-none bg-white shadow-sm font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#464555] block mb-1">Grup Usia</label>
                <select
                  value={newIndAgeGroup}
                  onChange={(e) => setNewIndAgeGroup(e.target.value)}
                  className="w-full px-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs outline-none bg-white shadow-sm font-semibold text-[#464555]"
                >
                  <option value="toddler">Batita (Toddler)</option>
                  <option value="preschool">Prasekolah / TK (Preschool)</option>
                  <option value="early_elementary">SD Awal (Early Elementary)</option>
                  <option value="late_elementary">SD Akhir (Late Elementary)</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#c7c4d8]/20">
                <button
                  type="button"
                  onClick={() => setIsIndModalOpen(false)}
                  className="px-4 py-2 border border-[#c7c4d8]/40 rounded-xl text-xs font-semibold text-[#464555] hover:bg-[#eceef0]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={indSubmitLoading}
                  className="px-4 py-2 bg-[#3525cd] text-white rounded-xl text-xs font-semibold hover:brightness-110 shadow-sm active:scale-95 transition-all disabled:opacity-50"
                >
                  {indSubmitLoading ? 'Menyimpan...' : 'Simpan Indikator'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Rule Modal */}
      {isRuleModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4"
          onClick={() => setIsRuleModalOpen(false)}
        >
          <div 
            className="bg-white rounded-[2rem] max-w-lg w-full p-8 shadow-2xl border border-[#c7c4d8]/40 animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-[#c7c4d8]/20 pb-4 mb-6">
              <h3 className="text-xl font-bold text-[#3525cd]">Tambah Aturan Baru</h3>
              <button onClick={() => setIsRuleModalOpen(false)} className="text-[#464555] hover:text-[#3525cd]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateRule} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="text-xs font-bold text-[#464555] block mb-1">Level Aturan</label>
                <select
                  value={newRuleType}
                  onChange={(e) => {
                    setNewRuleType(e.target.value as 'L1' | 'L2')
                    setNewRuleTargetCode('')
                    setNewRuleSourceCodes([])
                  }}
                  className="w-full px-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs outline-none bg-white shadow-sm font-semibold text-[#464555]"
                >
                  <option value="L1">L1: Variabel Masukan ➔ Indikator Bakat</option>
                  <option value="L2">L2: Indikator Bakat ➔ Kriteria Evaluasi</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-[#464555] block">Target Hasil (THEN)</label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRuleModalOpen(false)
                      if (newRuleType === 'L1') {
                        setIsIndModalOpen(true)
                      } else {
                        setIsCritModalOpen(true)
                      }
                    }}
                    className="text-[10px] text-[#3525cd] hover:underline font-bold"
                  >
                    + Buat {newRuleType === 'L1' ? 'Indikator' : 'Kriteria'} Baru
                  </button>
                </div>
                <select
                  required
                  value={newRuleTargetCode}
                  onChange={(e) => setNewRuleTargetCode(e.target.value)}
                  className="w-full px-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs outline-none bg-white shadow-sm font-semibold text-[#464555]"
                >
                  <option value="" disabled>-- Pilih Target Aturan --</option>
                  {newRuleType === 'L1'
                    ? indicators.map((ind) => {
                        const rule = rules.find((r) => r.id === `RULE-${ind.code}` && r.type === 'L1')
                        const isConfigured = rule ? rule.sourceCodes.length > 0 : false
                        return (
                          <option key={ind.code} value={ind.code}>
                            {ind.code} - {ind.label.slice(0, 50)} {isConfigured ? '(Sudah Ada)' : '(Belum Ada/Draft)'}
                          </option>
                        )
                      })
                    : criteria.map((crit) => {
                        const rule = rules.find((r) => r.id === `RULE-${crit.code}` && r.type === 'L2')
                        const isConfigured = rule ? rule.sourceCodes.length > 0 : false
                        return (
                          <option key={crit.code} value={crit.code}>
                            {crit.code} - {crit.label.slice(0, 50)} {isConfigured ? '(Sudah Ada)' : '(Belum Ada/Draft)'}
                          </option>
                        )
                      })
                  }
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#464555] block mb-1">
                  Kondisi Premis (IF) - Tambah {newRuleType === 'L1' ? 'Variabel' : 'Indikator'}
                </label>
                <select
                  className="w-full px-4 py-2 border border-[#c7c4d8]/40 focus:border-[#3525cd] rounded-xl text-xs outline-none bg-white shadow-sm font-semibold text-[#464555]"
                  onChange={(e) => {
                    const val = e.target.value
                    if (val && !newRuleSourceCodes.includes(val)) {
                      setNewRuleSourceCodes([...newRuleSourceCodes, val])
                    }
                    e.target.value = ''
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>-- Tambah Kondisi Input --</option>
                  {newRuleType === 'L1'
                    ? variables
                        .filter((v) => !newRuleSourceCodes.includes(v.code))
                        .map((v) => (
                          <option key={v.code} value={v.code}>
                            {v.code} - {v.label.slice(0, 50)}...
                          </option>
                        ))
                    : indicators
                        .filter((ind) => !newRuleSourceCodes.includes(ind.code))
                        .map((ind) => (
                          <option key={ind.code} value={ind.code}>
                            {ind.code} - {ind.label.slice(0, 50)}...
                          </option>
                        ))
                  }
                </select>

                {/* Selected source codes list */}
                {newRuleSourceCodes.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <label className="text-[10px] font-bold text-[#777587] uppercase tracking-wider block">Kondisi yang Dipilih:</label>
                    <div className="flex flex-wrap gap-1.5">
                      {newRuleSourceCodes.map((code) => (
                        <span key={code} className="inline-flex items-center gap-1.5 bg-[#e2dfff]/60 text-[#3525cd] px-2.5 py-1 rounded-xl text-xs font-semibold">
                          {code}
                          <button
                            type="button"
                            onClick={() => setNewRuleSourceCodes(newRuleSourceCodes.filter((c) => c !== code))}
                            className="text-red-500 hover:text-red-700 transition-colors flex items-center"
                          >
                            <span className="material-symbols-outlined text-xs">close</span>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-xl text-amber-800 text-[11px] flex gap-2 shadow-sm">
                <span className="material-symbols-outlined text-amber-600 shrink-0 text-sm">info</span>
                <p className="opacity-95 leading-relaxed">
                  Menyimpan aturan baru akan menggantikan konfigurasi lama untuk target tersebut jika sudah ada sebelumnya. Aturan ini akan langsung aktif di database.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#c7c4d8]/20">
                <button
                  type="button"
                  onClick={() => setIsRuleModalOpen(false)}
                  className="px-4 py-2 border border-[#c7c4d8]/40 rounded-xl text-xs font-semibold text-[#464555] hover:bg-[#eceef0]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={ruleSubmitLoading}
                  className="px-4 py-2 bg-[#3525cd] text-white rounded-xl text-xs font-semibold hover:brightness-110 shadow-sm active:scale-95 transition-all disabled:opacity-50"
                >
                  {ruleSubmitLoading ? 'Menyimpan...' : 'Simpan Aturan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
