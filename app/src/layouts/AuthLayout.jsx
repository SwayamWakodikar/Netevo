import { Link } from 'react-router-dom'

const socialProofAvatars = [
  { initials: 'MC', color: 'var(--color-avatar-mc)' },
  { initials: 'DP', color: 'var(--color-avatar-dp)' },
  { initials: 'SK', color: 'var(--color-avatar-sk)' },
  { initials: 'NP', color: 'var(--color-avatar-np)' },
]

export default function AuthLayout({ children }) {
  return (
    <div className="flex flex-col min-[900px]:flex-row h-screen overflow-hidden bg-bg-primary">
      {/* Left Panel — Branding */}
      <div 
        className="flex-1 flex flex-col justify-between p-8 pb-6 min-[900px]:p-12 min-[900px]:pb-8 relative overflow-hidden animate-[fadeIn_0.6s_ease] before:content-[''] before:absolute before:-top-[120px] before:-left-[120px] before:w-[400px] before:h-[400px] before:bg-[radial-gradient(circle,rgba(88,166,255,0.1)_0%,rgba(88,166,255,0.03)_40%,transparent_70%)] before:pointer-events-none after:content-[''] after:absolute after:-bottom-[150px] after:-right-[100px] after:w-[450px] after:h-[450px] after:bg-[radial-gradient(circle,rgba(124,92,191,0.12)_0%,rgba(124,92,191,0.03)_40%,transparent_70%)] after:pointer-events-none"
        style={{
          background: `
            repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.03) 0px, rgba(255, 255, 255, 0.03) 1px, transparent 1px, transparent 60px),
            repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.03) 0px, rgba(255, 255, 255, 0.03) 1px, transparent 1px, transparent 60px),
            linear-gradient(160deg, #0f1523 0%, #111827 30%, #0f1420 60%, #111320 100%)
          `
        }}
      >
        <div className="flex flex-col justify-center flex-1 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-base font-semibold text-text-primary mb-16 transition-opacity duration-150 hover:opacity-80 [&>svg]:text-text-muted">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4L12 8L20 4V16L12 20L4 16V4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M12 8V20" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 4L12 8" stroke="currentColor" strokeWidth="2"/>
              <path d="M20 4L12 8" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>Netevo</span>
          </Link>

          <div className="animate-[fadeInUp_0.7s_ease_0.1s_both] max-[900px]:mb-6">
            <h1 className="text-[2.75rem] max-[900px]:text-[1.75rem] font-bold leading-[1.15] text-[rgba(240,246,252,0.45)] tracking-[-0.02em] mb-6">
              The workspace where<br />teams think together.
            </h1>
            <p className="text-[0.9375rem] leading-[1.65] text-[rgba(240,246,252,0.4)] max-w-[420px]">
              Docs, projects, and discussions in one fast, keyboard-driven app — built for engineering teams that ship.
            </p>
          </div>

          <div className="flex items-center gap-4 mt-12 animate-[fadeInUp_0.7s_ease_0.3s_both]">
            <div className="flex -space-x-2 overflow-hidden">
              {socialProofAvatars.map((a, i) => (
                <div
                  key={i}
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-bg-primary text-xs flex items-center justify-center font-medium text-white"
                  style={{ backgroundColor: a.color }}
                >
                  {a.initials}
                </div>
              ))}
            </div>
            <span className="text-[0.8125rem] text-[rgba(240,246,252,0.35)]">Trusted by 12,000+ teams worldwide</span>
          </div>
        </div>

        <footer className="flex items-center gap-2 text-xs text-[rgba(240,246,252,0.25)] animate-[fadeIn_0.7s_ease_0.5s_both]">
          <span>© 2026 Netevo, Inc.</span>
          <span className="text-[rgba(240,246,252,0.15)]">·</span>
          <span>SOC 2 Type II</span>
          <span className="text-[rgba(240,246,252,0.15)]">·</span>
          <span>GDPR</span>
        </footer>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full min-[900px]:w-[480px] min-[900px]:min-w-[480px] flex items-center justify-center p-8 min-[900px]:p-12 bg-bg-secondary min-[900px]:border-l border-border-muted animate-[slideInRight_0.5s_ease_0.15s_both]">
        <div className="w-full max-w-[380px]">
          {children}
        </div>
      </div>
    </div>
  )
}
