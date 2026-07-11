import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Users, FileText, Shield, Command, Globe, Lightbulb } from 'lucide-react'
import { useToast } from '../components/Toast'

const features = [
  {
    icon: FileText,
    title: 'Docs & Specs',
    description: 'Write technical specs, RFCs, and meeting notes with real-time collaboration and version history.',
  },
  {
    icon: Users,
    title: 'Team Workspaces',
    description: 'Organize by team — Engineering, Design, Product. Each workspace has its own docs, tasks, and discussions.',
  },
  {
    icon: Command,
    title: 'Keyboard-First',
    description: 'Navigate, create, and edit with blazing-fast keyboard shortcuts. Built for developers who never touch the mouse.',
  },
  {
    icon: Zap,
    title: 'Real-Time Sync',
    description: 'Sub-50ms sync across all editors. See who is typing, where cursors are, and merge conflicts automatically.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'SOC 2 Type II certified. SSO, SCIM provisioning, audit logs, and data residency controls.',
  },
  {
    icon: Globe,
    title: 'API-First Platform',
    description: 'RESTful APIs, webhooks, and CLI tools. Integrate Netevo into your existing CI/CD and developer workflows.',
  },
]

const socialProofAvatars = [
  { initials: 'MC', color: 'var(--color-avatar-mc)' },
  { initials: 'DP', color: 'var(--color-avatar-dp)' },
  { initials: 'SK', color: 'var(--color-avatar-sk)' },
  { initials: 'NP', color: 'var(--color-avatar-np)' },
]

const companyLogos = ['Linear', 'Vercel', 'Supabase', 'Railway', 'Planetscale']

