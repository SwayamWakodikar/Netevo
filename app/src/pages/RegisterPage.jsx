import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import { useToast } from '../components/Toast'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../layouts/AuthLayout'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { signup, isAuthenticated } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)


  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !email || !password) {
      addToast('Please fill in all fields.', 'warning')
      return
    }
    if (password.length < 8) {
      addToast('Password must be at least 8 characters.', 'warning')
      return
    }

    setIsLoading(true)
    try {
      await signup({ email, username: name, password })
      addToast(`Account created for ${name}!`, 'success')
      navigate('/dashboard')
    } catch (error) {
      const message =
        error.response?.data?.error || 'Registration failed. Please try again.'
      addToast(message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    addToast('Google OAuth integration coming soon.', 'info')
  }

  const handleGitHubLogin = () => {
    addToast('GitHub OAuth integration coming soon.', 'info')
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-6 animate-[fadeInUp_0.5s_ease_both]">
        <div className="mb-1.5">
          <h2 className="text-[1.625rem] font-bold text-text-primary mb-1.5 tracking-[-0.01em]">Create your account</h2>
          <p className="text-sm text-text-muted">Get started in less than a minute.</p>
        </div>

        {/* OAuth Buttons */}
        <div className="flex flex-col gap-2">
          <button className="w-full flex items-center justify-center gap-2.5 px-4 py-[11px] text-sm font-medium rounded-md border border-border-default bg-transparent text-text-primary transition-all hover:bg-border-muted" type="button" onClick={handleGoogleLogin}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <button className="w-full flex items-center justify-center gap-2.5 px-4 py-[11px] text-sm font-medium rounded-md border border-border-default bg-transparent text-text-primary transition-all hover:bg-border-muted" type="button" onClick={handleGitHubLogin}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            Continue with GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center text-center text-xs text-text-faint uppercase tracking-wider my-2 before:content-[''] before:flex-1 before:border-b before:border-border-muted before:mr-4 after:content-[''] after:flex-1 after:border-b after:border-border-muted after:ml-4">
          <span>OR</span>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="register-name" className="text-[0.8125rem] font-medium text-text-secondary">Username</label>
            <input
              id="register-name"
              type="text"
              className="w-full bg-bg-elevated border border-border-default rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-faint transition-colors focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:outline-none"
              placeholder="janedoe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="register-email" className="text-[0.8125rem] font-medium text-text-secondary">Work email</label>
            <div className="relative flex items-center">
              <Mail size={16} className="absolute left-3 text-text-muted pointer-events-none" />
              <input
                id="register-email"
                type="email"
                className="w-full bg-bg-elevated border border-border-default rounded-md px-3 py-2 pl-9 text-sm text-text-primary placeholder:text-text-faint transition-colors focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:outline-none"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="register-password" className="text-[0.8125rem] font-medium text-text-secondary">Password</label>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-3 text-text-muted pointer-events-none" />
              <input
                id="register-password"
                type="password"
                className="w-full bg-bg-elevated border border-border-default rounded-md px-3 py-2 pl-9 text-sm text-text-primary placeholder:text-text-faint transition-colors focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-text-faint">Must be at least 8 characters</p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[0.9375rem] font-medium rounded-md bg-accent-primary text-white shadow-sm transition-all hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Creating account…
              </>
            ) : (
              <>
                Create account <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-[0.8125rem] text-text-muted mt-1">
          Already have an account?{' '}
          <Link to="/login" className="text-text-primary font-semibold transition-colors hover:text-accent-hover">Sign in</Link>
        </p>

        <p className="text-center text-xs text-text-faint leading-relaxed">
          By continuing you agree to Netevo's{' '}
          <a href="#" className="text-text-muted underline underline-offset-2 transition-colors hover:text-text-primary" onClick={(e) => { e.preventDefault(); addToast('Terms of Service page coming soon.', 'info') }}>Terms</a> and{' '}
          <a href="#" className="text-text-muted underline underline-offset-2 transition-colors hover:text-text-primary" onClick={(e) => { e.preventDefault(); addToast('Privacy Policy page coming soon.', 'info') }}>Privacy Policy</a>.
        </p>
      </div>
    </AuthLayout>
  )
}
