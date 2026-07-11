import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, Inbox, Sparkles, FilePlus, Star, ChevronDown, ChevronRight,
  Hash, FileText, File, MoreHorizontal, MessageSquare, Clock,
  Users, Trash2, HelpCircle, Plus, SlidersHorizontal, Share2, Bookmark,
  ArrowUpRight, CheckSquare, Square, X, LogOut, Settings, Copy, Check,
  RotateCcw, Download, Files, Trash, Send, Bot, User, Keyboard,
  ArrowDown, ArrowUp, Navigation, Edit2, LayoutDashboard,
  Lightbulb, Target, Palette, BarChart, AlertCircle
} from 'lucide-react'
import { useToast } from '../components/Toast'
import { useAuth } from '../context/AuthContext'

/* ================================================================
   DUMMY DATA
   ================================================================ */

const initialDocs = {
  1: {
    title: 'Q2 Platform Roadmap',
    breadcrumb: ['Product', 'Q2 Platform Roadmap'],
    author: { initials: 'MC', color: 'var(--avatar-mc)', name: 'Maya Chen' },
    updatedAgo: '2h ago', editingNow: 3,
    content: [
      { type: 'paragraph', text: 'This document captures the strategic priorities for the platform team in Q2. We focus on three pillars: reliability, developer velocity, and customer-facing performance.' },
      { type: 'callout', icon: <Lightbulb size={20} />, text: 'Anchor decisions on measurable outcomes, not feature counts. Every initiative should have a single owner and a 6-week target.' },
      { type: 'heading', text: 'Pillar 1 — Reliability' },
      { type: 'bullet', text: 'Reduce p99 sync latency below 120ms across all regions.' },
      { type: 'bullet', text: 'Migrate the connection pool to per-region pgbouncer instances.' },
      { type: 'check', text: 'Define SLO + alerting for the new sync engine', checked: true, id: 'c1' },
      { type: 'check', text: 'Run a regional failover game day', checked: false, id: 'c2' },
      { type: 'heading', text: 'Pillar 2 — Developer velocity' },
      { type: 'paragraph', text: 'We will ship a unified internal CLI to standardize service bootstrapping, deploys, and observability — replacing four disparate tools.' },
      { type: 'check', text: 'Ship structured logging across all services', checked: true, id: 'c3' },
      { type: 'heading', text: 'Pillar 3 — Customer-facing performance' },
      { type: 'paragraph', text: 'Target: 50% reduction in time-to-interactive for the doc editor. Key metrics: LCP under 1.2s, FID under 100ms, CLS under 0.05.' },
      { type: 'check', text: 'Audit and tree-shake icon library (currently 340KB)', checked: false, id: 'c4' },
    ],
  },
  2: {
    title: 'RFC: Real-time Collaboration Engine',
    breadcrumb: ['Engineering', 'RFC: Real-time Collaboration Engine'],
    author: { initials: 'DP', color: 'var(--avatar-dp)', name: 'David Park' },
    updatedAgo: '6h ago', editingNow: 1,
    content: [
      { type: 'paragraph', text: 'This RFC proposes migrating presence and CRDT state from the monolith to a dedicated edge service, targeting sub-50ms sync latency globally.' },
      { type: 'callout', icon: <Target size={20} />, text: "Goal: every keystroke from one user should appear on a collaborator's screen within 50ms, regardless of region." },
      { type: 'heading', text: 'Background' },
      { type: 'paragraph', text: 'Our current collaboration stack runs on a single WebSocket gateway in us-east-1. Users in APAC and EMEA experience 200–400ms round-trip latency.' },
      { type: 'heading', text: 'Proposed Architecture' },
      { type: 'bullet', text: 'Deploy Cloudflare Durable Objects for per-document CRDT state.' },
      { type: 'bullet', text: 'Use Yjs as the CRDT library with a custom persistence adapter.' },
      { type: 'bullet', text: 'Route WebSocket connections to the nearest edge node via Anycast.' },
      { type: 'check', text: 'Prototype Durable Objects integration', checked: true, id: 'r1' },
      { type: 'check', text: 'Load test with 500 concurrent editors', checked: false, id: 'r2' },
      { type: 'heading', text: 'Risks & Mitigations' },
      { type: 'bullet', text: 'Cold start latency on Durable Objects — mitigated by keep-alive pings.' },
      { type: 'bullet', text: 'Data loss during failover — mitigated by write-ahead log to R2.' },
    ],
  },
  3: {
    title: 'Weekly Eng Sync — Apr 28',
    breadcrumb: ['Engineering', 'Weekly Eng Sync — Apr 28'],
    author: { initials: 'YO', color: 'var(--avatar-yo)', name: 'You' },
    updatedAgo: '1d ago', editingNow: 0,
    content: [
      { type: 'paragraph', text: 'Attendees: Maya, David, Sarah, You. Duration: 45 minutes.' },
      { type: 'heading', text: 'Incident Review' },
      { type: 'paragraph', text: 'The EU-west sync outage on Apr 25 was caused by connection pool exhaustion. Root cause analysis is complete.' },
      { type: 'check', text: 'Increase pgbouncer max connections to 200', checked: true, id: 'w1' },
      { type: 'check', text: 'Add connection pool monitoring dashboard', checked: true, id: 'w2' },
      { type: 'heading', text: 'On-Call Rotation' },
      { type: 'bullet', text: 'This week: David (primary), Sarah (secondary).' },
      { type: 'bullet', text: 'Next week: You (primary), Maya (secondary).' },
      { type: 'heading', text: 'Release Train' },
      { type: 'paragraph', text: 'v2.14 is scheduled for May 2. Feature freeze is tomorrow (Apr 29).' },
      { type: 'check', text: 'Merge billing v2 PR before freeze', checked: false, id: 'w3' },
    ],
  },
  4: {
    title: 'Design tokens v3',
    breadcrumb: ['Design', 'Design tokens v3'],
    author: { initials: 'SK', color: 'var(--avatar-sk)', name: 'Sarah Kim' },
    updatedAgo: '1d ago', editingNow: 0,
    content: [
      { type: 'paragraph', text: 'Consolidate spacing, radii, and elevation across web, desktop, and mobile surfaces into a unified token system.' },
      { type: 'callout', icon: <Palette size={20} />, text: 'Design tokens are the single source of truth for visual style. Every component should reference tokens, not raw values.' },
      { type: 'heading', text: 'Token Categories' },
      { type: 'bullet', text: 'Spacing: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px.' },
      { type: 'bullet', text: 'Radius: sm (4px), md (8px), lg (12px), xl (16px), full (9999px).' },
      { type: 'check', text: 'Audit existing spacing values across platforms', checked: true, id: 'd1' },
      { type: 'check', text: 'Generate CSS custom properties from tokens', checked: false, id: 'd3' },
    ],
  },
  5: {
    title: 'Onboarding flow rewrite',
    breadcrumb: ['Product', 'Onboarding flow rewrite'],
    author: { initials: 'MC', color: 'var(--avatar-mc)', name: 'Maya Chen' },
    updatedAgo: '2d ago', editingNow: 0,
    content: [
      { type: 'paragraph', text: 'Goal: reduce time-to-first-doc from 4 minutes to under 60 seconds.' },
      { type: 'callout', icon: <BarChart size={20} />, text: '38% of new signups never create their first document. Our activation metric is broken.' },
      { type: 'heading', text: 'Proposed Flow' },
      { type: 'bullet', text: 'Step 1: Sign up (email or SSO) — 10 seconds.' },
      { type: 'bullet', text: 'Step 2: Choose workspace template — 15 seconds.' },
      { type: 'bullet', text: 'Step 3: Auto-generate first doc with AI — 5 seconds.' },
      { type: 'check', text: 'Design new onboarding wireframes', checked: true, id: 'o1' },
      { type: 'check', text: 'Implement SSO-first variant', checked: false, id: 'o3' },
    ],
  },
  6: {
    title: 'Incident postmortem — sync outage',
    breadcrumb: ['Engineering', 'Incident postmortem — sync outage'],
    author: { initials: 'DP', color: 'var(--avatar-dp)', name: 'David Park' },
    updatedAgo: '3d ago', editingNow: 0,
    content: [
      { type: 'paragraph', text: 'Incident duration: 47 minutes (Apr 25). Impact: ~2,400 users experienced sync failures in EU-west.' },
      { type: 'callout', icon: <AlertCircle size={20} />, text: 'Severity: SEV-1. Customer-facing impact with data sync delays. No data loss confirmed.' },
      { type: 'heading', text: 'Root Cause' },
      { type: 'paragraph', text: 'Connection pool exhaustion on the EU-west pgbouncer instance. A runaway migration script opened 150 connections.' },
      { type: 'heading', text: 'Timeline' },
      { type: 'bullet', text: '14:23 — Alerts fire for elevated 5xx rates in EU-west.' },
      { type: 'bullet', text: '14:35 — Root cause identified as connection pool exhaustion.' },
      { type: 'bullet', text: '15:10 — All metrics return to normal. Incident resolved.' },
      { type: 'heading', text: 'Action Items' },
      { type: 'check', text: 'Add connection pool usage to monitoring', checked: true, id: 'i1' },
      { type: 'check', text: 'Implement per-service connection limits', checked: false, id: 'i2' },
    ],
  },
}

