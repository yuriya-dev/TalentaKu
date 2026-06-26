import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [userData, setUserData] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    const user = localStorage.getItem('user_data')
    if (user) {
      try {
        setUserData(JSON.parse(user))
      } catch (e) {
        // ignore
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user_token')
    localStorage.removeItem('user_data')
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    setUserData(null)
    navigate('/')
  }

  return (
    <header className="bg-[#f7f9fb]/80 glass-header sticky top-0 z-50 flex justify-between items-center w-full px-4 md:px-10 py-4 shadow-sm">
      <Link to="/" className="flex items-center">
        <img src="/logo_text.svg" alt="TalentaKu Logo" className="h-7 w-auto shrink-0" />
      </Link>

      <nav className="hidden md:flex gap-8">
        <Link
          to="/"
          className={`text-sm font-semibold transition-colors ${location.pathname === '/' ? 'text-[#3525cd] border-b-2 border-[#3525cd]' : 'text-[#464555] hover:text-[#3525cd]'}`}
        >
          Beranda
        </Link>
        <Link
          to="/assessments"
          className={`text-sm font-semibold transition-colors ${location.pathname === '/assessments' ? 'text-[#3525cd] border-b-2 border-[#3525cd]' : 'text-[#464555] hover:text-[#3525cd]'}`}
        >
          Asesmen Saya
        </Link>
        <Link
          to="/resources"
          className={`text-sm font-semibold transition-colors ${location.pathname === '/resources' ? 'text-[#3525cd] border-b-2 border-[#3525cd]' : 'text-[#464555] hover:text-[#3525cd]'}`}
        >
          Sumber Daya
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        <button className="material-symbols-outlined text-[#464555] hover:text-[#3525cd] transition-colors">notifications</button>
        {userData ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#3525cd] text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {userData.name.slice(0, 2).toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
            >
              Keluar
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="clay-btn-primary px-5 py-2.5 text-sm font-semibold hover:scale-[1.02] active:scale-95"
          >
            Masuk
          </Link>
        )}
      </div>
    </header>
  )
}
