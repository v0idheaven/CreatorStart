import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, Zap, Calendar, FileText, Settings } from 'lucide-react'
import supabase from '../supabase'

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
  { icon: Zap, label: 'Content Generator', href: '/generator' },
  { icon: Calendar, label: '30-Day Planner', href: '/planner' },
  { icon: FileText, label: 'Posts', href: '/posts' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/auth')
  }

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      style={{
        width: isOpen ? '232px' : '68px',
        transition: 'width 0.22s ease',
        background: 'var(--sb)',
        borderRight: '1px solid var(--border)',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '8px 0',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '14px 18px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '28px', height: '28px', minWidth: '28px', background: 'var(--accent)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: '#fff' }}>
          CS
        </div>
        {isOpen && (
          <span style={{ color: 'var(--text)', fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap' }}>
            Creator<em style={{ color: 'var(--accent)', fontStyle: 'normal' }}>Start</em>
          </span>
        )}
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 8px' }}>
        {navItems.map((item) => (
          <div
            key={item.label}
            onClick={() => navigate(item.href)}
            className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg hover:bg-[#18181b]"
            style={{ whiteSpace: 'nowrap' }}
          >
            <item.icon size={20} color="var(--dim)" style={{ minWidth: '20px' }} />
            {isOpen && (
              <span style={{ color: 'var(--muted)', fontSize: '13px' }}>
                {item.label}
              </span>
            )}
          </div>
        ))}
      </nav>

      <div style={{ padding: '0 8px 8px' }}>
        <div
          className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg hover:bg-[#18181b]"
          onClick={handleLogout}
        >
          <div style={{ width: '22px', height: '22px', minWidth: '22px', borderRadius: '50%', background: '#27272a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: '600', color: 'var(--accent)' }}>
            VY
          </div>
          {isOpen && (
            <span style={{ color: 'var(--dim)', fontSize: '13px', whiteSpace: 'nowrap' }}>
              Logout
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default Sidebar