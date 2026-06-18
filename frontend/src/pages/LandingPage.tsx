import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import MobileNav from '../components/layout/MobileNav'
import Footer from '../components/layout/Footer'

export default function LandingPage() {

  useEffect(() => {
    document.title = 'TalentaKu | Expert System for Child Potential'
    const handler = (e: MouseEvent) => {
      const blobs = document.querySelectorAll<HTMLElement>('.parallax-blob')
      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight
      blobs.forEach((blob, index) => {
        const speed = (index + 1) * 20
        blob.style.transform = `translate(${x * speed}px, ${y * speed}px)`
      })
    }
    document.addEventListener('mousemove', handler)
    return () => document.removeEventListener('mousemove', handler)
  }, [])

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] font-sans">
      <Navbar />

      <main>
        {/* ── Hero Section ─────────────────────────────── */}
        <section className="relative overflow-hidden pt-12 pb-24 px-4 md:px-10">
          <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="z-10 text-center lg:text-left">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#57dffe] text-[#006172] text-xs font-semibold mb-6">
                Scientific Intelligence Assessment
              </span>
              <h1 className="text-[48px] leading-[56px] tracking-tight font-bold mb-6 text-[#191c1e]">
                Discover Your Child's{' '}
                <span className="text-[#3525cd]">Natural Genius</span> Today.
              </h1>
              <p className="text-xl text-[#464555] mb-10 max-w-xl mx-auto lg:mx-0">
                Using the expert-proven Forward Chaining method to identify talents in children aged 4–6 through professional observations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/assessment/start"
                  className="px-8 py-4 bg-[#3525cd] text-white rounded-xl text-sm font-semibold shadow-lg shadow-[#3525cd]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Start Assessment
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <button className="px-8 py-4 bg-white text-[#3525cd] border border-[#c7c4d8] rounded-xl text-sm font-semibold hover:bg-[#eceef0] transition-all flex items-center justify-center gap-2">
                  Learn Methodology
                </button>
              </div>

              {/* Social proof */}
              <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start">
                <div className="flex -space-x-3">
                  {[
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuDUEwkZ-rMQDj9FJlvNlvLOgfaY-Mb0CdjFo_Ki9y8lwGwvK2EmJzGtWvMWfEL6JD9oFVuzRQqfnLOjiqAxT0onj-VdztHS7KHUKwrcPVaRCBKIuxFk8JL56hp3cTlZl6SzfZwAQET0LmIs-X5bTRIROWUZhl5u8hn5ATOmM8gtkfNWkXGv-kD6REkYVxKExjO1w3IfVtEPAbFB2xIqZCXq8YtEIie0MPEqbGLJStD300ThIG54nUzP5x0UTBm6PStb1MaGWTm1h0c',
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuDuc9r33SCj0fv5DnuQm52RqJDtx8cr50VUlBn-3nSXqTUm1ho6HYsopTFM5vFJV9oFanDMjfz1JU07z8yEtvWJ85b-HX6h7NrSjTx0rehbhA8WKGmfmkN3t5hfvkWTwEPDc5UJs4zh9xWWtSVbI6X9uu6jeV61vMm8ZCIU5ynUUJDkUh2WtOGMhDPMN5DrHVTfXVPhuSVAQQ5W6wFpZGKWZAaYAU1am35Malb6spzEQDyG7UTSgSKzhchEjiFnyogfyKpj4Zlouz0',
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuAePepfd0LoEFzwkziX11XZ4o2JtKgRhibXkpbhMvWmwJSMGcu8IHKpY7G_fZPpOyQs-THccqFYGBSnnN6vBikNLcugXuNulRuPQMfzeTUXZbwtvTKvX4MoPs_dAzG68u6_ySZxaRy6tJWGpHBaNYN23Q08u2G0oeeBPH47GLOjLStMN40xPrScAlk-yysmQVi4aHT2Y1bgdiZIg0DuIsjKZr0FMdx1gxzG-ajiEXoYxcigXhqgiwIbt-BSQmqW8Om3hs4wPuBovZM',
                  ].map((src, i) => (
                    <img key={i} alt={`Parent ${i + 1}`} src={src} className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                  ))}
                </div>
                <p className="text-xs text-[#464555]">
                  <span className="font-bold text-[#191c1e]">500+ Parents</span> trust TalentaKu
                </p>
              </div>
            </div>

            {/* Right — Hero Image */}
            <div className="relative">
              <div className="parallax-blob absolute -top-12 -right-12 w-64 h-64 bg-[#57dffe]/30 rounded-full blur-3xl transition-transform duration-300" />
              <div className="parallax-blob absolute -bottom-12 -left-12 w-48 h-48 bg-[#4f46e5]/20 rounded-full blur-3xl transition-transform duration-300" />
              <div className="relative rounded-[2rem] overflow-hidden card-shadow bg-white p-4 border border-slate-200">
                <img
                  alt="Child exploring talents"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmTYOkzww-WOKNNSbuBcBEsncRY7yoPrq1zPQq6Lbn4bfQD5DhiqAjZGn4nNud8pTnPU7N3T3oMpKd622YFK3QI8aFJVZzzgalB_kDvk6Tyh6jxCmDb93XnWi_1A01W7s4hV7c5_d3L7IW-P7VT-8JY0K5AAftQpsz9Ofe3jijN2LnUGgWmetTN9YyDa2Mm6KOhdAUFRQ6womdjpQkeUHF2AoZNpmBJs2Bh2n26HYdOrVpd5A9qx3dV6f6df2u2eEKsRic-S-rTlA"
                  className="rounded-[1.5rem] w-full aspect-[4/3] object-cover"
                />
                {/* Floating badge */}
                <div className="absolute top-8 right-8 bg-white/90 backdrop-blur rounded-2xl p-4 shadow-xl border border-white/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#10B981]/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#10B981]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                    <div>
                      <p className="text-xs text-[#464555]"><span className="font-bold text-[#191c1e]">500+ Parents</span> trust TalentaKu</p>
                      <p className="text-sm font-bold text-[#191c1e]">Creative Genius 94%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Method Section ────────────────────────────── */}
        <section className="py-24 bg-[#f2f4f6] px-4 md:px-10">
          <div className="container mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-[32px] font-bold leading-10 mb-4">Scientific Precision, Parent-Friendly</h2>
              <p className="text-lg text-[#464555]">
                Our expert system uses Forward Chaining to connect subtle daily behaviors to core talent categories.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: 'visibility', title: '1. Observation', color: 'bg-[#3525cd] text-white', desc: 'Answer 83 simple questions about your child\'s habits, vocabulary, and social interactions based on USOE standards.' },
                { icon: 'account_tree', title: '2. Forward Chaining', color: 'bg-[#57dffe] text-[#006172]', desc: 'Our engine processes "If-Then" rules (e.g., IF "Memory Strong" AND "High Vocabulary" THEN "General Intellectual").', badge: true },
                { icon: 'emoji_events', title: '3. Talent Mapping', color: 'bg-[#10B981]/20 text-[#10B981]', desc: 'Receive a detailed report mapping 6 core talent criteria including Leadership, Visual Arts, and Psychomotor skills.' },
              ].map((step, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 card-shadow-hover transition-all relative">
                  {step.badge && (
                    <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 z-10 text-slate-300">
                      <span className="material-symbols-outlined text-4xl">chevron_right</span>
                    </div>
                  )}
                  <div className={`w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <span className="material-symbols-outlined text-3xl">{step.icon}</span>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-base text-[#464555]">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Talent Categories Bento Grid ─────────────── */}
        <section className="py-24 px-4 md:px-10">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div className="max-w-xl">
                <h2 className="text-[32px] font-bold leading-10 mb-4">What We Measure</h2>
                <p className="text-lg text-[#464555]">
                  Based on research by Salisah, Lidya, and Defit (2015), our system covers the essential pillars of early childhood potential.
                </p>
              </div>
              <button className="text-[#3525cd] text-sm font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                View Full Methodology <span className="material-symbols-outlined">arrow_right_alt</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 md:h-[600px]">
              {/* K1 */}
              <div className="md:col-span-3 bg-[#3525cd] text-white p-8 rounded-[2rem] flex flex-col justify-between group overflow-hidden relative">
                <div className="z-10">
                  <span className="material-symbols-outlined text-4xl mb-4 opacity-80">psychology</span>
                  <h4 className="text-2xl font-semibold mb-2">General Intellectual</h4>
                  <p className="opacity-90 max-w-md">Identifying cognitive flexibility, vocabulary depth, and abstract thinking through 14 key variables.</p>
                </div>
                <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
              </div>
              {/* K2 */}
              <div className="md:col-span-3 bg-[#e0e3e5] p-8 rounded-[2rem] flex flex-col justify-between border border-slate-200">
                <div>
                  <span className="material-symbols-outlined text-4xl mb-4 text-[#3525cd]">school</span>
                  <h4 className="text-2xl font-semibold mb-2 text-[#191c1e]">Specific Academic</h4>
                  <p className="text-[#464555]">Probing numerical sequencing and scientific observation skills through experimental curiosity.</p>
                </div>
              </div>
              {/* K3 */}
              <div className="md:col-span-2 bg-[#00687a] text-white p-8 rounded-[2rem] flex flex-col justify-between relative overflow-hidden">
                <div className="z-10">
                  <span className="material-symbols-outlined text-4xl mb-4">palette</span>
                  <h4 className="text-2xl font-semibold mb-2">Creative Thinking</h4>
                  <p className="opacity-90">Originality in problem-solving and social empathy across 23 indicators.</p>
                </div>
              </div>
              {/* K4 */}
              <div className="md:col-span-2 bg-white p-8 rounded-[2rem] border border-[#3525cd]/20 flex flex-col justify-between shadow-sm">
                <div>
                  <span className="material-symbols-outlined text-4xl mb-4 text-[#3525cd]">groups</span>
                  <h4 className="text-2xl font-semibold mb-2 text-[#3525cd]">Leadership</h4>
                  <p className="text-[#464555]">Social intelligence, conflict resolution, and collaborative initiative.</p>
                </div>
              </div>
              {/* K5 */}
              <div className="md:col-span-2 bg-[#d8dadc] p-8 rounded-[2rem] flex flex-col justify-between border border-slate-300">
                <div>
                  <span className="material-symbols-outlined text-4xl mb-4 text-[#191c1e]">fitness_center</span>
                  <h4 className="text-2xl font-semibold mb-2 text-[#191c1e]">Psychomotor</h4>
                  <p className="text-[#464555]">Kinesthetic skills and physical coordination milestones.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Testimonial ───────────────────────────────── */}
        <section className="py-24 bg-[#e2dfff] text-[#0f0069] px-4 md:px-10 rounded-[3rem] mx-4 mb-24 overflow-hidden relative">
          <div className="container mx-auto relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-center mb-8">
                <div className="flex gap-1 text-[#FCD34D]">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
              </div>
              <blockquote className="text-[32px] leading-10 font-semibold text-center mb-10 leading-snug">
                "TalentPulse gave us a clear roadmap for our son's education. We always knew he was creative, but seeing the Forward Chaining data showing a 92% inclination in Visual Arts gave us the confidence to enroll him in advanced classes."
              </blockquote>
              <div className="flex flex-col items-center">
                <img
                  alt="Sarah Johnson"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8qXCBu-r2F8_SONrhpxc4wvR6-vwFFVCUVsbSGadvidPRL9OAZx0OAo0ancFx5gTdfVsNTY_mSZ0GtMl6DLGos79SQ5GjArl8oGxS1sN9IuN74iZHzd6Yib_hDS2fpHzBnvwVfMZUhC5-Gsfecrky_zL03CnbxixpnjBDi5nKzO3SFzsrsHubuXBI7YKDTWRO8zntpCTGZWTeF3wH_ZXxq7VDMqJBIDbrtyuL3x6Rqbj_2fcGUnlqFtAHXEdAIdwr1GAGW42Ihkk"
                  className="w-16 h-16 rounded-full border-2 border-white mb-4 object-cover"
                />
                <p className="text-sm font-bold">Sarah Johnson</p>
                <p className="text-xs opacity-70">Mother of a 5-year-old, Jakarta</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Trust Badges ─────────────────────────────── */}
        <section className="py-12 border-t border-slate-200 px-4 md:px-10">
          <div className="container mx-auto">
            <p className="text-center text-xs text-[#464555] uppercase tracking-widest mb-10">Backed by Educational Research</p>
            <div className="flex flex-wrap justify-center items-center gap-12 grayscale opacity-60">
              {[
                { icon: 'verified', label: 'USOE Standards' },
                { icon: 'science', label: 'Forward Chaining' },
                { icon: 'auto_stories', label: 'Academic Journal 2015' },
                { icon: 'shield', label: 'GDPR Compliant' },
              ].map((badge) => (
                <div key={badge.label} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-3xl">{badge.icon}</span>
                  <span className="font-bold text-2xl">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Section ──────────────────────────────── */}
        <section className="py-24 px-4 md:px-10">
          <div className="container mx-auto max-w-4xl bg-[#e0e3e5] rounded-[3rem] p-12 text-center border border-slate-200 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 text-[#3525cd]/10">
              <span className="material-symbols-outlined" style={{ fontSize: '120px' }}>psychology_alt</span>
            </div>
            <h2 className="text-[32px] font-bold leading-10 mb-6">Ready to see where your child's potential lies?</h2>
            <p className="text-lg text-[#464555] mb-10 max-w-xl mx-auto">
              The 15-minute observation assessment provides a life-long perspective on natural talents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/assessment/start"
                className="px-10 py-5 bg-[#3525cd] text-white rounded-2xl text-sm font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                Start Now <span className="material-symbols-outlined">play_circle</span>
              </Link>
              <button className="px-10 py-5 bg-white text-[#191c1e] border border-slate-200 rounded-2xl text-sm font-semibold hover:bg-slate-50 transition-all">
                Consult an Expert
              </button>
            </div>
            <p className="mt-8 text-xs text-[#464555] italic">Free for your first child assessment. Expert system version 1.0.4.</p>
          </div>
        </section>
      </main>

      <Footer />
      <MobileNav />
    </div>
  )
}
