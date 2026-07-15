import { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type Connection,
  Handle,
  Position,
  BackgroundVariant,
  MarkerType,
  useReactFlow,
  ReactFlowProvider,
  getNodesBounds,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import Dagre from '@dagrejs/dagre'
import { toPng, toSvg } from 'html-to-image'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Variable  { code: string; label: string; category: string; age_group: string }
interface Indicator { code: string; label: string; age_group: string }
interface Criterion { code: string; label: string; description: string; suggestions: string; age_group: string }

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

interface Props {
  criteria: Criterion[]
  indicators: Indicator[]
  variables: Variable[]
  rules: RuleItem[]
  onOpenEditPanel: (rule: RuleItem) => void
  onAddRule: (type: 'L1' | 'L2', targetCode: string, existingSources: string[]) => void
}

// ─── Dagre auto-layout ────────────────────────────────────────────────────────

function getLayoutedElements(nodes: Node[], edges: Edge[]) {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: 'LR', ranksep: 80, nodesep: 24, marginx: 40, marginy: 40 })
  nodes.forEach((n) => g.setNode(n.id, { width: n.measured?.width ?? 220, height: n.measured?.height ?? 90 }))
  edges.forEach((e) => g.setEdge(e.source, e.target))
  Dagre.layout(g)
  return {
    nodes: nodes.map((n) => {
      const pos = g.node(n.id)
      return { ...n, position: { x: pos.x - (n.measured?.width ?? 220) / 2, y: pos.y - (n.measured?.height ?? 90) / 2 } }
    }),
    edges,
  }
}

// ─── Custom Node: Criterion (L3) ──────────────────────────────────────────────

function CriterionNode({ data }: { data: any }) {
  return (
    <div
      style={{ width: 220 }}
      className={`relative group rounded-2xl border-2 p-4 shadow-md transition-all cursor-pointer select-none ${
        data.isHighlighted
          ? 'bg-[#00687a] border-[#00687a] text-white shadow-lg shadow-[#00687a]/25'
          : 'bg-white border-[#00687a]/40 hover:border-[#00687a] hover:shadow-lg'
      }`}
    >
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-[#00687a] !border-2 !border-white" />
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full tracking-wider ${
          data.isHighlighted ? 'bg-white/20 text-white' : 'bg-[#00687a]/10 text-[#00687a]'
        }`}>KRITERIA</span>
        <span className={`font-mono text-[10px] font-bold ${data.isHighlighted ? 'text-white/70' : 'text-[#00687a]'}`}>
          {data.code}
        </span>
      </div>
      <p className={`text-xs font-bold leading-snug mb-3 ${data.isHighlighted ? 'text-white' : 'text-[#191c1e]'}`}>
        {data.label}
      </p>
      <div className={`flex items-center justify-between text-[10px] ${data.isHighlighted ? 'text-white/60' : 'text-[#777587]'}`}>
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[11px]">hub</span>
          {data.indCount} indikator
        </span>
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
          data.indCount > 0
            ? (data.isHighlighted ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700')
            : (data.isHighlighted ? 'bg-white/15 text-white/70' : 'bg-amber-100 text-amber-700')
        }`}>
          {data.indCount > 0 ? 'Aktif' : 'Draft'}
        </span>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); data.onEdit() }}
        className={`absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 ${
          data.isHighlighted ? 'bg-white text-[#00687a]' : 'bg-[#3525cd] text-white'
        }`}
        title="Edit aturan L2"
      >
        <span className="material-symbols-outlined text-[13px]">edit</span>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); data.onAddChild() }}
        className="absolute -bottom-3 right-8 w-6 h-6 bg-[#00687a] text-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-[#005260]"
        title="Tambah indikator ke kriteria ini"
      >
        <span className="material-symbols-outlined text-[12px]">add</span>
      </button>
    </div>
  )
}

// ─── Custom Node: Indicator (L2) ──────────────────────────────────────────────

