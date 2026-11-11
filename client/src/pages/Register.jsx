import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff, ChefHat, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import './Auth.css'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.email || !form.password) { toast.error('Fill all fields'); return }
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return }
    setLoading(true)
    try {
      const res = await api.post('/auth/register', form)
      login(res.data.user, res.data.accessToken)
      toast.success(`Account created! Welcome, ${res.data.user.username}! 🎉`)
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <ChefHat size={32} />
          <span>RecipeHub</span>
        </div>
        <h1 className="auth-title">Create an account</h1>
        <p className="auth-sub">Join thousands of home chefs sharing their best recipes</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <div className="input-wrap">
              <User size={16} className="input-icon" />
              <input type="text" placeholder="yourname"
                value={form.username} onChange={e => update('username', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>Email address</label>
            <div className="input-wrap">
              <Mail size={16} className="input-icon" />
              <input type="email" placeholder="you@example.com"
                value={form.email} onChange={e => update('email', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>Password <span className="label-hint">(min 8 characters)</span></label>
            <div className="input-wrap">
              <Lock size={16} className="input-icon" />
              <input type={showPass ? 'text' : 'password'} placeholder="Create a strong password"
                value={form.password} onChange={e => update('password', e.target.value)} />
              <button type="button" className="toggle-pass" onClick={() => setShowPass(p => !p)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <><Loader2 size={16} className="spin" /> Creating account…</> : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  )
}