export default function LandingPage() {
  const { addToast } = useToast()

  const handleNavClick = (e, label) => {
    if (label === 'Features') return // let it scroll naturally
    e.preventDefault()
    addToast(`${label} page coming soon.`, 'info')
  }

  const handleFooterLink = (e, label) => {
    e.preventDefault()
    addToast(`${label} page coming soon.`, 'info')
  }

  return (
    <div 
      className="min-h-screen text-text-primary"
      style={{
        background: `
          repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.025) 0px, rgba(255, 255, 255, 0.025) 1px, transparent 1px, transparent 40px),
          repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.025) 0px, rgba(255, 255, 255, 0.025) 1px, transparent 1px, transparent 40px),
          var(--color-bg-primary)
        `
      }}
    >
      {/* ---- Navbar ---- */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[rgba(13,17,23,0.8)] backdrop-blur-md border-b border-border-muted">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 py-3.5">
          <Link to="/" className="inline-flex items-center gap-2 text-base font-semibold text-text-primary transition-opacity duration-150 hover:opacity-80 [&>svg]:text-text-muted">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4L12 8L20 4V16L12 20L4 16V4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M12 8V20" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 4L12 8" stroke="currentColor" strokeWidth="2"/>
              <path d="M20 4L12 8" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>Netevo</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[0.8125rem] font-medium text-text-muted transition-colors py-1 hover:text-text-primary" onClick={(e) => handleNavClick(e, 'Features')}>Features</a>
            <a href="#" className="text-[0.8125rem] font-medium text-text-muted transition-colors py-1 hover:text-text-primary" onClick={(e) => handleNavClick(e, 'Security')}>Security</a>
            <a href="#" className="text-[0.8125rem] font-medium text-text-muted transition-colors py-1 hover:text-text-primary" onClick={(e) => handleNavClick(e, 'Pricing')}>Pricing</a>
            <a href="#" className="text-[0.8125rem] font-medium text-text-muted transition-colors py-1 hover:text-text-primary" onClick={(e) => handleNavClick(e, 'Docs')}>Docs</a>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/login" className="inline-flex items-center justify-center font-medium rounded-md transition-colors whitespace-nowrap text-sm text-text-primary hover:bg-bg-elevated px-4 py-2">Sign in</Link>
            <Link to="/register" className="inline-flex items-center justify-center font-medium rounded-md transition-colors whitespace-nowrap text-sm gap-2 bg-accent-primary text-white hover:bg-accent-hover shadow-sm px-4 py-2">
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ---- Hero Section ---- */}
      <section className="relative px-6 pt-40 pb-20 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(124,92,191,0.12)_0%,rgba(124,92,191,0.04)_40%,transparent_70%)] pointer-events-none" />
        <div className="relative max-w-[720px] mx-auto">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-border-default bg-bg-secondary text-xs font-medium text-text-secondary mb-8 animate-[fadeInUp_0.6s_ease_both]">
            <Zap size={14} className="text-status-orange" />
            <span>Now with real-time CRDT sync</span>
          </div>

          <h1 className="text-4xl md:text-[3.5rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-text-primary mb-6 animate-[fadeInUp_0.7s_ease_0.1s_both]">
            The workspace where<br />
            <span className="bg-clip-text text-transparent bg-[linear-gradient(135deg,#c9a0ff_0%,#7c5cbf_50%,#58a6ff_100%)]">teams think together.</span>
          </h1>

          <p className="text-lg leading-[1.7] text-text-muted max-w-[540px] mx-auto mb-8 animate-[fadeInUp_0.7s_ease_0.2s_both]">
            Docs, projects, and discussions in one fast, keyboard-driven
            app — built for engineering teams that ship.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12 animate-[fadeInUp_0.7s_ease_0.3s_both]">
            <Link to="/register" className="w-full md:w-auto inline-flex items-center justify-center font-medium rounded-md transition-colors whitespace-nowrap bg-accent-primary text-white hover:bg-accent-hover shadow-sm px-6 py-3 text-[0.9375rem] gap-2.5">
              Start for free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="w-full md:w-auto inline-flex items-center justify-center font-medium rounded-md transition-colors whitespace-nowrap border border-border-default bg-transparent text-text-primary hover:bg-border-muted px-6 py-3 text-[0.9375rem]">
              Sign in to workspace
            </Link>
          </div>

          <div className="flex items-center justify-center gap-4 animate-[fadeInUp_0.7s_ease_0.4s_both]">
            <div className="flex -space-x-2 overflow-hidden">
              {socialProofAvatars.map((a, i) => (
                <div
                  key={i}
                  className="flex h-8 w-8 rounded-full ring-2 ring-bg-primary text-xs items-center justify-center font-medium text-white"
                  style={{ backgroundColor: a.color }}
                >
                  {a.initials}
                </div>
              ))}
            </div>
            <span className="text-[0.8125rem] text-text-faint">Trusted by 12,000+ teams worldwide</span>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="max-w-[960px] mx-auto mt-16 perspective-1000 animate-[fadeInUp_0.8s_ease_0.5s_both]">
          <div className="rounded-xl border border-border-default bg-bg-secondary overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.6),0_0_80px_rgba(124,92,191,0.08)]">
            <div className="flex items-center gap-4 px-4 py-3 bg-bg-tertiary border-b border-border-muted">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-status-red" />
                <span className="w-2.5 h-2.5 rounded-full bg-status-orange" />
                <span className="w-2.5 h-2.5 rounded-full bg-status-green" />
              </div>
              <span className="text-xs text-text-faint">Netevo — Q2 Platform Roadmap</span>
            </div>
            <div className="flex min-h-[320px]">
              <div className="hidden md:flex flex-col gap-0.5 w-[200px] border-r border-border-muted p-4">
                <div className="flex items-center gap-2 px-2.5 py-2 rounded-md text-xs bg-bg-elevated text-text-primary transition-all">
                  <FileText size={14} />
                  <span>Q2 Roadmap</span>
                </div>
                <div className="flex items-center gap-2 px-2.5 py-2 rounded-md text-xs text-text-muted transition-all">
                  <FileText size={14} />
                  <span>RFC: Collab Engine</span>
                </div>
                <div className="flex items-center gap-2 px-2.5 py-2 rounded-md text-xs text-text-muted transition-all">
                  <FileText size={14} />
                  <span>Weekly Sync</span>
                </div>
                <div className="flex items-center gap-2 px-2.5 py-2 rounded-md text-xs text-text-muted transition-all">
                  <FileText size={14} />
                  <span>Design Tokens v3</span>
                </div>
              </div>
              <div className="flex-1 p-6 md:p-8 text-left">
                <h3 className="text-xl font-bold mb-2 text-text-primary">Q2 Platform Roadmap</h3>
                <p className="text-xs text-text-faint mb-6">Maya Chen · Updated 2h ago · 3 editing now</p>
                <div className="h-3 bg-bg-elevated rounded w-full mb-2" />
                <div className="h-3 bg-bg-elevated rounded w-[60%] mb-2" />
                <div className="flex items-start gap-2 p-4 bg-[rgba(210,153,34,0.08)] border-l-[3px] border-status-orange rounded-r-md my-4 text-[0.8125rem] text-text-secondary">
                  <span><Lightbulb size={16} /></span>
                  <span>Anchor decisions on measurable outcomes.</span>
                </div>
                <div className="h-3 bg-bg-elevated rounded w-full mb-2" />
                <div className="h-3 bg-bg-elevated rounded w-[80%] mb-2" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Logos Section ---- */}
      <section className="px-6 py-16 text-center border-y border-border-muted">
        <p className="text-[0.8125rem] text-text-faint uppercase tracking-[0.08em] mb-8">Trusted by engineering teams at</p>
        <div className="flex items-center justify-center gap-12 flex-wrap">
          {companyLogos.map((name) => (
            <div key={name} className="text-lg font-bold text-text-faint tracking-[0.02em] opacity-50 transition-opacity hover:opacity-80">{name}</div>
          ))}
        </div>
      </section>

      {/* ---- Features Section ---- */}
      <section className="max-w-[1200px] mx-auto px-6 py-24" id="features">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-[2.25rem] font-extrabold tracking-[-0.02em] mb-4 text-text-primary">Everything your team needs</h2>
          <p className="text-[1.0625rem] text-text-muted max-w-[520px] mx-auto leading-[1.65]">
            A single workspace for docs, specs, tasks, and discussions. No more context-switching between five apps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <div 
                key={i} 
                className="p-8 rounded-xl border border-border-muted bg-bg-secondary transition-all duration-250 animate-[fadeInUp_0.6s_ease_both] hover:border-border-default hover:bg-bg-tertiary hover:-translate-y-1 hover:shadow-lg"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-11 h-11 flex items-center justify-center rounded-md bg-[rgba(124,92,191,0.1)] text-accent-primary mb-4">
                  <Icon size={22} />
                </div>
                <h3 className="text-base font-semibold mb-2 text-text-primary">{feature.title}</h3>
                <p className="text-[0.8125rem] leading-[1.6] text-text-muted">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ---- CTA Section ---- */}
      <section className="relative px-6 py-24 text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(124,92,191,0.12)_0%,transparent_70%)] pointer-events-none" />
        <div className="relative">
          <h2 className="text-[2.5rem] font-extrabold tracking-[-0.02em] mb-4">Ready to ship faster?</h2>
          <p className="text-[1.0625rem] text-text-muted mb-8">
            Join 12,000+ engineering teams who replaced their doc chaos with Netevo.
          </p>
          <div className="flex justify-center">
            <Link to="/register" className="inline-flex items-center justify-center font-medium rounded-md transition-colors whitespace-nowrap bg-accent-primary text-white hover:bg-accent-hover shadow-sm px-6 py-3 text-[0.9375rem] gap-2.5">
              Get started for free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="max-w-[1200px] mx-auto border-t border-border-muted pt-16 px-6 pb-8">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
          <div className="max-w-[280px]">
            <Link to="/" className="inline-flex items-center gap-2 text-base font-semibold text-text-primary transition-opacity duration-150 hover:opacity-80 [&>svg]:text-text-muted mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4L12 8L20 4V16L12 20L4 16V4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M12 8V20" stroke="currentColor" strokeWidth="2"/>
                <path d="M4 4L12 8" stroke="currentColor" strokeWidth="2"/>
                <path d="M20 4L12 8" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>Netevo</span>
            </Link>
            <p className="text-[0.8125rem] text-text-faint leading-[1.6]">The workspace where teams think together.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-12">
            <div className="flex flex-col gap-2">
              <h4 className="text-[0.8125rem] font-semibold text-text-secondary mb-1">Product</h4>
              <a href="#" className="text-[0.8125rem] text-text-faint transition-colors hover:text-text-primary" onClick={(e) => handleFooterLink(e, 'Features')}>Features</a>
              <a href="#" className="text-[0.8125rem] text-text-faint transition-colors hover:text-text-primary" onClick={(e) => handleFooterLink(e, 'Security')}>Security</a>
              <a href="#" className="text-[0.8125rem] text-text-faint transition-colors hover:text-text-primary" onClick={(e) => handleFooterLink(e, 'Pricing')}>Pricing</a>
              <a href="#" className="text-[0.8125rem] text-text-faint transition-colors hover:text-text-primary" onClick={(e) => handleFooterLink(e, 'Changelog')}>Changelog</a>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-[0.8125rem] font-semibold text-text-secondary mb-1">Company</h4>
              <a href="#" className="text-[0.8125rem] text-text-faint transition-colors hover:text-text-primary" onClick={(e) => handleFooterLink(e, 'About')}>About</a>
              <a href="#" className="text-[0.8125rem] text-text-faint transition-colors hover:text-text-primary" onClick={(e) => handleFooterLink(e, 'Blog')}>Blog</a>
              <a href="#" className="text-[0.8125rem] text-text-faint transition-colors hover:text-text-primary" onClick={(e) => handleFooterLink(e, 'Careers')}>Careers</a>
              <a href="#" className="text-[0.8125rem] text-text-faint transition-colors hover:text-text-primary" onClick={(e) => handleFooterLink(e, 'Contact')}>Contact</a>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-[0.8125rem] font-semibold text-text-secondary mb-1">Legal</h4>
              <a href="#" className="text-[0.8125rem] text-text-faint transition-colors hover:text-text-primary" onClick={(e) => handleFooterLink(e, 'Terms')}>Terms</a>
              <a href="#" className="text-[0.8125rem] text-text-faint transition-colors hover:text-text-primary" onClick={(e) => handleFooterLink(e, 'Privacy')}>Privacy</a>
              <a href="#" className="text-[0.8125rem] text-text-faint transition-colors hover:text-text-primary" onClick={(e) => handleFooterLink(e, 'DPA')}>DPA</a>
              <a href="#" className="text-[0.8125rem] text-text-faint transition-colors hover:text-text-primary" onClick={(e) => handleFooterLink(e, 'GDPR')}>GDPR</a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-2 pt-8 border-t border-border-muted text-xs text-text-faint text-center md:text-left">
          <span>© 2026 Netevo, Inc. All rights reserved.</span>
          <div className="flex items-center gap-2">
            <span>SOC 2 Type II</span>
            <span className="text-border-default">·</span>
            <span>GDPR</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
