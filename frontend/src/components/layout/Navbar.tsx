import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()

  return (
    <header className="bg-[#f7f9fb]/80 glass-header sticky top-0 z-50 flex justify-between items-center w-full px-4 md:px-10 py-4 shadow-sm">
      <Link to="/" className="flex items-center gap-2">
        <span className="material-symbols-outlined text-[#3525cd] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>pulse_alert</span>
        <span className="text-2xl font-bold text-[#3525cd]">Talentku</span>
      </Link>

      <nav className="hidden md:flex gap-8">
        <Link
          to="/"
          className={`text-sm font-semibold transition-colors ${location.pathname === '/' ? 'text-[#3525cd] border-b-2 border-[#3525cd]' : 'text-[#464555] hover:text-[#3525cd]'}`}
        >
          Home
        </Link>
        <Link
          to="/assessment/start"
          className={`text-sm font-semibold transition-colors ${location.pathname.startsWith('/assessment') ? 'text-[#3525cd] border-b-2 border-[#3525cd]' : 'text-[#464555] hover:text-[#3525cd]'}`}
        >
          My Assessments
        </Link>
        <a href="#" className="text-sm font-semibold text-[#464555] hover:text-[#3525cd] transition-colors">Resources</a>
      </nav>

      <div className="flex items-center gap-4">
        <button className="material-symbols-outlined text-[#464555] hover:text-[#3525cd] transition-colors">notifications</button>
        <div className="w-10 h-10 rounded-full bg-[#4f46e5] flex items-center justify-center text-[#dad7ff] overflow-hidden">
          <img
            alt="Profile"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuATw79CwUkG__X2ZONCbdE0M0ab1QIduZfZ6h_R_Fi2N2v1D7tywywhWmmyNvnMRMHcN4RkWnAhaGGlolmxtlHNKDjLNz-LWHyoEVrh5BLceNTVNt8_QT4SOVhPJQZf-sMQtbJVkCt3SULR5Xw-xeekIHEZ-yoxV4-X4JqaWaV6gaR2B7i_kRsbJAW1mK0prkwSOJSrx-OEBL0SGkH6QXWRIQtOb3ugp8w16Nlym7J48DwH2SYgklAgMhNzyPOCevxRo24-r2xUG5w"
          />
        </div>
      </div>
    </header>
  )
}
