import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, User } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { BRAND } from '../constants/branding'

export default function Header({ user }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <header 
      className="sticky top-0 z-50 bg-black border-b-[5px]"
      style={{ borderBottomColor: BRAND.colors.gold1 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-black text-xl shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${BRAND.colors.gold2}, ${BRAND.colors.gold1})`,
              boxShadow: `0 0 20px ${BRAND.colors.gold1}80`
            }}
          >
            V
          </div>
          <div>
            <div className="font-bold text-white" style={{ fontFamily: BRAND.fonts.heading }}>
              VIS
            </div>
            <div className="text-[10px]" style={{ color: BRAND.colors.gold1 }}>
              ACADEMY
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 items-center">
          <Link to="/" className="text-white hover:text-gold1 transition" style={{ color: 'white' }}>
            Home
          </Link>
          <Link to="/courses" className="text-white hover:text-gold1 transition" style={{ color: 'white' }}>
            Courses
          </Link>
          <Link to="/dashboard" className="text-white hover:text-gold1 transition" style={{ color: 'white' }}>
            Dashboard
          </Link>
          {user && (
            <Link to="/instructor" className="text-white hover:text-gold1 transition" style={{ color: 'white' }}>
              Teach
            </Link>
          )}
          {user?.user_metadata?.role === 'admin' && (
            <Link to="/admin" className="text-white hover:text-gold1 transition" style={{ color: 'white' }}>
              Admin
            </Link>
          )}
        </nav>

        {/* Auth Section */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <User size={20} style={{ color: BRAND.colors.gold1 }} />
              <span className="text-white text-sm">{user.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-[50px] text-black font-semibold border-2 white transition"
                style={{
                  background: `linear-gradient(135deg, ${BRAND.colors.goldDark}, ${BRAND.colors.gold2})`,
                  borderColor: BRAND.colors.white
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="px-6 py-2 rounded-[50px] text-black font-semibold border-2 white transition"
              style={{
                background: `linear-gradient(135deg, ${BRAND.colors.goldDark}, ${BRAND.colors.gold2})`,
                borderColor: BRAND.colors.white
              }}
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div 
          className="md:hidden bg-black border-t-[2px] p-4"
          style={{ borderTopColor: BRAND.colors.gold1 }}
        >
          <nav className="flex flex-col gap-4">
            <Link to="/" className="text-white" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link to="/courses" className="text-white" onClick={() => setMenuOpen(false)}>
              Courses
            </Link>
            <Link to="/dashboard" className="text-white" onClick={() => setMenuOpen(false)}>
              Dashboard
            </Link>
            {user && (
              <Link to="/instructor" className="text-white" onClick={() => setMenuOpen(false)}>
                Teach
              </Link>
            )}
            {!user ? (
              <Link to="/auth" className="text-white" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
            ) : (
              <button onClick={handleLogout} className="text-white text-left">
                Logout
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
