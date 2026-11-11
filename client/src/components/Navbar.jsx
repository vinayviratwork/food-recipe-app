import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ChefHat, Search, BookmarkCheck, PlusCircle, LogOut, LogIn, Menu, X, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import './Navbar.css'

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
    setMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="nav-inner container">
        <Link to="/" className="nav-brand" onClick={() => setMenuOpen(false)}>
          <ChefHat size={26} className="brand-icon" />
          <span className="brand-text">RecipeHub</span>
        </Link>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            Explore
          </Link>
          {isLoggedIn && (
            <>
              <Link to="/saved" className={`nav-link ${isActive('/saved') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                <BookmarkCheck size={16} /> Saved
              </Link>
              <Link to="/create" className="nav-btn-add" onClick={() => setMenuOpen(false)}>
                <PlusCircle size={16} /> Add Recipe
              </Link>
            </>
          )}
        </div>

        <div className="nav-right">
          {isLoggedIn ? (
            <div className="nav-user">
              <div className="user-avatar" title={user?.username}>
                {user?.username?.[0]?.toUpperCase() || <User size={16} />}
              </div>
              <button className="nav-logout" onClick={handleLogout} title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="nav-link-auth">Log in</Link>
              <Link to="/register" className="nav-btn-register">Sign up</Link>
            </div>
          )}
          <button className="hamburger" onClick={() => setMenuOpen(p => !p)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </nav>
  )
}
