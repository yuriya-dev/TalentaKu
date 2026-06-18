import { useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

function launchConfetti() {
  const colors = ['#4F46E5', '#57dffe', '#10B981', '#FCD34D']
  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const particle = document.createElement('div')
      particle.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 200;
        width: ${randomInRange(4, 10)}px;
        height: ${randomInRange(4, 10)}px;
        background-color: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}vw;
        top: -10px;
        border-radius: 50%;
      `
      document.body.appendChild(particle)
      const anim = particle.animate(
        [
          { transform: 'translate(0,0) rotate(0deg)', opacity: '1' },
          { transform: `translate(${randomInRange(-100, 100)}px, 100vh) rotate(${randomInRange(0, 720)}deg)`, opacity: '0' },
        ],
        { duration: randomInRange(2000, 4000), easing: 'cubic-bezier(0.25,0.46,0.45,0.94)' }
      )
      anim.onfinish = () => particle.remove()
    }, i * 40)
  }
}

const strengths = [
  { title: 'High-level Vocabulary', desc: 'Uses complex descriptors and abstract nouns (I1, I3).' },
  { title: 'Exceptional Sequential Memory', desc: 'Capable of repeating 5+ sequences of information (I2).' },
  { title: 'Functional Classification', desc: 'Organizes objects by purpose and hidden relationships (I2).' },
  { title: 'Storytelling & Narrative', desc: 'Creates detailed simple accounts of events (C13).' },
]

const developmentPaths = [
  {
    title: 'Advanced Linguistic Exposure',
    desc: 'Introduce multi-layered storybooks and encourage verbal summaries or alternative ending scenarios.',
  },
  {
    title: 'Classification Challenges',
    desc: 'Engage in sorting activities that use increasingly abstract categories (e.g., sort objects by material, historical use, or emotion).',
  },
  {
    title: 'Abstract Pattern Recognition',
    desc: 'Puzzles and board games that require planning 2–3 steps ahead to stimulate the abstract reasoning centers.',
  },
]

export default function ResultsPage() {
  useEffect(() => {
    document.title = 'Assessment Results | TalentaKu'
    launchConfetti()
  }, [])

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] font-sans overflow-x-hidden">
      <Navbar />

      <main className="pt-24 pb-32 px-4 md:px-10 max-w-screen-xl mx-auto">
        {/* Header Celebration */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#4f46e5]/10 px-4 py-2 rounded-full text-[#3525cd] mb-6">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            <span className="text-sm font-semibold">Assessment Completed Successfully</span>
          </div>
          <h1 className="text-[48px] font-bold leading-[56px] tracking-tight mb-4">Discovery: Intelektual Umum</h1>
          <p className="text-[#464555] max-w-2xl mx-auto text-lg">
            We've analyzed the assessment data for your child. The results reveal a strong leaning towards intellectual and abstract reasoning capabilities.
          </p>
        </header>

        {/* Results Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Primary Result */}
          <section className="md:col-span-8 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[#c7c4d8] p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8">
              <div className="text-right">
                <span className="block text-[#3525cd] text-[48px] font-bold leading-none">92%</span>
                <span className="text-xs text-[#464555] uppercase tracking-wider">Confidence Score</span>
              </div>
            </div>
            <div className="flex flex-col gap-6 max-w-lg">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#FCD34D]/20 flex items-center justify-center text-[#FCD34D] shadow-sm">
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                </div>
                <div>
                  <h2 className="text-[32px] font-bold leading-10">Intelektual Umum</h2>
                  <p className="text-[#464555] text-sm font-semibold">Primary Talent Category</p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-[#3525cd]">Narrative Description</h3>
                <p className="text-[#464555] text-lg leading-relaxed">
                  Your child demonstrates exceptional capabilities in general intellectual functions. This includes high-level vocabulary processing, a strong memory for sequences and complex information, and the ability to grasp abstract concepts far beyond their age group.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-lg bg-[#f2f4f6]">
                  <span className="block text-2xl font-semibold text-[#3525cd]">I1–I3</span>
                  <span className="text-xs text-[#464555]">Core Indicators Identified</span>
                </div>
                <div className="p-4 rounded-lg bg-[#f2f4f6]">
                  <span className="block text-2xl font-semibold text-[#3525cd]">High</span>
                  <span className="text-xs text-[#464555]">Abstract Reasoning</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-[#3525cd]/5 rounded-full blur-3xl group-hover:bg-[#3525cd]/10 transition-colors duration-500" />
          </section>

          {/* Silver + Bronze + Insight */}
          <aside className="md:col-span-4 flex flex-col gap-6">
            {/* Silver */}
            <div className="bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[#c7c4d8] p-6 flex items-center justify-between group hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#94A3B8]/20 flex items-center justify-center text-[#94A3B8]">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Akademik Khusus</h4>
                  <p className="text-xs text-[#464555]">81% Matching</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#464555] opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
            </div>

            {/* Bronze */}
            <div className="bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[#c7c4d8] p-6 flex items-center justify-between group hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#D97706]/20 flex items-center justify-center text-[#D97706]">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Kepemimpinan</h4>
                  <p className="text-xs text-[#464555]">74% Matching</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#464555] opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
            </div>

            {/* Expert Tip */}
            <div className="flex-grow bg-[#4f46e5]/10 text-[#0f0069] rounded-xl p-6 relative overflow-hidden">
              <h4 className="text-2xl font-semibold mb-2">Expert Tip</h4>
              <p className="text-base opacity-90">Children with high general intelligence benefit significantly from project-based learning and open-ended questions.</p>
              <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-[80px] opacity-10" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
            </div>
          </aside>

          {/* Strengths */}
          <section className="md:col-span-6 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[#c7c4d8] p-8">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-[#10B981]" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
              <h3 className="text-2xl font-semibold">Identified Strengths</h3>
            </div>
            <ul className="space-y-4">
              {strengths.map((s) => (
                <li key={s.title} className="flex gap-4 items-start p-4 bg-[#f2f4f6] rounded-lg transition-transform hover:translate-x-1">
                  <span className="material-symbols-outlined text-[#10B981] mt-1">check_circle</span>
                  <div>
                    <p className="text-sm font-semibold">{s.title}</p>
                    <p className="text-xs text-[#464555]">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Development Path */}
          <section className="md:col-span-6 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[#c7c4d8] p-8">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-[#00687a]" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
              <h3 className="text-2xl font-semibold">Development Path</h3>
            </div>
            <div className="space-y-6">
              {developmentPaths.map((path) => (
                <div
                  key={path.title}
                  className="relative pl-8 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-1 before:bg-[#57dffe] rounded-r-lg p-2 hover:bg-[#f2f4f6] transition-colors"
                >
                  <h4 className="text-sm font-semibold text-[#00687a]">{path.title}</h4>
                  <p className="text-[#464555] text-base mt-1">{path.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <button className="w-full bg-[#3525cd] text-white text-sm font-semibold py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-[#4f46e5] transition-all active:scale-95 shadow-md">
                <span className="material-symbols-outlined">download</span>
                Download Detailed Report
              </button>
            </div>
          </section>
        </div>

        {/* Inference Engine Section */}
        <section className="mt-16 bg-[#eceef0]/50 border border-[#c7c4d8] rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-2/3">
            <h4 className="text-2xl font-semibold mb-2">About Our Inference Engine</h4>
            <p className="text-[#464555] text-base mb-4">
              TalentaKu uses a 2-level Forward Chaining engine based on American USOE standards. Our 33-rule system evaluates 83 variables to provide a reliable indicator of potential.
            </p>
            <div className="flex gap-4">
              <button className="text-[#3525cd] text-sm font-semibold hover:underline flex items-center gap-1">
                View Inference Trace
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </button>
              <span className="text-[#c7c4d8]">|</span>
              <button className="text-[#464555] text-sm font-semibold hover:text-[#3525cd] transition-colors">Methodology Documentation</button>
            </div>
          </div>
        </section>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-2 pt-3 bg-[#f7f9fb] md:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        {[
          { icon: 'home', label: 'Home', to: '/' },
          { icon: 'assignment', label: 'Assess', active: true },
          { icon: 'leaderboard', label: 'Stats' },
          { icon: 'person', label: 'Profile' },
        ].map((item) => (
          <div key={item.label} className={`flex flex-col items-center justify-center px-4 py-2 rounded-2xl ${item.active ? 'bg-[#4f46e5]/10 text-[#4f46e5]' : 'text-[#464555]'}`}>
            <span className="material-symbols-outlined" style={item.active ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
            <span className="text-xs font-medium mt-1">{item.label}</span>
          </div>
        ))}
      </nav>

      <Footer />
    </div>
  )
}