const initialNotifications = [
  { id: 1, text: 'Maya Chen commented on Q2 Platform Roadmap: "Can we pull this forward to next week?"', time: '10m ago', read: false, noteId: 1 },
  { id: 2, text: 'David Park mentioned you in RFC: Collab Engine', time: '1h ago', read: false, noteId: 2 },
  { id: 3, text: 'Sarah Kim shared Design tokens v3 with you', time: '3h ago', read: false, noteId: 4 },
  { id: 6, text: 'Nate Patel requested edit access to Onboarding flow rewrite', time: '4h ago', read: false, noteId: 5 },
  { id: 7, text: 'You have 3 unresolved comments in Incident postmortem', time: '4h ago', read: false, noteId: 6 },
  { id: 8, text: 'Maya Chen updated the status of Q2 Platform Roadmap to In Progress', time: '6h ago', read: false, noteId: 1 },
  { id: 9, text: 'System: Weekly digest ready. Your team created 14 new documents.', time: '7h ago', read: false },
  { id: 10, text: 'David Park resolved your comment in RFC: Real-time Collaboration Engine', time: '8h ago', read: false, noteId: 2 },
  { id: 4, text: 'Build #2847 deployed successfully', time: '5h ago', read: true },
  { id: 5, text: 'Weekly Eng Sync starts in 30 minutes', time: '1d ago', read: true, noteId: 3 },
]

/* teamMembers is now derived from the logged-in user in the component */

const trashItems = [
  { id: 't1', title: 'Draft: API versioning strategy', deletedBy: 'You', deletedAgo: '2d ago' },
  { id: 't2', title: 'Old meeting notes — Mar 15', deletedBy: 'Maya Chen', deletedAgo: '5d ago' },
  { id: 't3', title: 'Deprecated: Auth flow v1', deletedBy: 'David Park', deletedAgo: '1w ago' },
]

const versionHistory = [
  { id: 'v1', author: 'Maya Chen', initials: 'MC', color: 'var(--avatar-mc)', time: '2h ago', changes: '+42 lines, -8 lines' },
  { id: 'v2', author: 'You', initials: 'YO', color: 'var(--avatar-yo)', time: '4h ago', changes: '+15 lines, -3 lines' },
  { id: 'v3', author: 'David Park', initials: 'DP', color: 'var(--avatar-dp)', time: '1d ago', changes: '+28 lines, -12 lines' },
  { id: 'v4', author: 'Sarah Kim', initials: 'SK', color: 'var(--avatar-sk)', time: '2d ago', changes: 'Created document' },
]

const dummyComments = [
  { id: 'cm1', author: 'Maya Chen', initials: 'MC', color: 'var(--avatar-mc)', time: '2h ago', text: 'I think we should prioritize the pgbouncer migration — it blocks the reliability pillar.' },
  { id: 'cm2', author: 'David Park', initials: 'DP', color: 'var(--avatar-dp)', time: '4h ago', text: 'Agreed. I can pick this up next sprint. Will need help from DevOps for the infra changes.' },
  { id: 'cm3', author: 'You', initials: 'YO', color: 'var(--avatar-yo)', time: '1d ago', text: 'Added the SLO definition to the appendix. Can someone review?' },
]

const aiResponses = [
  "Based on this document, the key priorities are:\n\n1. **Reliability** — Reduce p99 latency below 120ms\n2. **Developer velocity** — Ship unified CLI\n3. **Performance** — 50% TTI reduction\n\nWould you like me to create action items from these?",
  "I can help summarize the key risks:\n\n• Connection pool exhaustion (mitigated by per-region pgbouncer)\n• Cold start latency on edge nodes (mitigated by keep-alive)\n• Migration complexity (mitigated by phased rollout)\n\nShall I draft a risk register?",
  "Here's a suggested timeline based on the document:\n\n**Week 1-2:** Define SLOs and set up alerting\n**Week 3-4:** Begin pgbouncer migration\n**Week 5-6:** Ship CLI alpha and gather feedback\n\nWant me to create a Gantt chart?",
]

const keyboardShortcuts = [
  { category: 'Navigation', icon: Navigation, shortcuts: [
    { keys: ['⌘', 'K'], description: 'Open search' },
    { keys: ['⌘', 'N'], description: 'New document' },
    { keys: ['⌘', '⇧', 'P'], description: 'Command palette' },
    { keys: ['⌘', '/'], description: 'Toggle sidebar' },
  ]},
  { category: 'Editor', icon: Edit2, shortcuts: [
    { keys: ['⌘', 'S'], description: 'Save document' },
    { keys: ['⌘', 'B'], description: 'Bold text' },
    { keys: ['⌘', 'I'], description: 'Italic text' },
    { keys: ['⌘', 'E'], description: 'Inline code' },
    { keys: ['⌘', '⇧', 'X'], description: 'Strikethrough' },
  ]},
  { category: 'Blocks', icon: LayoutDashboard, shortcuts: [
    { keys: ['/', 'h1'], description: 'Heading 1' },
    { keys: ['/', 'todo'], description: 'Checklist' },
    { keys: ['/', 'callout'], description: 'Callout block' },
    { keys: ['/', 'code'], description: 'Code block' },
  ]},
]

/* Sidebar & notes data */
const sidebarFavorites = [
  { title: 'Q2 Platform Roadmap', noteId: 1 },
  { title: 'RFC: Real-time Collaboration...', noteId: 2 },
]

const initialWorkspaces = [
  { name: 'Product', color: '#da3633', expanded: false, children: [
    { title: 'Q2 Platform Roadmap', noteId: 1 }, { title: 'Onboarding flow rewrite', noteId: 5 },
  ]},
  { name: 'Engineering', color: '#58a6ff', expanded: true, children: [
    { title: 'RFC: Real-time Collaborati...', noteId: 2 }, { title: 'Weekly Eng Sync — Apr 28', noteId: 3 }, { title: 'Incident postmortem — sy...', noteId: 6 },
  ]},
  { name: 'Design', color: '#3fb950', expanded: false, children: [
    { title: 'Design tokens v3', noteId: 4 },
  ]},
  { name: 'Operations', color: '#bc8cff', expanded: false, children: [] },
]

