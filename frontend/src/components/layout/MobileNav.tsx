import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { icon: 'home', label: 'Home', to: '/' },
  { icon: 'assignment', label: 'Assess', to: '/assessment/start' },
  { icon: 'leaderboard', label: 'Stats', to: '/results/1' },
  { icon: 'person', label: 'Profile', to: '#' },
]

export default function MobileNav() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-2 pt-3 bg-[#f7f9fb] md:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.to
        return (
          <Link
            key={item.label}
            to={item.to}
            className={`flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all ${
              isActive
                ? 'bg-[#4f46e5] text-[#dad7ff]'
                : 'text-[#464555] hover:bg-[#e6e8ea]'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className="text-[12px] font-medium mt-1">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
