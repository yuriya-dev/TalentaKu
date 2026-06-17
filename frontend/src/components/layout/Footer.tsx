import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="w-full py-8 px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4 bg-[#e0e3e5]">
      <div className="flex flex-col items-center md:items-start">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="material-symbols-outlined text-[#3525cd] text-xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            pulse_alert
          </span>
          <span className="text-sm font-bold text-[#191c1e]">Talentku</span>
        </div>
        <p className="text-xs text-[#464555] text-center md:text-left">
          © 2024 Talentku Expert Systems. Professional Warmth in Assessment.
        </p>
      </div>
      <div className="flex gap-8">
        <Link to="#" className="text-xs text-[#464555] hover:text-[#3525cd] transition-colors">Privacy Policy</Link>
        <Link to="#" className="text-xs text-[#464555] hover:text-[#3525cd] transition-colors">Terms of Service</Link>
        <Link to="#" className="text-xs text-[#464555] hover:text-[#3525cd] transition-colors">Support</Link>
      </div>
    </footer>
  )
}