const initialNotes = [
  { id: 1, title: 'Q2 Platform Roadmap', preview: 'Strategy for shipping the new sync engine, billing v2, and observability stack across...', tag: 'Product', time: '2h ago', avatar: { initials: 'MC', color: 'var(--avatar-mc)' }, icon: FileText },
  { id: 2, title: 'RFC: Real-time Collaboration Engine', preview: 'Proposal to migrate presence and CRDT state to a dedicated edge service with sub-50ms...', tag: 'Engineering', time: '6h ago', avatar: { initials: 'DP', color: 'var(--avatar-dp)' }, icon: FileText },
  { id: 3, title: 'Weekly Eng Sync — Apr 28', preview: 'Topics: incident review, on-call rotation, release train, hiring loop updates.', tag: 'Engineering', time: '1d ago', avatar: { initials: 'YO', color: 'var(--avatar-yo)' }, icon: Hash },
  { id: 4, title: 'Design tokens v3', preview: 'Consolidate spacing, radii, and elevation across web, desktop, and mobile surfaces.', tag: 'Design', time: '1d ago', avatar: { initials: 'SK', color: 'var(--avatar-sk)' }, icon: File },
  { id: 5, title: 'Onboarding flow rewrite', preview: 'Reduce time-to-first-doc to under 60 seconds. Test variants for SSO-first vs email.', tag: 'Product', time: '2d ago', avatar: { initials: 'MC', color: 'var(--avatar-mc)' }, icon: FileText },
  { id: 6, title: 'Incident postmortem — sync outage', preview: 'Root cause: connection pool exhaustion in EU-west. Action items assigned to platform team.', tag: 'Engineering', time: '3d ago', avatar: { initials: 'DP', color: 'var(--avatar-dp)' }, icon: FileText },
]

const filterTabs = ['All', 'Docs', 'Specs', 'Meetings', 'Tasks']
/* docCollaborators is now derived from the logged-in user in the component */

/* ================================================================
   DASHBOARD COMPONENT
   ================================================================ */