function IndicatorNode({ data }: { data: any }) {
  return (
    <div
      style={{ width: 196 }}
      className={`relative group rounded-xl border-2 p-3 shadow-sm transition-all cursor-pointer select-none ${
        data.isHighlighted
          ? 'bg-[#3525cd] border-[#3525cd] text-white shadow-lg shadow-[#3525cd]/25'
          : data.isDimmed
            ? 'bg-white border-[#c7c4d8]/30 opacity-40'
            : 'bg-white border-[#3525cd]/30 hover:border-[#3525cd] hover:shadow-md'
      }`}
    >
      <Handle type="target" position={Position.Left} className="!w-2.5 !h-2.5 !bg-[#3525cd] !border-2 !border-white" />
      <Handle type="source" position={Position.Right} className="!w-2.5 !h-2.5 !bg-[#6d28d9] !border-2 !border-white" />
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full tracking-wider ${
          data.isHighlighted ? 'bg-white/20 text-white' : 'bg-[#3525cd]/10 text-[#3525cd]'
        }`}>IND</span>
        <span className={`font-mono text-[10px] font-bold ${data.isHighlighted ? 'text-white/70' : 'text-[#3525cd]'}`}>
          {data.code}
        </span>
      </div>
      <p className={`text-[11px] font-semibold leading-snug mb-1.5 ${data.isHighlighted ? 'text-white' : 'text-[#191c1e]'}`}>
        {data.label}
      </p>
      <div className={`text-[9px] flex items-center gap-1 ${data.isHighlighted ? 'text-white/60' : 'text-[#777587]'}`}>
        <span className="material-symbols-outlined text-[10px]">data_object</span>
        {data.varCount} variabel
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); data.onEdit() }}
        className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-[#3525cd] text-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
        title="Edit aturan L1"
      >
        <span className="material-symbols-outlined text-[11px]">edit</span>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); data.onAddChild() }}
        className="absolute -bottom-2.5 right-4 w-5 h-5 bg-[#6d28d9] text-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
        title="Tambah variabel ke indikator ini"
      >
        <span className="material-symbols-outlined text-[10px]">add</span>
      </button>
    </div>
  )
}

// ─── Custom Node: Variable (L1) ───────────────────────────────────────────────

function VariableNode({ data }: { data: any }) {
  const [showTooltip, setShowTooltip] = useState(false)
  return (
    <div
      style={{ width: 156 }}
      className={`relative group rounded-lg border p-2 transition-all cursor-default select-none ${
        data.isHighlighted
          ? 'bg-[#6d28d9]/10 border-[#6d28d9]/60 shadow-sm'
          : data.isDimmed
            ? 'bg-[#f8fafc] border-[#c7c4d8]/20 opacity-30'
            : 'bg-[#f8fafc] border-[#c7c4d8]/40 hover:border-[#6d28d9]/40 hover:bg-[#6d28d9]/5'
      }`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-[#6d28d9] !border-2 !border-white" />
      <div className="flex items-center gap-1 mb-0.5">
        <span className={`text-[7px] font-black px-1 py-0.5 rounded ${
          data.isHighlighted ? 'bg-[#6d28d9]/20 text-[#6d28d9]' : 'bg-[#6d28d9]/10 text-[#6d28d9]'
        }`}>VAR</span>
        <span className={`font-mono text-[9px] font-bold ${
          data.isHighlighted ? 'text-[#6d28d9]' : 'text-[#464555]'
        }`}>{data.code}</span>
      </div>
      <p className="text-[9px] text-[#464555] leading-snug line-clamp-2 font-medium">{data.label}</p>
      {showTooltip && (
        <div className="absolute left-full top-0 ml-3 z-[999] w-60 bg-slate-900 text-white rounded-xl p-3 shadow-2xl border border-slate-700 pointer-events-none">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="font-mono text-[10px] font-bold text-violet-400">{data.code}</span>
            <span className="text-[9px] text-slate-400 truncate">{data.category}</span>
          </div>
          <p className="text-[11px] text-slate-200 leading-relaxed">{data.label}</p>
          <div className="mt-2 pt-2 border-t border-slate-700 text-[9px] text-slate-400 flex items-center gap-1">
            <span className="material-symbols-outlined text-[10px]">info</span>
            Skala Likert 1-5 · ≥ ambang batas = TRUE
          </div>
        </div>
      )}
    </div>
  )
}

const nodeTypes = { criterion: CriterionNode, indicator: IndicatorNode, variable: VariableNode }

// ─── Main exported component ──────────────────────────────────────────────────

export default function DecisionTreeCanvas(props: Props) {
  return (
    <ReactFlowProvider>
      <DecisionTreeCanvasContent {...props} />
    </ReactFlowProvider>
  )
}

function DecisionTreeCanvasContent(props: Props) {
  const { criteria, indicators, variables, rules, onOpenEditPanel, onAddRule } = props
  const [selectedCritCode, setSelectedCritCode] = useState<string | null>(null)
  const [sidebarSearch, setSidebarSearch] = useState('')
  const [canvasSearch, setCanvasSearch] = useState('')

  const { fitView, getNodes } = useReactFlow()
  const reactFlowWrapperRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false)
  const exportMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as any)) {
        setIsExportMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Nodes & Edges state (from CanvasInner)
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  const critToInds = useMemo(() => {
    const m: Record<string, string[]> = {}
    rules.filter(r => r.type === 'L2').forEach(r => { m[r.targetCode] = r.sourceCodes })
    return m
  }, [rules])

  const indToVars = useMemo(() => {
    const m: Record<string, string[]> = {}
    rules.filter(r => r.type === 'L1').forEach(r => { m[r.targetCode] = r.sourceCodes })
    return m
  }, [rules])

  const filteredSidebarCriteria = criteria.filter(c =>
    c.code.toLowerCase().includes(sidebarSearch.toLowerCase()) ||
    c.label.toLowerCase().includes(sidebarSearch.toLowerCase())
  )

  const searchHighlightCode = useMemo(() => {
    if (!canvasSearch.trim()) return null
    const q = canvasSearch.trim().toLowerCase()
    const byCode = criteria.find(c => c.code.toLowerCase() === q)
    if (byCode) return byCode.code
    const byLabel = criteria.find(c => c.label.toLowerCase().includes(q))
    if (byLabel) return byLabel.code
    const byInd = indicators.find(i => i.code.toLowerCase() === q)
    if (byInd) { const crit = criteria.find(c => (critToInds[c.code] || []).includes(byInd.code)); if (crit) return crit.code }
    return null
  }, [canvasSearch, criteria, indicators, critToInds])

  const effectiveCritCode = canvasSearch.trim() ? searchHighlightCode : selectedCritCode

  const buildGraph = useCallback(() => {
    const scope = effectiveCritCode ? criteria.filter(c => c.code === effectiveCritCode) : criteria
    const rawNodes: Node[] = []
    const rawEdges: Edge[] = []

    scope.forEach(crit => {
      const critInds = critToInds[crit.code] || []
      const isHL = !effectiveCritCode || effectiveCritCode === crit.code

      rawNodes.push({
        id: `crit-${crit.code}`, type: 'criterion', position: { x: 0, y: 0 },
        data: {
          code: crit.code, label: crit.label, indCount: critInds.length, isHighlighted: isHL,
          onEdit: () => { const r = rules.find(r => r.id === `RULE-${crit.code}` && r.type === 'L2'); if (r) onOpenEditPanel(r) },
          onAddChild: () => onAddRule('L2', crit.code, critInds),
        },
      })

      critInds.forEach(indCode => {
        const ind = indicators.find(i => i.code === indCode)
        if (!ind) return
        const indVars = indToVars[indCode] || []

        rawNodes.push({
          id: `ind-${indCode}`, type: 'indicator', position: { x: 0, y: 0 },
          data: {
            code: indCode, label: ind.label, varCount: indVars.length, isHighlighted: isHL, isDimmed: false,
            onEdit: () => { const r = rules.find(r => r.id === `RULE-${indCode}` && r.type === 'L1'); if (r) onOpenEditPanel(r) },
            onAddChild: () => onAddRule('L1', indCode, indVars),
          },
        })

        rawEdges.push({
          id: `e-c${crit.code}-i${indCode}`, source: `crit-${crit.code}`, target: `ind-${indCode}`,
          type: 'smoothstep', animated: isHL,
          style: { stroke: isHL ? '#00687a' : '#c7c4d8', strokeWidth: isHL ? 2 : 1.5 },
          markerEnd: { type: MarkerType.ArrowClosed, color: isHL ? '#00687a' : '#c7c4d8', width: 14, height: 14 },
        })

        indVars.forEach(varCode => {
          const v = variables.find(x => x.code === varCode)
          if (!v) return
          const nid = `var-${varCode}-${indCode}`

          rawNodes.push({
            id: nid, type: 'variable', position: { x: 0, y: 0 },
            data: { code: varCode, label: v.label, category: v.category, isHighlighted: isHL, isDimmed: false },
          })

          rawEdges.push({
            id: `e-i${indCode}-v${varCode}`, source: `ind-${indCode}`, target: nid,
            type: 'smoothstep', animated: false,
            style: { stroke: isHL ? '#6d28d9' : '#c7c4d8', strokeWidth: isHL ? 1.5 : 1 },
            markerEnd: { type: MarkerType.ArrowClosed, color: isHL ? '#6d28d9' : '#c7c4d8', width: 12, height: 12 },
          })
        })
      })
    })

    const { nodes: ln, edges: le } = getLayoutedElements(rawNodes, rawEdges)
    setNodes(ln)
    setEdges(le)
    setTimeout(() => fitView({ padding: 0.18, duration: 450 }), 80)
  }, [criteria, indicators, variables, rules, effectiveCritCode, critToInds, indToVars, onOpenEditPanel, onAddRule, fitView, setNodes, setEdges])

  useEffect(() => { buildGraph() }, [buildGraph])

  const onConnect = useCallback((c: Connection) => setEdges(eds => addEdge(c, eds)), [setEdges])

  function getStats(code: string) {
    const inds = critToInds[code] || []
    const vars = inds.flatMap(ic => indToVars[ic] || [])
    return { inds: inds.length, vars: vars.length }
  }

  const handleExport = useCallback(async (type: 'png' | 'svg') => {
    if (!reactFlowWrapperRef.current) return

    const visibleNodes = getNodes()
    if (visibleNodes.length === 0) return

    setIsExporting(true)

    try {
      const nodesBounds = getNodesBounds(visibleNodes)
      const padding = 60
      const imageWidth = nodesBounds.width + padding * 2
      const imageHeight = nodesBounds.height + padding * 2

      const transform = {
        x: -nodesBounds.x + padding,
        y: -nodesBounds.y + padding,
        zoom: 1,
      }

      const viewportElement = reactFlowWrapperRef.current.querySelector('.react-flow__viewport') as HTMLElement
      if (!viewportElement) {
        setIsExporting(false)
        return
      }

      const options = {
        backgroundColor: '#f8fafc',
        width: imageWidth,
        height: imageHeight,
        style: {
          width: `${imageWidth}px`,
          height: `${imageHeight}px`,
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
          transformOrigin: 'top left',
        },
        filter: (node: any) => {
          const cl = node.classList
          const tagName = node?.tagName?.toLowerCase()
          if (tagName === 'button') {
            return false
          }
          if (cl && (
            cl.contains('react-flow__minimap') ||
            cl.contains('react-flow__controls') ||
            cl.contains('react-flow__panel') ||
            cl.contains('react-flow-export-exclude') ||
            cl.contains('material-symbols-outlined')
          )) {
            return false
          }
          return true
        }
      }

      let dataUrl = ''
      if (type === 'png') {
        dataUrl = await toPng(viewportElement, options)
      } else {
        dataUrl = await toSvg(viewportElement, options)
      }

      const link = document.createElement('a')
      const timestamp = new Date().toISOString().split('T')[0]
      const criterionText = effectiveCritCode ? `-${effectiveCritCode}` : '-semua'
      link.download = `pohon-keputusan${criterionText}-${timestamp}.${type}`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Failed to export decision tree image:', error)
      alert('Gagal mengekspor gambar. Silakan coba lagi.')
    } finally {
      setIsExporting(false)
    }
  }, [getNodes, effectiveCritCode])

  return (
    <div className="flex h-full min-h-0">
      {/* ── Sidebar ────────────────────────────────────────── */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-[#c7c4d8]/30 flex flex-col shadow-sm">
        <div className="px-4 py-4 border-b border-[#c7c4d8]/20">
          <h4 className="text-[10px] font-black text-[#00687a] uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">verified</span>
            Kriteria Evaluasi
          </h4>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#777587] text-sm">search</span>
            <input
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-[#c7c4d8]/40 focus:border-[#00687a] rounded-full outline-none bg-[#f8fafc] focus:bg-white transition-colors"
              placeholder="Cari kriteria..."
              value={sidebarSearch}
              onChange={e => setSidebarSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="px-3 pt-3 pb-1">
          <button
            onClick={() => { setSelectedCritCode(null); setCanvasSearch('') }}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              effectiveCritCode === null ? 'bg-[#00687a] text-white shadow-sm' : 'text-[#464555] hover:bg-[#f2f4f6]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">account_tree</span>
            Tampilkan Semua
            <span className={`ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
              effectiveCritCode === null ? 'bg-white/20 text-white' : 'bg-[#00687a]/10 text-[#00687a]'
            }`}>{criteria.length}</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-1.5 space-y-0.5">
          {filteredSidebarCriteria.map(crit => {
            const { inds, vars } = getStats(crit.code)
            const isSelected = effectiveCritCode === crit.code
            return (
              <button
                key={crit.code}
                onClick={() => { setSelectedCritCode(isSelected ? null : crit.code); setCanvasSearch('') }}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all ${
                  isSelected ? 'bg-[#00687a]/10 border border-[#00687a]/25 shadow-sm' : 'hover:bg-[#f2f4f6] border border-transparent'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                    inds > 0 ? (isSelected ? 'bg-[#00687a]' : 'bg-emerald-500') : 'bg-amber-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-mono text-[10px] font-black shrink-0 ${isSelected ? 'text-[#00687a]' : 'text-[#464555]'}`}>
                        {crit.code}
                      </span>
                      <span className={`text-[11px] font-semibold leading-tight truncate ${isSelected ? 'text-[#00687a]' : 'text-[#191c1e]'}`}>
                        {crit.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-0.5 text-[9px] text-[#777587]">
                        <span className="material-symbols-outlined text-[9px]">hub</span>
                        {inds} ind
                      </span>
                      <span className="flex items-center gap-0.5 text-[9px] text-[#777587]">
                        <span className="material-symbols-outlined text-[9px]">data_object</span>
                        {vars} var
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="px-4 py-3 border-t border-[#c7c4d8]/20 bg-[#f8fafc] space-y-1.5">
          {[
            { label: 'Total variabel', value: variables.length, color: 'text-[#6d28d9]' },
            { label: 'Total indikator', value: indicators.length, color: 'text-[#3525cd]' },
            { label: 'Total aturan', value: rules.length, color: 'text-[#00687a]' },
          ].map(s => (
            <div key={s.label} className="flex justify-between text-[10px] text-[#777587]">
              <span>{s.label}</span>
              <span className={`font-bold ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* ── Canvas ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="bg-white border-b border-[#c7c4d8]/20 px-5 py-2.5 flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs flex-1 min-w-0">
            <span className="material-symbols-outlined text-sm text-[#3525cd]">account_tree</span>
            <span className="font-bold text-[#3525cd]">Pohon Keputusan</span>
            {effectiveCritCode && (
              <>
                <span className="material-symbols-outlined text-sm text-[#777587]">chevron_right</span>
                <span className="font-black text-[#00687a]">{criteria.find(c => c.code === effectiveCritCode)?.code}</span>
                <span className="text-[#464555] truncate max-w-[180px] text-[11px]">
                  — {criteria.find(c => c.code === effectiveCritCode)?.label}
                </span>
              </>
            )}
          </div>

          {/* Canvas search */}
          <div className="relative">
            <span className={`material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-sm ${
              searchHighlightCode ? 'text-[#00687a]' : 'text-[#777587]'
            }`}>{searchHighlightCode ? 'my_location' : 'manage_search'}</span>
            <input
              className={`pl-8 pr-7 py-1.5 text-xs border rounded-full outline-none w-52 transition-all ${
                canvasSearch && !searchHighlightCode
                  ? 'border-amber-400 bg-amber-50 focus:border-amber-500'
                  : canvasSearch && searchHighlightCode
                    ? 'border-[#00687a] bg-[#00687a]/5 focus:border-[#00687a]'
                    : 'border-[#c7c4d8]/40 bg-[#f8fafc] focus:border-[#3525cd] focus:bg-white'
              }`}
              placeholder="Lompat ke node (K1, I4...)"
              value={canvasSearch}
              onChange={e => setCanvasSearch(e.target.value)}
            />
            {canvasSearch && (
              <button onClick={() => setCanvasSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#777587] hover:text-[#3525cd] transition-colors">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>

          {/* Legend */}
          <div className="hidden xl:flex items-center gap-4 pl-3 border-l border-[#c7c4d8]/30">
            {[
              { color: '#00687a', label: 'L3 Kriteria' },
              { color: '#3525cd', label: 'L2 Indikator' },
              { color: '#6d28d9', label: 'L1 Variabel' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: l.color }} />
                <span className="text-[10px] text-[#464555] font-semibold">{l.label}</span>
              </div>
            ))}
          </div>

          {/* Hint */}
          <span className="hidden md:flex items-center gap-1 text-[10px] text-[#777587] pl-3 border-l border-[#c7c4d8]/30 shrink-0">
            <span className="material-symbols-outlined text-[11px]">touch_app</span>
            Hover node untuk edit/tambah
          </span>

          {/* Export Button & Dropdown */}
          <div className="relative pl-3 border-l border-[#c7c4d8]/30 shrink-0" ref={exportMenuRef}>
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#c7c4d8]/40 hover:border-[#3525cd]/60 rounded-full bg-[#f8fafc] hover:bg-white text-xs font-semibold text-[#464555] hover:text-[#3525cd] transition-all cursor-pointer shadow-sm select-none"
              disabled={isExporting}
            >
              <span className={`material-symbols-outlined text-sm ${isExporting ? 'animate-spin' : ''}`}>
                {isExporting ? 'sync' : 'download'}
              </span>
              <span>{isExporting ? 'Mengekspor...' : 'Ekspor Gambar'}</span>
              <span className="material-symbols-outlined text-xs">arrow_drop_down</span>
            </button>
            {isExportMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-40 bg-white rounded-xl shadow-xl border border-[#c7c4d8]/30 py-1.5 z-[999]">
                <button
                  onClick={() => {
                    setIsExportMenuOpen(false)
                    handleExport('png')
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-[#464555] hover:bg-[#3525cd]/5 hover:text-[#3525cd] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm text-[#777587]">image</span>
                  Ekspor ke PNG
                </button>
                <button
                  onClick={() => {
                    setIsExportMenuOpen(false)
                    handleExport('svg')
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-[#464555] hover:bg-[#3525cd]/5 hover:text-[#3525cd] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm text-[#777587]">draw</span>
                  Ekspor ke SVG
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Flow canvas */}
        <div ref={reactFlowWrapperRef} className="flex-1 min-h-0 relative">
          {criteria.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#777587] gap-3">
              <span className="material-symbols-outlined text-6xl text-[#c7c4d8]">account_tree</span>
              <p className="text-sm font-semibold">Belum ada kriteria evaluasi.</p>
              <p className="text-xs">Tambah kriteria terlebih dahulu.</p>
            </div>
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.18 }}
              minZoom={0.1}
              maxZoom={2.5}
              proOptions={{ hideAttribution: true }}
              className="bg-[#f8fafc]"
            >
              <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#c7c4d8" />
              <Controls className="!bg-white !border-[#c7c4d8]/40 !shadow-lg !rounded-xl" showInteractive={false} />
              <MiniMap
                nodeColor={n => n.type === 'criterion' ? '#00687a' : n.type === 'indicator' ? '#3525cd' : '#6d28d9'}
                className="!bg-white !border-[#c7c4d8]/40 !shadow-lg !rounded-xl"
                maskColor="rgba(248,250,252,0.85)"
              />
            </ReactFlow>
          )}
        </div>
      </div>
    </div>
  )
}
