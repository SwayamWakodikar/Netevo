import { Link } from 'react-router-dom'
import './AuthLayout.css'

const socialProofAvatars = [
  { initials: 'MC', color: 'var(--avatar-mc)' },
  { initials: 'DP', color: 'var(--avatar-dp)' },
  { initials: 'SK', color: 'var(--avatar-sk)' },
  { initials: 'NP', color: 'var(--avatar-np)' },
]

export default function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      {/* Left Panel — Branding */}
      <div className="auth-left">
        <div className="auth-left-content">
          <Link to="/" className="auth-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4L12 8L20 4V16L12 20L4 16V4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M12 8V20" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 4L12 8" stroke="currentColor" strokeWidth="2"/>
              <path d="M20 4L12 8" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>Notevo</span>
          </Link>

          <div className="auth-left-hero">
            <h1 className="auth-tagline">
              The workspace where<br />teams think together.
            </h1>
            <p className="auth-description">
              Docs, projects, and discussions in one fast, keyboard-driven app — built for engineering teams that ship.
            </p>
          </div>

          <div className="auth-social-proof">
            <div className="avatar-group">
              {socialProofAvatars.map((a, i) => (
                <div
                  key={i}
                  className="avatar avatar-sm"
                  style={{ backgroundColor: a.color }}
                >
                  {a.initials}
                </div>
              ))}
            </div>
            <span className="auth-trust-text">Trusted by 12,000+ teams worldwide</span>
          </div>
        </div>

        <footer className="auth-left-footer">
          <span>© 2026 Notevo, Inc.</span>
          <span className="auth-footer-sep">·</span>
          <span>SOC 2 Type II</span>
          <span className="auth-footer-sep">·</span>
          <span>GDPR</span>
        </footer>
      </div>

      {/* Right Panel — Form */}
      <div className="auth-right">
        <div className="auth-right-content">
          {children}
        </div>
      </div>
    </div>
  )
}
