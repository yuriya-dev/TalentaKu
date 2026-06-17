import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function ChildIntakePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.title = 'Child Data Intake | Talentku'
  }, [])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      navigate('/assessment/1')
    }, 900)
  }

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] font-sans min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#f7f9fb]/80 backdrop-blur-md shadow-sm sticky top-0 z-50 flex justify-between items-center w-full px-4 md:px-10 py-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#3525cd] text-3xl">psychology</span>
          <span className="text-2xl font-bold text-[#3525cd]">Talentku</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-[#464555] hover:text-[#3525cd] transition-colors p-2 rounded-full hover:bg-[#e6e8ea] active:scale-95">
            <span className="material-symbols-outlined">help</span>
          </button>
          <button className="text-[#464555] hover:text-[#3525cd] transition-colors p-2 rounded-full hover:bg-[#e6e8ea] active:scale-95">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-[#f2f4f6] h-1.5 sticky top-[72px] z-40">
        <div className="bg-[#3525cd] h-full shadow-[0_0_8px_rgba(79,70,229,0.4)]" style={{ width: '15%', transition: 'width 0.6s cubic-bezier(0.65,0,0.35,1)' }} />
      </div>

      {/* Main */}
      <main className="flex-grow flex flex-col items-center justify-start py-12 px-4 md:px-10 relative overflow-hidden">
        {/* Ambient blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#3525cd]/5 rounded-full blur-[100px] -z-10" />
        <div className="absolute top-1/2 -right-24 w-64 h-64 bg-[#00687a]/5 rounded-full blur-[80px] -z-10" />

        <section className="max-w-[640px] w-full space-y-6">
          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3525cd]/10 text-[#3525cd] border border-[#3525cd]/20 mb-4">
              <span className="material-symbols-outlined text-[18px]">child_care</span>
              <span className="text-xs font-semibold uppercase tracking-wider">Step 1: Identity</span>
            </div>
            <h1 className="text-[32px] font-bold leading-10 text-[#191c1e]">Tell us about your child</h1>
            <p className="text-lg text-[#464555]">We'll use this information to tailor the assessment results specifically for their developmental stage.</p>
          </div>

          {/* Form Card */}
          <div className="glass-card rounded-xl p-8 shadow-sm">
            <form className="space-y-8" id="intake-form" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="space-y-2 group">
                <label className="text-sm font-semibold text-[#191c1e] block px-1" htmlFor="child-name">
                  Child's Full Name
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#777587] group-focus-within:text-[#3525cd] transition-colors">person</span>
                  <input
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#c7c4d8] rounded-lg focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] transition-all outline-none text-base"
                    id="child-name"
                    placeholder="Enter full name"
                    required
                    type="text"
                  />
                </div>
              </div>

              {/* Age */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-[#191c1e] block px-1">Current Age</label>
                <div className="grid grid-cols-3 gap-4">
                  {[4, 5, 6].map((age) => (
                    <label key={age} className="relative group cursor-pointer">
                      <input className="peer sr-only" name="age" required type="radio" value={age} />
                      <div className="p-4 text-center border-2 border-[#c7c4d8] rounded-xl group-hover:border-[#3525cd]/50 peer-checked:border-[#3525cd] peer-checked:bg-[#4f46e5]/5 transition-all">
                        <span className="block text-2xl font-semibold text-[#191c1e] mb-1">{age}</span>
                        <span className="block text-xs text-[#464555]">Years Old</span>
                      </div>
                      <span
                        className="material-symbols-outlined absolute -top-2 -right-2 bg-[#3525cd] text-white rounded-full p-0.5 text-sm opacity-0 peer-checked:opacity-100 transition-opacity"
                        style={{ fontVariationSettings: "'FILL' 1", fontSize: '14px' }}
                      >
                        check
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Gender + School */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#191c1e] block px-1">Gender</label>
                  <div className="flex gap-2 p-1 bg-[#f2f4f6] rounded-lg">
                    {['Boy', 'Girl'].map((g) => (
                      <label key={g} className="flex-1">
                        <input className="peer sr-only" name="gender" required type="radio" value={g.toLowerCase()} />
                        <div className="text-center py-2.5 rounded-md cursor-pointer transition-all peer-checked:bg-white peer-checked:shadow-sm text-sm font-semibold text-[#464555] peer-checked:text-[#3525cd]">
                          {g}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#191c1e] block px-1" htmlFor="child-school">School / Kindergarten</label>
                  <input
                    className="w-full px-4 py-2.5 bg-white border border-[#c7c4d8] rounded-lg focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] transition-all outline-none text-base"
                    id="child-school"
                    placeholder="School Name"
                    required
                    type="text"
                  />
                </div>
              </div>

              {/* CTA */}
              <div className="pt-8 border-t border-[#c7c4d8]/30 flex flex-col md:flex-row justify-between items-center gap-4">
                <Link
                  to="/"
                  className="text-[#464555] text-sm font-semibold flex items-center gap-2 px-6 py-3 hover:text-[#3525cd] transition-colors"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                  Back to Home
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto bg-[#3525cd] text-white text-sm font-semibold px-10 py-4 rounded-full shadow-lg shadow-[#3525cd]/20 hover:bg-[#4f46e5] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">sync</span>
                      Initializing...
                    </>
                  ) : (
                    <>
                      Begin Assessment
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Trust badge */}
          <p className="text-center text-xs text-[#464555]/60 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-base">lock</span>
            Your data is encrypted and used only for talent identification purposes.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#e0e3e5] w-full py-8 px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4 mt-auto">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="text-sm font-bold text-[#464555]">Talentku</span>
          <p className="text-xs text-[#464555]">© 2024 Talentku Expert Systems. Professional Warmth in Assessment.</p>
        </div>
        <div className="flex gap-6">
          <a href="#" className="text-xs text-[#464555] hover:text-[#3525cd] transition-colors">Help</a>
          <a href="#" className="text-xs text-[#464555] hover:text-[#3525cd] transition-colors">Privacy Policy</a>
        </div>
      </footer>
    </div>
  )
}
