import { Link, useLocation, useNavigate } from 'react-router-dom'

const navItems = [
  { icon: 'dashboard', label: 'Dasbor', to: '/admin' },
  { icon: 'quiz', label: 'Asesmen', to: '/admin/assessments' },
  { icon: 'account_tree', label: 'Pembuat Aturan', to: '/admin/rules' },
  { icon: 'tune', label: 'Variabel', to: '/admin/variables' },
  { icon: 'leaderboard', label: 'Indikator', to: '/admin/indicators' },
  { icon: 'settings', label: 'Pengaturan', to: '/admin/settings' },
]

export default function AdminSidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    localStorage.removeItem('user_token')
    localStorage.removeItem('user_data')
    navigate('/admin/login')
  }

  return (
    <aside className="h-full w-64 hidden md:flex flex-col bg-[#f2f4f6] py-8 px-4 gap-4 z-40 border-r border-[#c7c4d8]">
      <div className="flex flex-col gap-1 px-2 mb-6">
        <img src="/logo_text.svg" alt="TalentaKu Logo" className="h-8 w-auto object-contain shrink-0 self-start" />
        <p className="text-[10px] text-[#464555] font-semibold uppercase tracking-wider pl-1">Expert System</p>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-semibold ${
                isActive
                  ? 'bg-[#4f46e5]/10 text-[#4f46e5] font-bold'
                  : 'text-[#464555] hover:bg-[#e0e3e5]/50'
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-[#c7c4d8] pt-4">
        <button className="text-[#464555] hover:bg-[#e0e3e5]/50 flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-semibold w-full text-left">
          <span className="material-symbols-outlined">help</span>
          <span>Bantuan</span>
        </button>
        <button
          onClick={handleLogout}
          className="text-[#ba1a1a] flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#ba1a1a]/10 transition-all duration-200 text-sm font-semibold w-full text-left"
        >
          <span className="material-symbols-outlined">logout</span>
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  )
}
