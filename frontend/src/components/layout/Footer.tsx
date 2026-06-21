import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="w-full py-8 px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4 bg-[#e0e3e5]">
      <div className="flex flex-col items-center md:items-start">
        <div className="flex items-center mb-2">
          <img src="/logo_text.svg" alt="TalentaKu Logo" className="h-5 w-auto shrink-0" />
        </div>
        <p className="text-xs text-[#464555] text-center md:text-left">
          © 2026 TalentaKu Expert Systems. Kehangatan Profesional dalam Penilaian.
        </p>
      </div>
      <div className="flex gap-8">
        <Link to="#" className="text-xs text-[#464555] hover:text-[#3525cd] transition-colors">Kebijakan Privasi</Link>
        <Link to="#" className="text-xs text-[#464555] hover:text-[#3525cd] transition-colors">Ketentuan Layanan</Link>
        <Link to="#" className="text-xs text-[#464555] hover:text-[#3525cd] transition-colors">Dukungan</Link>
      </div>
    </footer>
  )
}