export default function DashboardPage() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { user, logout } = useAuth()


  const userInitials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || 'U'
  const userName = user?.username || user?.email || 'User'
  const userEmail = user?.email || ''
  const aiInputRef = useRef(null)

  // Core state
  const [activeFilter, setActiveFilter] = useState('All')
  const [activeNote, setActiveNote] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [starred, setStarred] = useState({ 1: true })
  const [workspaces, setWorkspaces] = useState(initialWorkspaces)
  const [docs, setDocs] = useState(initialDocs)
  const [notes, setNotes] = useState(initialNotes)
  const [notifications, setNotifications] = useState(initialNotifications)
  const [trash, setTrash] = useState(trashItems)
  const [comments, setComments] = useState(dummyComments)
  const [sortOrder, setSortOrder] = useState('newest')

  // Modal/panel state
  const [showSearch, setShowSearch] = useState(false)
  const [globalSearch, setGlobalSearch] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showInbox, setShowInbox] = useState(false)
  const [showMembers, setShowMembers] = useState(false)
  const [showTrash, setShowTrash] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showAI, setShowAI] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [showVersions, setShowVersions] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [showSort, setShowSort] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  // AI chat state
  const [aiMessages, setAiMessages] = useState([])
  const [aiInput, setAiInput] = useState('')
  const [aiTyping, setAiTyping] = useState(false)

  // New comment state
  const [newComment, setNewComment] = useState('')

  const currentDoc = docs[activeNote]
  const unreadCount = notifications.filter(n => !n.read).length

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setShowSearch(true) }
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') { e.preventDefault(); handleNewDoc() }
      if (e.key === 'Escape') { closeAllModals() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const closeAllModals = () => {
    setShowSearch(false); setShowInbox(false); setShowMembers(false)
    setShowTrash(false); setShowHelp(false); setShowAI(false)
    setShowComments(false); setShowVersions(false); setShowShare(false)
    setShowMore(false); setShowSort(false); setShowUserMenu(false)
  }

  /* ---- Document checkbox toggle ---- */
  const toggleCheck = useCallback((checkId) => {
    setDocs(prev => {
      const updated = { ...prev }
      const doc = { ...updated[activeNote] }
      doc.content = doc.content.map(item => item.id === checkId ? { ...item, checked: !item.checked } : item)
      updated[activeNote] = doc
      return updated
    })
  }, [activeNote])

  /* ---- Filter & sort notes ---- */
  const filteredNotes = notes
    .filter(note => {
      const matchesSearch = !searchQuery || note.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = activeFilter === 'All' ||
        (activeFilter === 'Docs' && note.icon === FileText) ||
        (activeFilter === 'Specs' && note.icon === File) ||
        (activeFilter === 'Meetings' && note.icon === Hash) ||
        (activeFilter === 'Tasks' && note.tag === 'Product')
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') return b.id - a.id < 0 ? -1 : 1
      if (sortOrder === 'oldest') return a.id - b.id < 0 ? -1 : 1
      if (sortOrder === 'title') return a.title.localeCompare(b.title)
      return 0
    })

  /* ---- Global search ---- */
  const searchResults = globalSearch
    ? notes.filter(n => n.title.toLowerCase().includes(globalSearch.toLowerCase()))
    : []

  /* ---- Workspace toggle ---- */
  const toggleWorkspace = (index) => {
    setWorkspaces(prev => prev.map((ws, i) => i === index ? { ...ws, expanded: !ws.expanded } : ws))
  }

  /* ---- New doc ---- */
  const handleNewDoc = () => {
    const newId = Date.now()
    const newDoc = {
      title: 'Untitled document',
      breadcrumb: ['Product', 'Untitled document'],
      author: { initials: 'YO', color: 'var(--avatar-yo)', name: 'You' },
      updatedAgo: 'just now', editingNow: 1,
      content: [
        { type: 'paragraph', text: 'Start writing here...' },
      ],
    }
    const newNote = {
      id: newId, title: 'Untitled document',
      preview: 'Start writing here...',
      tag: 'Product', time: 'just now',
      avatar: { initials: 'YO', color: 'var(--avatar-yo)' }, icon: FileText,
    }
    setDocs(prev => ({ ...prev, [newId]: newDoc }))
    setNotes(prev => [newNote, ...prev])
    setActiveNote(newId)
    addToast('New document created.', 'success')
  }

  /* ---- Inbox mark as read & skip ---- */
  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    addToast('All notifications marked as read.', 'success')
  }



  /* ---- Trash restore ---- */
  const restoreFromTrash = (id) => {
    const item = trash.find(t => t.id === id)
    setTrash(prev => prev.filter(t => t.id !== id))
    addToast(`"${item.title}" restored.`, 'success')
  }

  const permanentDelete = (id) => {
    const item = trash.find(t => t.id === id)
    setTrash(prev => prev.filter(t => t.id !== id))
    addToast(`"${item.title}" permanently deleted.`, 'info')
  }

  /* ---- AI Chat ---- */
  const handleAISend = () => {
    if (!aiInput.trim()) return
    const userMsg = { role: 'user', text: aiInput }
    setAiMessages(prev => [...prev, userMsg])
    setAiInput('')
    setAiTyping(true)
    setTimeout(() => {
      const response = aiResponses[Math.floor(Math.random() * aiResponses.length)]
      setAiMessages(prev => [...prev, { role: 'ai', text: response }])
      setAiTyping(false)
    }, 1200)
  }

  /* ---- Comments ---- */
  const handleAddComment = () => {
    if (!newComment.trim()) return
    const comment = {
      id: `cm-${Date.now()}`,
      author: 'You', initials: 'YO', color: 'var(--avatar-yo)',
      time: 'just now', text: newComment,
    }
    setComments(prev => [...prev, comment])
    setNewComment('')
  }

  /* ---- Share link copy ---- */
  const handleCopyLink = () => {
    navigator.clipboard?.writeText(`https://Netevo.app/doc/${activeNote}`)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  /* ---- More options ---- */
  const handleDuplicate = () => {
    const src = docs[activeNote]
    const newId = Date.now()
    setDocs(prev => ({ ...prev, [newId]: { ...src, title: `${src.title} (copy)` } }))
    setNotes(prev => [{ id: newId, title: `${src.title} (copy)`, preview: 'Duplicated document', tag: 'Product', time: 'just now', avatar: { initials: 'YO', color: 'var(--avatar-yo)' }, icon: FileText }, ...prev])
    setActiveNote(newId)
    setShowMore(false)
    addToast('Document duplicated.', 'success')
  }

  const handleExport = () => {
    const content = currentDoc.content.map(b => b.text || '').join('\n\n')
    const blob = new Blob([`# ${currentDoc.title}\n\n${content}`], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${currentDoc.title}.md`; a.click()
    URL.revokeObjectURL(url)
    setShowMore(false)
    addToast('Document exported as Markdown.', 'success')
  }

  const handleMoveToTrash = () => {
    setTrash(prev => [...prev, { id: `t-${activeNote}`, title: currentDoc.title, deletedBy: 'You', deletedAgo: 'just now' }])
    setNotes(prev => prev.filter(n => n.id !== activeNote))
    const remaining = notes.filter(n => n.id !== activeNote)
    if (remaining.length > 0) setActiveNote(remaining[0].id)
    setShowMore(false)
    addToast(`"${currentDoc.title}" moved to trash.`, 'info')
  }

  const handleLogout = async () => {
    await logout()
    addToast('Signed out.', 'info')
    navigate('/login')
  }

  /* ---- Sort handler ---- */
  const handleSort = (order) => {
    setSortOrder(order)
    setShowSort(false)
    addToast(`Sorted by ${order === 'newest' ? 'newest first' : order === 'oldest' ? 'oldest first' : 'title A–Z'}.`, 'info')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary">
      {/* ======== MODALS ======== */}

      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 z-[200] bg-[rgba(0,0,0,0.6)] flex items-start justify-center pt-[120px] animate-[fadeIn_0.15s_ease]" onClick={() => setShowSearch(false)}>
          <div className="w-[560px] max-w-[90vw] bg-bg-secondary border border-border-default rounded-lg shadow-xl overflow-hidden animate-[fadeInUp_0.2s_ease]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 px-5 py-4 border-b border-border-muted text-text-muted">
              <Search size={18} />
              <input type="text" className="flex-1 text-base text-text-primary bg-transparent outline-none placeholder:text-text-faint" placeholder="Search docs, people, commands..." value={globalSearch} onChange={e => setGlobalSearch(e.target.value)} autoFocus />
              <kbd className="px-2 py-1 rounded-md bg-[linear-gradient(180deg,var(--color-bg-tertiary)_0%,var(--color-bg-primary)_100%)] border border-border-default border-b-border-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.4)] text-[0.6875rem] font-medium text-text-primary inline-flex items-center justify-center min-w-[24px]">ESC</kbd>
            </div>
            <div className="max-h-[320px] overflow-y-auto p-2">
              {globalSearch ? (
                searchResults.length > 0 ? searchResults.map(r => (
                  <div key={r.id} className="flex items-center gap-2 px-3 py-2.5 rounded-md text-[0.875rem] text-text-secondary cursor-pointer transition-all duration-150 hover:bg-bg-elevated hover:text-text-primary" onClick={() => { setActiveNote(r.id); setShowSearch(false); setGlobalSearch('') }}>
                    <FileText size={14} /> <span>{r.title}</span> <span className="ml-auto text-[0.6875rem] text-text-faint px-2 py-0.5 rounded-full bg-bg-elevated">{r.tag}</span>
                  </div>
                )) : <div className="p-8 text-center text-[0.8125rem] text-text-faint">No results for "{globalSearch}"</div>
              ) : <div className="p-8 text-center text-[0.8125rem] text-text-faint">Type to search across all documents...</div>}
            </div>
          </div>
        </div>
      )}

      {/* Inbox Panel */}
      {showInbox && (
        <div className="fixed inset-0 z-[200] bg-[rgba(0,0,0,0.4)] backdrop-blur-[2px] flex animate-[fadeIn_0.15s_ease]" onClick={() => setShowInbox(false)}>
          <div className="m-auto bg-bg-secondary border border-border-default rounded-lg shadow-xl w-[480px] max-w-[90vw] max-h-[85vh] flex flex-col animate-[fadeInUp_0.2s_ease] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-muted bg-bg-tertiary">
              <h3 className="text-[0.9375rem] font-semibold text-text-primary flex items-center gap-2"><Inbox size={16} /> Inbox</h3>
              <div className="flex items-center gap-2">
                <button className="text-text-primary hover:bg-bg-elevated px-4 py-2 inline-flex items-center justify-center font-medium rounded-md transition-colors whitespace-nowrap gap-2 text-sm" onClick={markAllRead}>Mark all read</button>
                <button className="text-text-faint p-1 rounded-md flex cursor-pointer transition-all duration-150 hover:bg-bg-elevated hover:text-text-primary" onClick={() => setShowInbox(false)}><X size={16} /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-0">
              {notifications.map(n => (
                <div key={n.id} className={`flex items-start gap-2 px-5 py-3.5 border-b border-border-muted cursor-pointer transition-all duration-150 hover:bg-bg-elevated ${n.read ? 'opacity-60' : ''}`} onClick={() => {
                  markNotificationRead(n.id)
                  if (n.noteId) { setActiveNote(n.noteId); setShowInbox(false) }
                }}>
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.read ? '' : 'bg-status-blue'}`} />
                  <div className="flex-1">
                    <p className="text-[0.8125rem] text-text-primary mb-1 leading-[1.4]">{n.text}</p>
                    <span className="text-[0.6875rem] text-text-faint">{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Members Panel */}
      {showMembers && (
        <div className="fixed inset-0 z-[200] bg-[rgba(0,0,0,0.4)] backdrop-blur-[2px] flex animate-[fadeIn_0.15s_ease]" onClick={() => setShowMembers(false)}>
          <div className="m-auto bg-bg-secondary border border-border-default rounded-lg shadow-xl w-[480px] max-w-[90vw] max-h-[85vh] flex flex-col animate-[fadeInUp_0.2s_ease] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-muted bg-bg-tertiary">
              <h3 className="text-[0.9375rem] font-semibold text-text-primary flex items-center gap-2"><Users size={16} /> Team Members</h3>
              <button className="text-text-faint p-1 rounded-md flex cursor-pointer transition-all duration-150 hover:bg-bg-elevated hover:text-text-primary" onClick={() => setShowMembers(false)}><X size={16} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-0">
              {/* Current logged-in user */}
              <div className="flex items-center gap-4 px-5 py-3 border-b border-border-muted">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[0.8125rem] font-bold text-white flex-shrink-0 bg-accent-primary">{userInitials}</div>
                <div className="flex-1 flex flex-col">
                  <span className="text-[0.875rem] font-medium text-text-primary">{userName}</span>
                  <span className="text-[0.75rem] text-text-faint">{userEmail}</span>
                </div>
                <span className="text-[0.6875rem] px-2 py-0.5 rounded-full bg-bg-elevated capitalize text-status-green">online</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trash Panel */}
      {showTrash && (
        <div className="fixed inset-0 z-[200] bg-[rgba(0,0,0,0.4)] backdrop-blur-[2px] flex animate-[fadeIn_0.15s_ease]" onClick={() => setShowTrash(false)}>
          <div className="m-auto bg-bg-secondary border border-border-default rounded-lg shadow-xl w-[480px] max-w-[90vw] max-h-[85vh] flex flex-col animate-[fadeInUp_0.2s_ease] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-muted bg-bg-tertiary">
              <h3 className="text-[0.9375rem] font-semibold text-text-primary flex items-center gap-2"><Trash2 size={16} /> Trash</h3>
              <button className="text-text-faint p-1 rounded-md flex cursor-pointer transition-all duration-150 hover:bg-bg-elevated hover:text-text-primary" onClick={() => setShowTrash(false)}><X size={16} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-0">
              {trash.length > 0 ? trash.map(t => (
                <div key={t.id} className="flex items-center gap-4 px-5 py-3 border-b border-border-muted">
                  <FileText size={14} className="text-text-faint" />
                  <div className="flex-1 flex flex-col">
                    <span className="text-[0.875rem] text-text-primary">{t.title}</span>
                    <span className="text-[0.75rem] text-text-faint">Deleted by {t.deletedBy} · {t.deletedAgo}</span>
                  </div>
                  <button className="text-text-primary hover:bg-bg-elevated px-4 py-2 inline-flex items-center justify-center font-medium rounded-md transition-colors whitespace-nowrap gap-2 text-sm" onClick={() => restoreFromTrash(t.id)} title="Restore"><RotateCcw size={14} /></button>
                  <button className="text-text-primary hover:bg-[rgba(218,54,51,0.1)] hover:text-status-red px-4 py-2 inline-flex items-center justify-center font-medium rounded-md transition-colors whitespace-nowrap gap-2 text-sm" onClick={() => permanentDelete(t.id)} title="Delete forever"><X size={14} /></button>
                </div>
              )) : <div className="p-8 text-center text-[0.8125rem] text-text-faint">Trash is empty.</div>}
            </div>
          </div>
        </div>
      )}

      {/* Help & Shortcuts */}
      {showHelp && (
        <div className="fixed inset-0 z-[200] bg-[rgba(0,0,0,0.4)] backdrop-blur-[2px] flex animate-[fadeIn_0.15s_ease]" onClick={() => setShowHelp(false)}>
          <div className="m-auto bg-bg-secondary border border-border-default rounded-lg shadow-xl w-[640px] max-w-[90vw] max-h-[85vh] flex flex-col animate-[fadeInUp_0.2s_ease] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-muted bg-bg-tertiary">
              <h3 className="text-[0.9375rem] font-semibold text-text-primary flex items-center gap-2"><Keyboard size={16} /> Keyboard Shortcuts</h3>
              <button className="text-text-faint p-1 rounded-md flex cursor-pointer transition-all duration-150 hover:bg-bg-elevated hover:text-text-primary" onClick={() => setShowHelp(false)}><X size={16} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 gap-8 bg-bg-primary">
              {keyboardShortcuts.map((cat, i) => (
                <div key={i} className="flex flex-col gap-0.5">
                  <h4 className="flex items-center gap-2 text-[0.75rem] font-semibold text-text-primary uppercase tracking-[0.05em] mb-2 border-b border-border-default pb-2">
                    {cat.icon && <cat.icon size={14} className="text-status-blue" />}
                    {cat.category}
                  </h4>
                  {cat.shortcuts.map((s, j) => (
                    <div key={j} className="flex items-center justify-between px-3 py-2 rounded-md transition-all duration-150 hover:bg-bg-elevated -mx-3 group">
                      <span className="text-[0.8125rem] text-text-secondary group-hover:text-text-primary">{s.description}</span>
                      <div className="flex gap-1">
                        {s.keys.map((k, ki) => <kbd key={ki} className="px-2 py-1 rounded-md bg-[linear-gradient(180deg,var(--color-bg-tertiary)_0%,var(--color-bg-primary)_100%)] border border-border-default border-b-border-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.4)] text-[0.6875rem] font-medium text-text-primary inline-flex items-center justify-center min-w-[24px]">{k}</kbd>)}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Chat Panel */}
      {showAI && (
        <div className="fixed inset-0 z-[200] bg-[rgba(0,0,0,0.4)] backdrop-blur-[2px] flex animate-[fadeIn_0.15s_ease]" onClick={() => setShowAI(false)}>
          <div className="w-[380px] max-w-[90vw] h-screen ml-auto bg-bg-primary border-l border-border-default shadow-xl flex flex-col animate-[slideInRight_0.2s_ease]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-muted bg-bg-tertiary">
              <h3 className="text-[0.9375rem] font-semibold text-text-primary flex items-center gap-2"><Sparkles size={16} /> Ask AI</h3>
              <button className="text-text-faint p-1 rounded-md flex cursor-pointer transition-all duration-150 hover:bg-bg-elevated hover:text-text-primary" onClick={() => setShowAI(false)}><X size={16} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
              {aiMessages.length === 0 && (
                <div className="flex flex-col items-center text-center gap-4 py-8 text-text-muted text-[0.875rem] leading-[1.6]">
                  <Bot size={32} className="text-status-purple" />
                  <p>Hi! I can help you with this document. Try asking me to summarize, find action items, or suggest improvements.</p>
                </div>
              )}
              {aiMessages.map((msg, i) => (
                <div key={i} className={`flex gap-4 text-[0.875rem] leading-[1.6] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${msg.role === 'ai' ? 'bg-[rgba(188,140,255,0.1)] text-status-purple' : 'bg-bg-elevated text-text-secondary'}`}>
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`px-4 py-3 rounded-md whitespace-pre-wrap ${msg.role === 'user' ? 'bg-status-blue text-white' : 'bg-bg-secondary text-text-primary'}`}>{msg.text}</div>
                </div>
              ))}
              {aiTyping && <div className="flex gap-4 text-[0.875rem] leading-[1.6]"><div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 bg-[rgba(188,140,255,0.1)] text-status-purple"><Bot size={14} /></div><div className="text-text-faint flex items-center">Thinking<span className="inline-block overflow-hidden align-bottom animate-[ellipsis_1.5s_infinite]">...</span></div></div>}
            </div>
            <div className="p-4 border-t border-border-muted flex gap-2 bg-bg-tertiary">
              <input ref={aiInputRef} type="text" placeholder="Ask about this document..." value={aiInput}
                className="flex-1 bg-bg-primary border border-border-default rounded-md px-3.5 py-2.5 text-text-primary text-[0.875rem]"
                onChange={e => setAiInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAISend() }} />
              <button className="bg-status-blue text-white border-none rounded-md w-10 flex items-center justify-center cursor-pointer transition-opacity duration-150 disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleAISend} disabled={!aiInput.trim() || aiTyping}>
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments Panel */}
      {showComments && (
        <div className="fixed inset-0 z-[200] bg-[rgba(0,0,0,0.4)] backdrop-blur-[2px] flex animate-[fadeIn_0.15s_ease]" onClick={() => setShowComments(false)}>
          <div className="w-[380px] max-w-[90vw] h-screen ml-auto bg-bg-secondary border-l border-border-default shadow-xl flex flex-col animate-[slideInRight_0.2s_ease]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-muted bg-bg-tertiary">
              <h3 className="text-[0.9375rem] font-semibold text-text-primary flex items-center gap-2"><MessageSquare size={16} /> Comments ({comments.length})</h3>
              <button className="text-text-faint p-1 rounded-md flex cursor-pointer transition-all duration-150 hover:bg-bg-elevated hover:text-text-primary" onClick={() => setShowComments(false)}><X size={16} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
              {comments.map(c => (
                <div key={c.id} className="flex gap-4">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[0.75rem] font-bold text-white flex-shrink-0" style={{ backgroundColor: c.color }}>{c.initials}</div>
                  <div className="flex-1 bg-bg-elevated p-3 rounded-none rounded-r-md rounded-b-md border border-border-default">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[0.8125rem] font-semibold text-text-primary">{c.author}</span>
                      <span className="text-[0.6875rem] text-text-faint">{c.time}</span>
                    </div>
                    <p className="text-[0.875rem] text-text-secondary leading-[1.5]">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-border-muted flex gap-2 bg-bg-tertiary">
              <input type="text" placeholder="Add a comment..." value={newComment}
                className="flex-1 bg-bg-primary border border-border-default rounded-md px-3.5 py-2.5 text-text-primary text-[0.875rem]"
                onChange={e => setNewComment(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAddComment() }} />
              <button className="bg-status-blue text-white border-none rounded-md w-10 flex items-center justify-center cursor-pointer transition-opacity duration-150 disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleAddComment} disabled={!newComment.trim()}>
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Version History Panel */}
      {showVersions && (
        <div className="fixed inset-0 z-[200] bg-[rgba(0,0,0,0.4)] backdrop-blur-[2px] flex animate-[fadeIn_0.15s_ease]" onClick={() => setShowVersions(false)}>
          <div className="w-[380px] max-w-[90vw] h-screen ml-auto bg-bg-secondary border-l border-border-default shadow-xl flex flex-col animate-[slideInRight_0.2s_ease]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-muted bg-bg-tertiary">
              <h3 className="text-[0.9375rem] font-semibold text-text-primary flex items-center gap-2"><Clock size={16} /> Version History</h3>
              <button className="text-text-faint p-1 rounded-md flex cursor-pointer transition-all duration-150 hover:bg-bg-elevated hover:text-text-primary" onClick={() => setShowVersions(false)}><X size={16} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-0">
              {versionHistory.map(v => (
                <div key={v.id} className="flex items-center gap-4 px-5 py-3.5 border-b border-border-muted cursor-pointer transition-colors duration-150 hover:bg-bg-elevated" onClick={() => addToast(`Viewing version from ${v.time}.`, 'info')}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[0.75rem] font-bold text-white flex-shrink-0" style={{ backgroundColor: v.color }}>{v.initials}</div>
                  <div className="flex-1 flex flex-col">
                    <span className="text-[0.875rem] font-medium text-text-primary">{v.author}</span>
                    <span className="text-[0.75rem] text-text-faint">{v.time} · {v.changes}</span>
                  </div>
                  <button className="text-text-primary hover:bg-bg-elevated px-2 py-1 inline-flex items-center justify-center font-medium rounded-md transition-colors whitespace-nowrap gap-2 text-sm"><RotateCcw size={13} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShare && (
        <div className="fixed inset-0 z-[200] bg-[rgba(0,0,0,0.4)] backdrop-blur-[2px] flex animate-[fadeIn_0.15s_ease]" onClick={() => setShowShare(false)}>
          <div className="m-auto bg-bg-secondary border border-border-default rounded-lg shadow-xl w-[380px] max-w-[90vw] max-h-[85vh] flex flex-col animate-[fadeInUp_0.2s_ease] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-muted bg-bg-tertiary">
              <h3 className="text-[0.9375rem] font-semibold text-text-primary flex items-center gap-2"><Share2 size={16} /> Share "{currentDoc.title}"</h3>
              <button className="text-text-faint p-1 rounded-md flex cursor-pointer transition-all duration-150 hover:bg-bg-elevated hover:text-text-primary" onClick={() => setShowShare(false)}><X size={16} /></button>
            </div>
            <div className="p-6">
              <div className="flex gap-2 mb-8">
                <input type="text" className="flex-1 bg-transparent border-none outline-none text-text-primary text-sm" value={`https://Netevo.app/doc/${activeNote}`} readOnly />
                <button className="bg-accent-primary text-white hover:bg-accent-hover shadow-sm px-4 py-2 inline-flex items-center justify-center font-medium rounded-md transition-colors whitespace-nowrap gap-2 text-sm" onClick={handleCopyLink}>
                  {linkCopied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                </button>
              </div>
              <div>
                <p className="text-[0.75rem] font-semibold text-text-secondary uppercase tracking-[0.05em] mb-4">People with access</p>
                {teamMembers.slice(0, 3).map((m, i) => (
                  <div key={i} className="flex items-center gap-4 py-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[0.75rem] font-bold text-white flex-shrink-0" style={{ backgroundColor: m.color }}>{m.initials}</div>
                    <span className="text-[0.875rem] font-medium text-text-primary">{m.name}</span>
                    <span className="ml-auto text-[0.8125rem] text-text-faint">Can edit</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======== LEFT SIDEBAR ======== */}
      <aside className="w-[240px] min-w-[240px] flex flex-col justify-between bg-bg-secondary border-r border-border-muted overflow-y-auto animate-[slideInLeft_0.4s_ease] max-md:w-full max-md:min-w-full max-md:max-h-[200px]">
        <div className="p-6 pb-4 flex flex-col gap-1">
          <div className="flex items-center gap-3 p-2 mb-4 pb-6 border-b border-border-muted cursor-pointer transition-colors duration-150 hover:bg-bg-elevated" onClick={() => addToast('Acme Engineering — Business plan. 5 members, 47 documents.', 'info')}>
            <div className="w-7 h-7 flex items-center justify-center rounded-md bg-accent-primary text-white flex-shrink-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 4L12 8L20 4V16L12 20L4 16V4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M12 8V20" stroke="currentColor" strokeWidth="2"/></svg>
            </div>
            <div className="flex-1 min-w-0 flex flex-col">
              <span className="text-[0.8125rem] font-semibold text-text-primary whitespace-nowrap overflow-hidden text-ellipsis">Acme Engineering</span>
              <span className="text-[0.6875rem] text-text-faint">Business plan</span>
            </div>
            <ChevronDown size={14} className="text-text-faint flex-shrink-0" />
          </div>

          <nav className="flex flex-col gap-0.5 mb-4 pb-4 border-b border-border-muted">
            <SidebarItem icon={Search} label="Search" onClick={() => setShowSearch(true)} />
            <SidebarItem icon={Inbox} label="Inbox" badge={unreadCount || null} onClick={() => setShowInbox(true)} />
            <SidebarItem icon={Sparkles} label="Ask AI" onClick={() => setShowAI(true)} />
            <SidebarItem icon={FilePlus} label="New doc" onClick={handleNewDoc} />
          </nav>

          <div className="mb-4 pb-4 border-b border-border-muted">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-[0.65rem] font-semibold text-text-muted uppercase tracking-[0.08em] cursor-pointer opacity-80 transition-opacity duration-150 hover:opacity-100 hover:text-text-secondary"><ChevronDown size={12} /><span>FAVORITES</span></div>
            {sidebarFavorites.map((item, i) => (
              <SidebarItem key={i} icon={FileText} label={item.title} active={activeNote === item.noteId} onClick={() => setActiveNote(item.noteId)} />
            ))}
          </div>

          <div className="mb-0 pb-0 border-none">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-[0.65rem] font-semibold text-text-muted uppercase tracking-[0.08em] cursor-pointer opacity-80 transition-opacity duration-150 hover:opacity-100 hover:text-text-secondary"><ChevronDown size={12} /><span>WORKSPACES</span></div>
            {workspaces.map((ws, i) => (
              <div key={i}>
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[0.8125rem] text-text-secondary cursor-pointer transition-all duration-150 my-[1px] hover:bg-bg-elevated hover:text-text-primary" onClick={() => toggleWorkspace(i)}>
                  {ws.expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 shadow-[0_0_6px_currentColor] opacity-90" style={{ backgroundColor: ws.color }} />
                  <span>{ws.name}</span>
                </div>
                {ws.expanded && ws.children.map((child, j) => (
                  <div key={j} className={`flex items-center gap-2 py-1.5 pr-2.5 pl-[34px] text-[0.8125rem] text-text-secondary cursor-pointer transition-all duration-150 whitespace-nowrap overflow-hidden text-ellipsis my-[1px] rounded-md hover:text-text-primary hover:bg-bg-elevated ${activeNote === child.noteId ? 'bg-[rgba(255,255,255,0.06)] text-text-primary font-medium' : ''}`} onClick={() => setActiveNote(child.noteId)}>
                    <FileText size={13} /><span>{child.title}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 border-t border-border-muted flex flex-col gap-px">
          <SidebarItem icon={Users} label="Members" onClick={() => setShowMembers(true)} />
          <SidebarItem icon={Trash2} label="Trash" onClick={() => setShowTrash(true)} />
          <SidebarItem icon={HelpCircle} label="Help & shortcuts" onClick={() => setShowHelp(true)} />
          <div className="relative">
            <div className="flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors duration-150 mt-1 hover:bg-bg-elevated" onClick={() => setShowUserMenu(!showUserMenu)}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[0.75rem] font-bold text-white flex-shrink-0 bg-accent-primary">{userInitials}</div>
              <div className="flex-1 min-w-0 flex flex-col">
                <span className="text-[0.8125rem] font-medium text-text-primary">{userName}</span>
                <span className="text-[0.6875rem] text-text-faint">{userEmail}</span>
              </div>
              <ChevronDown size={14} className="text-text-faint" />
            </div>
            {showUserMenu && (
              <div className="absolute bottom-[calc(100%+6px)] left-0 right-0 bg-bg-elevated border border-border-default rounded-md shadow-lg z-[100] overflow-hidden animate-[fadeInUp_0.15s_ease]">
                <div className="flex items-center gap-3 px-3.5 py-2.5 text-[0.8125rem] text-text-secondary cursor-pointer transition-all duration-150 hover:bg-bg-tertiary hover:text-text-primary" onClick={() => { setShowUserMenu(false); addToast(`Profile: ${userEmail} — ${userName}`, 'info') }}><Settings size={14} /> Settings</div>
                <div className="flex items-center gap-3 px-3.5 py-2.5 text-[0.8125rem] cursor-pointer transition-all duration-150 text-status-red border-t border-border-muted hover:bg-[rgba(218,54,51,0.1)] hover:text-status-red" onClick={handleLogout}><LogOut size={14} /> Log out</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ======== MIDDLE PANEL ======== */}
      <div className="w-[320px] min-w-[320px] flex flex-col border-r border-border-muted bg-bg-primary animate-[fadeIn_0.4s_ease] max-lg:w-[280px] max-lg:min-w-[280px] max-md:w-full max-md:min-w-full max-md:max-h-[300px]">
        <div className="flex items-center justify-between p-6 pb-3">
          <h2 className="text-[0.9375rem] font-semibold text-text-primary">All notes</h2>
          <button className="text-text-muted hover:bg-bg-elevated hover:text-text-primary px-3 py-1.5 inline-flex items-center justify-center font-medium rounded-md transition-colors whitespace-nowrap gap-1 text-[0.8125rem]" onClick={handleNewDoc}><Plus size={14} /> New</button>
        </div>
        <div className="flex items-center gap-3 mx-6 mb-3 px-3 py-2 rounded-md bg-bg-secondary border border-border-muted">
          <Search size={14} className="text-text-faint flex-shrink-0" />
          <input type="text" className="flex-1 bg-transparent border-none outline-none text-[0.8125rem] text-text-primary placeholder:text-text-faint" placeholder="Filter notes..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          {searchQuery && <button className="text-text-faint p-0.5 rounded cursor-pointer transition-colors duration-150 hover:bg-bg-elevated hover:text-text-primary flex" onClick={() => setSearchQuery('')}><X size={12} /></button>}
        </div>
        <div className="flex items-center gap-0.5 px-6 pb-3 border-b border-border-muted overflow-x-auto">
          {filterTabs.map(tab => (
            <button key={tab} className={`px-2.5 py-1.5 rounded-md text-[0.75rem] font-medium bg-transparent border-none cursor-pointer transition-colors duration-150 whitespace-nowrap flex items-center gap-1 ${activeFilter === tab ? 'text-text-primary bg-bg-elevated' : 'text-text-faint hover:text-text-muted hover:bg-bg-elevated'}`} onClick={() => setActiveFilter(tab)}>{tab}</button>
          ))}
          <div className="relative ml-auto">
            <button className="px-2.5 py-1.5 rounded-md text-[0.75rem] font-medium bg-transparent border-none cursor-pointer transition-colors duration-150 whitespace-nowrap flex items-center gap-1 text-text-faint hover:text-text-muted hover:bg-bg-elevated" onClick={() => setShowSort(!showSort)}>
              <SlidersHorizontal size={13} /> Sort
            </button>
            {showSort && (
              <div className="absolute top-[calc(100%+4px)] right-0 bg-bg-secondary border border-border-default rounded-md shadow-lg z-[100] min-w-[160px] overflow-hidden animate-[fadeInUp_0.1s_ease]">
                <div className={`flex items-center gap-3 px-3.5 py-2.5 text-[0.8125rem] cursor-pointer transition-colors duration-150 hover:bg-bg-elevated hover:text-text-primary ${sortOrder === 'newest' ? 'text-text-primary bg-bg-tertiary' : 'text-text-secondary'}`} onClick={() => handleSort('newest')}><ArrowDown size={13} /> Newest first</div>
                <div className={`flex items-center gap-3 px-3.5 py-2.5 text-[0.8125rem] cursor-pointer transition-colors duration-150 hover:bg-bg-elevated hover:text-text-primary ${sortOrder === 'oldest' ? 'text-text-primary bg-bg-tertiary' : 'text-text-secondary'}`} onClick={() => handleSort('oldest')}><ArrowUp size={13} /> Oldest first</div>
                <div className={`flex items-center gap-3 px-3.5 py-2.5 text-[0.8125rem] cursor-pointer transition-colors duration-150 hover:bg-bg-elevated hover:text-text-primary ${sortOrder === 'title' ? 'text-text-primary bg-bg-tertiary' : 'text-text-secondary'}`} onClick={() => handleSort('title')}>A–Z Title</div>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {filteredNotes.length > 0 ? filteredNotes.map(note => {
            const Icon = note.icon
            return (
              <div key={note.id} className={`flex gap-3 p-6 cursor-pointer border-l-[3px] transition-colors duration-150 relative ${activeNote === note.id ? 'bg-bg-secondary border-accent-primary' : 'border-transparent hover:bg-bg-secondary'}`} onClick={() => setActiveNote(note.id)}>
                <div className="text-text-faint mt-0.5 flex-shrink-0"><Icon size={15} /></div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[0.8125rem] font-semibold text-text-primary mb-1 whitespace-nowrap overflow-hidden text-ellipsis">{note.title}</h4>
                  <p className="text-[0.75rem] text-text-faint leading-[1.45] line-clamp-2 mb-1.5">{note.preview}</p>
                  <div className="flex items-center gap-1.5 text-[0.6875rem] text-text-faint">
                    <span className="text-text-faint">◦ {note.tag}</span>
                    <span className="text-border-default">·</span>
                    <span>{note.time}</span>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[0.75rem] font-bold text-white flex-shrink-0 mt-0.5" style={{ backgroundColor: note.avatar.color }}>{note.avatar.initials}</div>
              </div>
            )
          }) : <div className="p-8 text-center text-[0.8125rem] text-text-faint">No notes match your filter.</div>}
        </div>
      </div>

      {/* ======== RIGHT PANEL ======== */}
      {currentDoc && (
        <div className="flex-1 min-w-0 flex flex-col bg-bg-primary overflow-hidden relative max-md:fixed max-md:inset-0 max-md:z-[100] max-md:bg-bg-primary">
          <div className="flex items-center justify-between h-[52px] min-h-[52px] px-6 border-b border-border-muted flex-shrink-0 bg-[rgba(13,13,13,0.8)] backdrop-blur-[12px] sticky top-0 z-[10] gap-4">
            <div className="flex-1 max-w-[400px] flex items-center gap-2 px-3 py-1.5 rounded-md bg-bg-secondary border border-border-default cursor-pointer text-text-faint transition-colors duration-150 hover:bg-bg-elevated hover:text-text-secondary" onClick={() => setShowSearch(true)}>
              <Search size={15} />
              <input type="text" className="flex-1 bg-transparent border-none outline-none text-[0.8125rem] text-inherit placeholder:text-inherit pointer-events-none" placeholder="Search docs, people, commands..." readOnly />
              <kbd className="px-1.5 py-0.5 rounded-[4px] bg-[linear-gradient(180deg,var(--color-bg-tertiary)_0%,var(--color-bg-primary)_100%)] border border-border-default border-b-border-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.4)] text-[0.625rem] font-medium text-text-secondary">⌘K</kbd>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 max-sm:hidden">
              <button className="text-text-secondary hover:bg-bg-elevated hover:text-text-primary px-3 py-1.5 inline-flex items-center justify-center font-medium rounded-md transition-colors whitespace-nowrap gap-2 text-[0.8125rem]" onClick={() => setShowAI(true)}><Sparkles size={15} /> Ask AI</button>
              <button className="text-text-secondary hover:bg-bg-elevated hover:text-text-primary w-8 h-8 inline-flex items-center justify-center rounded-md transition-colors" onClick={() => setShowHelp(true)}><HelpCircle size={15} /></button>
              <button className="text-text-secondary hover:bg-bg-elevated hover:text-text-primary w-8 h-8 inline-flex items-center justify-center rounded-md transition-colors" onClick={() => { window.open(`/dashboard#doc-${activeNote}`, '_blank'); addToast('Opened in new tab.', 'info') }}><ArrowUpRight size={15} /></button>
            </div>
          </div>

          <div className="flex items-center justify-between px-16 py-4 flex-shrink-0 flex-wrap gap-4 max-lg:px-8 max-sm:px-6">
            <div className="flex items-center flex-wrap gap-2 text-[0.8125rem]">
              {currentDoc.breadcrumb.map((item, i) => (
                <span key={i} className="flex items-center gap-2">
                  {i > 0 && <span className="text-text-faint">›</span>}
                  <span className={`transition-colors duration-150 ${i === currentDoc.breadcrumb.length - 1 ? 'font-medium text-text-primary' : 'text-text-secondary cursor-pointer hover:text-text-primary hover:underline underline-offset-[3px]'}`}>{item}</span>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4 text-text-secondary max-sm:gap-2">
              <span className="flex items-center gap-1.5 text-[0.75rem] text-text-faint max-sm:hidden"><Bookmark size={14} /> Saved</span>
              <Star size={16} className={`cursor-pointer transition-colors duration-150 hover:text-text-primary ${starred[activeNote] ? 'text-status-orange hover:text-status-orange' : ''}`}
                fill={starred[activeNote] ? 'currentColor' : 'none'}
                onClick={() => { setStarred(p => ({ ...p, [activeNote]: !p[activeNote] })); addToast(starred[activeNote] ? 'Removed from favorites.' : 'Added to favorites!', 'info') }} />
              <Clock size={16} className="cursor-pointer transition-colors duration-150 hover:text-text-primary" onClick={() => setShowVersions(true)} />
              <MessageSquare size={16} className="cursor-pointer transition-colors duration-150 hover:text-text-primary" onClick={() => setShowComments(true)} />
              <div className="flex items-center ml-2 max-sm:hidden">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[0.625rem] font-bold text-white shadow-[0_0_0_2px_var(--color-bg-primary)] bg-accent-primary">{userInitials}</div>
              </div>
              <button className="bg-accent-primary text-white hover:bg-accent-hover shadow-sm px-3 py-1.5 inline-flex items-center justify-center font-medium rounded-md transition-colors whitespace-nowrap gap-1.5 text-[0.8125rem]" onClick={() => setShowShare(true)}><Share2 size={14} /> Share</button>
              <div className="relative">
                <MoreHorizontal size={16} className="cursor-pointer transition-colors duration-150 hover:text-text-primary" onClick={() => setShowMore(!showMore)} />
                {showMore && (
                  <div className="absolute top-[calc(100%+8px)] right-0 bg-bg-secondary border border-border-default rounded-md shadow-lg z-[100] min-w-[180px] overflow-hidden animate-[fadeInUp_0.1s_ease]">
                    <div className="flex items-center gap-3 px-3.5 py-2.5 text-[0.8125rem] text-text-secondary cursor-pointer transition-colors duration-150 hover:bg-bg-elevated hover:text-text-primary" onClick={handleExport}><Download size={14} /> Export as Markdown</div>
                    <div className="flex items-center gap-3 px-3.5 py-2.5 text-[0.8125rem] text-text-secondary cursor-pointer transition-colors duration-150 hover:bg-bg-elevated hover:text-text-primary" onClick={handleDuplicate}><Files size={14} /> Duplicate</div>
                    <div className="flex items-center gap-3 px-3.5 py-2.5 text-[0.8125rem] cursor-pointer transition-colors duration-150 text-status-red border-t border-border-muted hover:bg-[rgba(218,54,51,0.1)] hover:text-status-red" onClick={handleMoveToTrash}><Trash size={14} /> Move to trash</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden px-16 py-8 pb-32 scroll-smooth max-lg:px-8 max-sm:px-6">
            <div className="flex items-center gap-2 mb-8 animate-[fadeInUp_0.4s_ease]">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[0.75rem] font-bold text-white flex-shrink-0" style={{ backgroundColor: currentDoc.author.color }}>{currentDoc.author.initials}</div>
              <span className="text-[0.8125rem] font-medium text-text-primary">{currentDoc.author.name}</span>
              <span className="text-[0.8125rem] text-text-faint">·</span>
              <span className="text-[0.8125rem] text-text-faint">Updated {currentDoc.updatedAgo}</span>
              {currentDoc.editingNow > 0 && <><span className="text-[0.8125rem] text-text-faint">·</span><span className="text-[0.6875rem] font-semibold text-status-orange bg-[rgba(217,119,6,0.15)] px-2 py-0.5 rounded-full uppercase tracking-[0.05em] flex items-center gap-1.5 animate-[pulse_2s_infinite]">● {currentDoc.editingNow} editing now</span></>}
            </div>
            <article className="max-w-[760px] mx-auto animate-[fadeInUp_0.5s_ease]">
              <h1 className="text-[2.5rem] font-bold text-text-primary leading-[1.2] tracking-[-0.02em] mb-10 max-sm:text-[2rem]">{currentDoc.title}</h1>
              {currentDoc.content.map((block, i) => {
                switch (block.type) {
                  case 'paragraph': return <p key={i} className="text-[1.0625rem] leading-[1.7] text-[var(--color-text-doc)] mb-6 last:mb-0 max-sm:text-base">{block.text}</p>
                  case 'heading': return <h2 key={i} className="text-[1.5rem] font-semibold text-text-primary leading-[1.3] mt-10 mb-4 tracking-[-0.01em] pb-2 border-b border-border-muted">{block.text}</h2>
                  case 'callout': return <div key={i} className="flex gap-4 p-4 rounded-lg bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.2)] mb-6 text-[0.9375rem] leading-[1.6] text-text-primary"><span className="text-xl leading-none flex-shrink-0">{block.icon}</span><p className="m-0">{block.text}</p></div>
                  case 'bullet': return <div key={i} className="flex gap-3 text-[1.0625rem] leading-[1.7] text-[var(--color-text-doc)] mb-2.5 max-sm:text-base"><span className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-doc)] mt-[0.55rem] flex-shrink-0 opacity-60" />{block.text}</div>
                  case 'check': return (
                    <div key={i} className={`flex gap-3 text-[1.0625rem] leading-[1.7] mb-2.5 items-start cursor-pointer transition-colors duration-150 select-none max-sm:text-base group ${block.checked ? 'text-text-faint line-through' : 'text-[var(--color-text-doc)] hover:text-text-primary'}`} onClick={() => toggleCheck(block.id)}>
                      {block.checked ? <CheckSquare size={16} className="mt-[0.35rem] flex-shrink-0 text-accent-primary" /> : <Square size={16} className="mt-[0.35rem] flex-shrink-0 text-text-muted group-hover:text-text-primary" />}
                      <span className="pt-[1px]">{block.text}</span>
                    </div>
                  )
                  default: return null
                }
              })}
            </article>
          </div>
        </div>
      )}
    </div>
  )
}

function SidebarItem({ icon: Icon, label, badge, onClick, active }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-md text-[0.875rem] font-medium cursor-pointer transition-colors duration-150 mx-2 my-0.5 select-none ${active ? 'bg-bg-elevated text-text-primary' : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'}`} onClick={onClick}>
      <Icon size={16} className={active ? 'text-text-primary' : 'text-text-muted'} /><span>{label}</span>
      {badge && <span className="ml-auto bg-accent-primary text-white text-[0.6875rem] font-semibold px-2 py-[0.125rem] rounded-full min-w-[20px] text-center">{badge}</span>}
    </div>
  )
}
