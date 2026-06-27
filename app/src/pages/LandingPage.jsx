import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Users, FileText, Shield, Command, Globe } from 'lucide-react'
import { useToast } from '../components/Toast'
import './LandingPage.css'

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
    description: 'RESTful APIs, webhooks, and CLI tools. Integrate Notevo into your existing CI/CD and developer workflows.',
  },
]

const socialProofAvatars = [
  { initials: 'MC', color: 'var(--avatar-mc)' },
  { initials: 'DP', color: 'var(--avatar-dp)' },
  { initials: 'SK', color: 'var(--avatar-sk)' },
  { initials: 'NP', color: 'var(--avatar-np)' },
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
    <div className="landing">
      {/* ---- Navbar ---- */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <Link to="/" className="landing-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4L12 8L20 4V16L12 20L4 16V4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M12 8V20" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 4L12 8" stroke="currentColor" strokeWidth="2"/>
              <path d="M20 4L12 8" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>Notevo</span>
          </Link>

          <div className="landing-nav-links">
            <a href="#features" className="nav-link" onClick={(e) => handleNavClick(e, 'Features')}>Features</a>
            <a href="#" className="nav-link" onClick={(e) => handleNavClick(e, 'Security')}>Security</a>
            <a href="#" className="nav-link" onClick={(e) => handleNavClick(e, 'Pricing')}>Pricing</a>
            <a href="#" className="nav-link" onClick={(e) => handleNavClick(e, 'Docs')}>Docs</a>
          </div>

          <div className="landing-nav-actions">
            <Link to="/login" className="btn btn-ghost">Sign in</Link>
            <Link to="/register" className="btn btn-primary">
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ---- Hero Section ---- */}
      <section className="hero-section">
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-badge">
            <Zap size={14} />
            <span>Now with real-time CRDT sync</span>
          </div>

          <h1 className="hero-title">
            The workspace where<br />
            <span className="hero-title-accent">teams think together.</span>
          </h1>

          <p className="hero-subtitle">
            Docs, projects, and discussions in one fast, keyboard-driven
            app — built for engineering teams that ship.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Start for free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">
              Sign in to workspace
            </Link>
          </div>

          <div className="hero-social-proof">
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
            <span className="hero-trust-text">Trusted by 12,000+ teams worldwide</span>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="hero-preview">
          <div className="preview-window">
            <div className="preview-topbar">
              <div className="preview-dots">
                <span /><span /><span />
              </div>
              <span className="preview-title">Notevo — Q2 Platform Roadmap</span>
            </div>
            <div className="preview-body">
              <div className="preview-sidebar">
                <div className="preview-sidebar-item active">
                  <FileText size={14} />
                  <span>Q2 Roadmap</span>
                </div>
                <div className="preview-sidebar-item">
                  <FileText size={14} />
                  <span>RFC: Collab Engine</span>
                </div>
                <div className="preview-sidebar-item">
                  <FileText size={14} />
                  <span>Weekly Sync</span>
                </div>
                <div className="preview-sidebar-item">
                  <FileText size={14} />
                  <span>Design Tokens v3</span>
                </div>
              </div>
              <div className="preview-content">
                <h3>Q2 Platform Roadmap</h3>
                <p className="preview-meta">Maya Chen · Updated 2h ago · 3 editing now</p>
                <div className="preview-text-block" />
                <div className="preview-text-block short" />
                <div className="preview-callout">
                  <span>💡</span>
                  <span>Anchor decisions on measurable outcomes.</span>
                </div>
                <div className="preview-text-block" />
                <div className="preview-text-block medium" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Logos Section ---- */}
      <section className="logos-section">
        <p className="logos-label">Trusted by engineering teams at</p>
        <div className="logos-grid">
          {companyLogos.map((name) => (
            <div key={name} className="logo-item">{name}</div>
          ))}
        </div>
      </section>

      {/* ---- Features Section ---- */}
      <section className="features-section" id="features">
        <div className="features-header">
          <h2 className="section-title">Everything your team needs</h2>
          <p className="section-subtitle">
            A single workspace for docs, specs, tasks, and discussions. No more context-switching between five apps.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <div key={i} className="feature-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="feature-icon">
                  <Icon size={22} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ---- CTA Section ---- */}
      <section className="cta-section">
        <div className="cta-glow" />
        <div className="cta-content">
          <h2 className="cta-title">Ready to ship faster?</h2>
          <p className="cta-subtitle">
            Join 12,000+ engineering teams who replaced their doc chaos with Notevo.
          </p>
          <div className="cta-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Get started for free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <Link to="/" className="landing-logo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4L12 8L20 4V16L12 20L4 16V4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M12 8V20" stroke="currentColor" strokeWidth="2"/>
                <path d="M4 4L12 8" stroke="currentColor" strokeWidth="2"/>
                <path d="M20 4L12 8" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>Notevo</span>
            </Link>
            <p className="footer-brand-desc">The workspace where teams think together.</p>
          </div>

          <div className="footer-links-group">
            <div className="footer-col">
              <h4>Product</h4>
              <a href="#" onClick={(e) => handleFooterLink(e, 'Features')}>Features</a>
              <a href="#" onClick={(e) => handleFooterLink(e, 'Security')}>Security</a>
              <a href="#" onClick={(e) => handleFooterLink(e, 'Pricing')}>Pricing</a>
              <a href="#" onClick={(e) => handleFooterLink(e, 'Changelog')}>Changelog</a>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <a href="#" onClick={(e) => handleFooterLink(e, 'About')}>About</a>
              <a href="#" onClick={(e) => handleFooterLink(e, 'Blog')}>Blog</a>
              <a href="#" onClick={(e) => handleFooterLink(e, 'Careers')}>Careers</a>
              <a href="#" onClick={(e) => handleFooterLink(e, 'Contact')}>Contact</a>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <a href="#" onClick={(e) => handleFooterLink(e, 'Terms')}>Terms</a>
              <a href="#" onClick={(e) => handleFooterLink(e, 'Privacy')}>Privacy</a>
              <a href="#" onClick={(e) => handleFooterLink(e, 'DPA')}>DPA</a>
              <a href="#" onClick={(e) => handleFooterLink(e, 'GDPR')}>GDPR</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Notevo, Inc. All rights reserved.</span>
          <div className="footer-bottom-links">
            <span>SOC 2 Type II</span>
            <span className="footer-sep">·</span>
            <span>GDPR</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
