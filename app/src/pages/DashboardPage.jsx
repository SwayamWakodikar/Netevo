import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, Inbox, Sparkles, FilePlus, Star, ChevronDown, ChevronRight,
  Hash, FileText, File, MoreHorizontal, MessageSquare, Clock,
  Users, Trash2, HelpCircle, Plus, SlidersHorizontal, Share2, Bookmark,
  ArrowUpRight, CheckSquare, Square, X, LogOut, Settings, Copy, Check,
  RotateCcw, Download, Files, Trash, Send, Bot, User, Keyboard,
  ArrowDown, ArrowUp, Navigation, Edit2, LayoutDashboard
} from 'lucide-react'
import { useToast } from '../components/Toast'
import './DashboardPage.css'

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
      { type: 'callout', icon: '💡', text: 'Anchor decisions on measurable outcomes, not feature counts. Every initiative should have a single owner and a 6-week target.' },
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
      { type: 'callout', icon: '🎯', text: "Goal: every keystroke from one user should appear on a collaborator's screen within 50ms, regardless of region." },
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
      { type: 'callout', icon: '🎨', text: 'Design tokens are the single source of truth for visual style. Every component should reference tokens, not raw values.' },
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
      { type: 'callout', icon: '📊', text: '38% of new signups never create their first document. Our activation metric is broken.' },
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
      { type: 'callout', icon: '🔴', text: 'Severity: SEV-1. Customer-facing impact with data sync delays. No data loss confirmed.' },
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

const teamMembers = [
  { initials: 'MC', color: 'var(--avatar-mc)', name: 'Maya Chen', role: 'Product Lead', email: 'maya@acme.dev', status: 'online' },
  { initials: 'DP', color: 'var(--avatar-dp)', name: 'David Park', role: 'Staff Engineer', email: 'david@acme.dev', status: 'online' },
  { initials: 'SK', color: 'var(--avatar-sk)', name: 'Sarah Kim', role: 'Design Lead', email: 'sarah@acme.dev', status: 'away' },
  { initials: 'YO', color: 'var(--avatar-yo)', name: 'You', role: 'Engineer', email: 'you@acme.dev', status: 'online' },
  { initials: 'NP', color: '#d29922', name: 'Nate Patel', role: 'DevOps Engineer', email: 'nate@acme.dev', status: 'offline' },
]

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
const docCollaborators = [
  { initials: 'YO', color: 'var(--avatar-yo)' },
  { initials: 'MC', color: 'var(--avatar-mc)' },
  { initials: 'DP', color: 'var(--avatar-dp)' },
]

/* ================================================================
   DASHBOARD COMPONENT
   ================================================================ */
export default function DashboardPage() {
  const navigate = useNavigate()
  const { addToast } = useToast()
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
    navigator.clipboard?.writeText(`https://notevo.app/doc/${activeNote}`)
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

  const handleLogout = () => {
    addToast('Signed out.', 'info')
    setTimeout(() => navigate('/login'), 300)
  }

  /* ---- Sort handler ---- */
  const handleSort = (order) => {
    setSortOrder(order)
    setShowSort(false)
    addToast(`Sorted by ${order === 'newest' ? 'newest first' : order === 'oldest' ? 'oldest first' : 'title A–Z'}.`, 'info')
  }

  return (
    <div className="dashboard">
      {/* ======== MODALS ======== */}

      {/* Search Overlay */}
      {showSearch && (
        <div className="search-overlay" onClick={() => setShowSearch(false)}>
          <div className="search-modal" onClick={e => e.stopPropagation()}>
            <div className="search-modal-input">
              <Search size={18} />
              <input type="text" placeholder="Search docs, people, commands..." value={globalSearch} onChange={e => setGlobalSearch(e.target.value)} autoFocus />
              <kbd className="kbd">ESC</kbd>
            </div>
            <div className="search-results">
              {globalSearch ? (
                searchResults.length > 0 ? searchResults.map(r => (
                  <div key={r.id} className="search-result-item" onClick={() => { setActiveNote(r.id); setShowSearch(false); setGlobalSearch('') }}>
                    <FileText size={14} /> <span>{r.title}</span> <span className="search-result-tag">{r.tag}</span>
                  </div>
                )) : <div className="modal-empty">No results for "{globalSearch}"</div>
              ) : <div className="modal-empty">Type to search across all documents...</div>}
            </div>
          </div>
        </div>
      )}

      {/* Inbox Panel */}
      {showInbox && (
        <div className="modal-overlay" onClick={() => setShowInbox(false)}>
          <div className="center-modal" onClick={e => e.stopPropagation()}>
            <div className="panel-header">
              <h3><Inbox size={16} /> Inbox</h3>
              <div className="panel-header-actions">
                <button className="btn btn-ghost" onClick={markAllRead}>Mark all read</button>
                <button className="panel-close" onClick={() => setShowInbox(false)}><X size={16} /></button>
              </div>
            </div>
            <div className="panel-body">
              {notifications.map(n => (
                <div key={n.id} className={`inbox-item ${n.read ? 'read' : ''}`} onClick={() => {
                  markNotificationRead(n.id)
                  if (n.noteId) { setActiveNote(n.noteId); setShowInbox(false) }
                }}>
                  <div className={`inbox-dot ${n.read ? '' : 'unread'}`} />
                  <div className="inbox-content">
                    <p className="inbox-text">{n.text}</p>
                    <span className="inbox-time">{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Members Panel */}
      {showMembers && (
        <div className="modal-overlay" onClick={() => setShowMembers(false)}>
          <div className="center-modal" onClick={e => e.stopPropagation()}>
            <div className="panel-header">
              <h3><Users size={16} /> Team Members</h3>
              <button className="panel-close" onClick={() => setShowMembers(false)}><X size={16} /></button>
            </div>
            <div className="panel-body">
              {teamMembers.map((m, i) => (
                <div key={i} className="member-item">
                  <div className="avatar" style={{ backgroundColor: m.color }}>{m.initials}</div>
                  <div className="member-info">
                    <span className="member-name">{m.name}</span>
                    <span className="member-role">{m.role} · {m.email}</span>
                  </div>
                  <span className={`member-status ${m.status}`}>{m.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trash Panel */}
      {showTrash && (
        <div className="modal-overlay" onClick={() => setShowTrash(false)}>
          <div className="center-modal" onClick={e => e.stopPropagation()}>
            <div className="panel-header">
              <h3><Trash2 size={16} /> Trash</h3>
              <button className="panel-close" onClick={() => setShowTrash(false)}><X size={16} /></button>
            </div>
            <div className="panel-body">
              {trash.length > 0 ? trash.map(t => (
                <div key={t.id} className="trash-item">
                  <FileText size={14} className="trash-icon" />
                  <div className="trash-info">
                    <span className="trash-title">{t.title}</span>
                    <span className="trash-meta">Deleted by {t.deletedBy} · {t.deletedAgo}</span>
                  </div>
                  <button className="btn btn-ghost" onClick={() => restoreFromTrash(t.id)} title="Restore"><RotateCcw size={14} /></button>
                  <button className="btn btn-ghost trash-delete" onClick={() => permanentDelete(t.id)} title="Delete forever"><X size={14} /></button>
                </div>
              )) : <div className="modal-empty">Trash is empty.</div>}
            </div>
          </div>
        </div>
      )}

      {/* Help & Shortcuts */}
      {showHelp && (
        <div className="modal-overlay" onClick={() => setShowHelp(false)}>
          <div className="center-modal wide" onClick={e => e.stopPropagation()}>
            <div className="panel-header">
              <h3><Keyboard size={16} /> Keyboard Shortcuts</h3>
              <button className="panel-close" onClick={() => setShowHelp(false)}><X size={16} /></button>
            </div>
            <div className="panel-body shortcuts-body">
              {keyboardShortcuts.map((cat, i) => (
                <div key={i} className="shortcut-category">
                  <h4 className="shortcut-cat-title">
                    {cat.icon && <cat.icon size={14} className="shortcut-cat-icon" />}
                    {cat.category}
                  </h4>
                  {cat.shortcuts.map((s, j) => (
                    <div key={j} className="shortcut-row">
                      <span className="shortcut-desc">{s.description}</span>
                      <div className="shortcut-keys">
                        {s.keys.map((k, ki) => <kbd key={ki} className="kbd">{k}</kbd>)}
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
        <div className="modal-overlay" onClick={() => setShowAI(false)}>
          <div className="side-panel right ai-panel" onClick={e => e.stopPropagation()}>
            <div className="panel-header">
              <h3><Sparkles size={16} /> Ask AI</h3>
              <button className="panel-close" onClick={() => setShowAI(false)}><X size={16} /></button>
            </div>
            <div className="ai-messages">
              {aiMessages.length === 0 && (
                <div className="ai-welcome">
                  <Bot size={32} className="ai-welcome-icon" />
                  <p>Hi! I can help you with this document. Try asking me to summarize, find action items, or suggest improvements.</p>
                </div>
              )}
              {aiMessages.map((msg, i) => (
                <div key={i} className={`ai-msg ${msg.role}`}>
                  <div className="ai-msg-avatar">
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className="ai-msg-text">{msg.text}</div>
                </div>
              ))}
              {aiTyping && <div className="ai-msg ai"><div className="ai-msg-avatar"><Bot size={14} /></div><div className="ai-typing">Thinking<span className="typing-dots">...</span></div></div>}
            </div>
            <div className="ai-input-bar">
              <input ref={aiInputRef} type="text" placeholder="Ask about this document..." value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAISend() }} />
              <button className="ai-send-btn" onClick={handleAISend} disabled={!aiInput.trim() || aiTyping}>
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments Panel */}
      {showComments && (
        <div className="modal-overlay" onClick={() => setShowComments(false)}>
          <div className="side-panel right" onClick={e => e.stopPropagation()}>
            <div className="panel-header">
              <h3><MessageSquare size={16} /> Comments ({comments.length})</h3>
              <button className="panel-close" onClick={() => setShowComments(false)}><X size={16} /></button>
            </div>
            <div className="panel-body comments-body">
              {comments.map(c => (
                <div key={c.id} className="comment-item">
                  <div className="avatar avatar-sm" style={{ backgroundColor: c.color }}>{c.initials}</div>
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-author">{c.author}</span>
                      <span className="comment-time">{c.time}</span>
                    </div>
                    <p className="comment-text">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="comment-input-bar">
              <input type="text" placeholder="Add a comment..." value={newComment}
                onChange={e => setNewComment(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAddComment() }} />
              <button className="ai-send-btn" onClick={handleAddComment} disabled={!newComment.trim()}>
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Version History Panel */}
      {showVersions && (
        <div className="modal-overlay" onClick={() => setShowVersions(false)}>
          <div className="side-panel right" onClick={e => e.stopPropagation()}>
            <div className="panel-header">
              <h3><Clock size={16} /> Version History</h3>
              <button className="panel-close" onClick={() => setShowVersions(false)}><X size={16} /></button>
            </div>
            <div className="panel-body">
              {versionHistory.map(v => (
                <div key={v.id} className="version-item" onClick={() => addToast(`Viewing version from ${v.time}.`, 'info')}>
                  <div className="avatar avatar-sm" style={{ backgroundColor: v.color }}>{v.initials}</div>
                  <div className="version-info">
                    <span className="version-author">{v.author}</span>
                    <span className="version-meta">{v.time} · {v.changes}</span>
                  </div>
                  <button className="btn btn-ghost"><RotateCcw size={13} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShare && (
        <div className="modal-overlay" onClick={() => setShowShare(false)}>
          <div className="center-modal small" onClick={e => e.stopPropagation()}>
            <div className="panel-header">
              <h3><Share2 size={16} /> Share "{currentDoc.title}"</h3>
              <button className="panel-close" onClick={() => setShowShare(false)}><X size={16} /></button>
            </div>
            <div className="panel-body share-body">
              <div className="share-link-row">
                <input type="text" className="input-plain" value={`https://notevo.app/doc/${activeNote}`} readOnly />
                <button className="btn btn-primary" onClick={handleCopyLink}>
                  {linkCopied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                </button>
              </div>
              <div className="share-members">
                <p className="share-members-label">People with access</p>
                {teamMembers.slice(0, 3).map((m, i) => (
                  <div key={i} className="member-item compact">
                    <div className="avatar avatar-sm" style={{ backgroundColor: m.color }}>{m.initials}</div>
                    <span className="member-name">{m.name}</span>
                    <span className="share-role">Can edit</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======== LEFT SIDEBAR ======== */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-org" onClick={() => addToast('Acme Engineering — Business plan. 5 members, 47 documents.', 'info')}>
            <div className="sidebar-org-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 4L12 8L20 4V16L12 20L4 16V4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M12 8V20" stroke="currentColor" strokeWidth="2"/></svg>
            </div>
            <div className="sidebar-org-info">
              <span className="sidebar-org-name">Acme Engineering</span>
              <span className="sidebar-org-plan">Business plan</span>
            </div>
            <ChevronDown size={14} className="sidebar-org-chevron" />
          </div>

          <nav className="sidebar-nav">
            <SidebarItem icon={Search} label="Search" onClick={() => setShowSearch(true)} />
            <SidebarItem icon={Inbox} label="Inbox" badge={unreadCount || null} onClick={() => setShowInbox(true)} />
            <SidebarItem icon={Sparkles} label="Ask AI" onClick={() => setShowAI(true)} />
            <SidebarItem icon={FilePlus} label="New doc" onClick={handleNewDoc} />
          </nav>

          <div className="sidebar-section">
            <div className="sidebar-section-header"><ChevronDown size={12} /><span>FAVORITES</span></div>
            {sidebarFavorites.map((item, i) => (
              <SidebarItem key={i} icon={FileText} label={item.title} active={activeNote === item.noteId} onClick={() => setActiveNote(item.noteId)} />
            ))}
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-header"><ChevronDown size={12} /><span>WORKSPACES</span></div>
            {workspaces.map((ws, i) => (
              <div key={i}>
                <div className="sidebar-workspace-item" onClick={() => toggleWorkspace(i)}>
                  {ws.expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  <span className="workspace-dot" style={{ backgroundColor: ws.color }} />
                  <span>{ws.name}</span>
                </div>
                {ws.expanded && ws.children.map((child, j) => (
                  <div key={j} className={`sidebar-workspace-child ${activeNote === child.noteId ? 'active' : ''}`} onClick={() => setActiveNote(child.noteId)}>
                    <FileText size={13} /><span>{child.title}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-bottom">
          <SidebarItem icon={Users} label="Members" onClick={() => setShowMembers(true)} />
          <SidebarItem icon={Trash2} label="Trash" onClick={() => setShowTrash(true)} />
          <SidebarItem icon={HelpCircle} label="Help & shortcuts" onClick={() => setShowHelp(true)} />
          <div className="sidebar-user-wrapper">
            <div className="sidebar-user" onClick={() => setShowUserMenu(!showUserMenu)}>
              <div className="avatar avatar-sm" style={{ backgroundColor: 'var(--avatar-yo)' }}>YO</div>
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">You</span>
                <span className="sidebar-user-email">you@acme.dev</span>
              </div>
              <ChevronDown size={14} className="sidebar-user-chevron" />
            </div>
            {showUserMenu && (
              <div className="user-dropdown">
                <div className="user-dropdown-item" onClick={() => { setShowUserMenu(false); addToast('Profile: you@acme.dev — Engineer at Acme Engineering.', 'info') }}><Settings size={14} /> Settings</div>
                <div className="user-dropdown-item logout" onClick={handleLogout}><LogOut size={14} /> Log out</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ======== MIDDLE PANEL ======== */}
      <div className="notes-panel">
        <div className="notes-header">
          <h2 className="notes-title">All notes</h2>
          <button className="btn btn-ghost notes-new-btn" onClick={handleNewDoc}><Plus size={14} /> New</button>
        </div>
        <div className="notes-search">
          <Search size={14} className="notes-search-icon" />
          <input type="text" placeholder="Filter notes..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          {searchQuery && <button className="notes-search-clear" onClick={() => setSearchQuery('')}><X size={12} /></button>}
        </div>
        <div className="notes-filters">
          {filterTabs.map(tab => (
            <button key={tab} className={`notes-filter-tab ${activeFilter === tab ? 'active' : ''}`} onClick={() => setActiveFilter(tab)}>{tab}</button>
          ))}
          <div className="sort-wrapper">
            <button className="notes-filter-tab sort-btn" onClick={() => setShowSort(!showSort)}>
              <SlidersHorizontal size={13} /> Sort
            </button>
            {showSort && (
              <div className="sort-dropdown">
                <div className={`sort-option ${sortOrder === 'newest' ? 'active' : ''}`} onClick={() => handleSort('newest')}><ArrowDown size={13} /> Newest first</div>
                <div className={`sort-option ${sortOrder === 'oldest' ? 'active' : ''}`} onClick={() => handleSort('oldest')}><ArrowUp size={13} /> Oldest first</div>
                <div className={`sort-option ${sortOrder === 'title' ? 'active' : ''}`} onClick={() => handleSort('title')}>A–Z Title</div>
              </div>
            )}
          </div>
        </div>
        <div className="notes-list">
          {filteredNotes.length > 0 ? filteredNotes.map(note => {
            const Icon = note.icon
            return (
              <div key={note.id} className={`note-card ${activeNote === note.id ? 'active' : ''}`} onClick={() => setActiveNote(note.id)}>
                <div className="note-card-icon"><Icon size={15} /></div>
                <div className="note-card-body">
                  <h4 className="note-card-title">{note.title}</h4>
                  <p className="note-card-preview">{note.preview}</p>
                  <div className="note-card-meta">
                    <span className="note-card-tag">◦ {note.tag}</span>
                    <span className="note-card-sep">·</span>
                    <span className="note-card-time">{note.time}</span>
                  </div>
                </div>
                <div className="avatar avatar-sm note-card-avatar" style={{ backgroundColor: note.avatar.color }}>{note.avatar.initials}</div>
              </div>
            )
          }) : <div className="notes-empty">No notes match your filter.</div>}
        </div>
      </div>

      {/* ======== RIGHT PANEL ======== */}
      {currentDoc && (
        <div className="editor-panel">
          <div className="editor-topbar">
            <div className="editor-search-bar" onClick={() => setShowSearch(true)} style={{ cursor: 'pointer' }}>
              <Search size={15} className="editor-search-icon" />
              <input type="text" placeholder="Search docs, people, commands..." readOnly style={{ cursor: 'pointer' }} />
              <kbd className="kbd">⌘K</kbd>
            </div>
            <div className="editor-topbar-actions">
              <button className="btn btn-ghost" onClick={() => setShowAI(true)}><Sparkles size={15} /> Ask AI</button>
              <button className="btn btn-ghost" onClick={() => setShowHelp(true)}><HelpCircle size={15} /></button>
              <button className="btn btn-ghost" onClick={() => { window.open(`/dashboard#doc-${activeNote}`, '_blank'); addToast('Opened in new tab.', 'info') }}><ArrowUpRight size={15} /></button>
            </div>
          </div>

          <div className="editor-doc-header">
            <div className="editor-breadcrumb">
              {currentDoc.breadcrumb.map((item, i) => (
                <span key={i}>
                  {i > 0 && <span className="breadcrumb-sep"> › </span>}
                  <span className={`breadcrumb-item ${i === currentDoc.breadcrumb.length - 1 ? 'active' : ''}`}>{item}</span>
                </span>
              ))}
            </div>
            <div className="editor-doc-actions">
              <span className="editor-saved"><Bookmark size={14} /> Saved</span>
              <Star size={16} className={`editor-action-icon ${starred[activeNote] ? 'star' : ''}`}
                fill={starred[activeNote] ? 'var(--color-orange)' : 'none'}
                onClick={() => { setStarred(p => ({ ...p, [activeNote]: !p[activeNote] })); addToast(starred[activeNote] ? 'Removed from favorites.' : 'Added to favorites!', 'info') }} />
              <Clock size={16} className="editor-action-icon" onClick={() => setShowVersions(true)} />
              <MessageSquare size={16} className="editor-action-icon" onClick={() => setShowComments(true)} />
              <div className="avatar-group editor-collaborators">
                {docCollaborators.map((a, i) => <div key={i} className="avatar avatar-xs" style={{ backgroundColor: a.color }}>{a.initials}</div>)}
              </div>
              <button className="btn btn-primary editor-share-btn" onClick={() => setShowShare(true)}><Share2 size={14} /> Share</button>
              <div className="more-wrapper">
                <MoreHorizontal size={16} className="editor-action-icon" onClick={() => setShowMore(!showMore)} />
                {showMore && (
                  <div className="more-dropdown">
                    <div className="more-option" onClick={handleExport}><Download size={14} /> Export as Markdown</div>
                    <div className="more-option" onClick={handleDuplicate}><Files size={14} /> Duplicate</div>
                    <div className="more-option danger" onClick={handleMoveToTrash}><Trash size={14} /> Move to trash</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="editor-content">
            <div className="editor-author">
              <div className="avatar avatar-sm" style={{ backgroundColor: currentDoc.author.color }}>{currentDoc.author.initials}</div>
              <span className="editor-author-name">{currentDoc.author.name}</span>
              <span className="editor-author-sep">·</span>
              <span className="editor-author-time">Updated {currentDoc.updatedAgo}</span>
              {currentDoc.editingNow > 0 && <><span className="editor-author-sep">·</span><span className="editor-editing-badge">● {currentDoc.editingNow} editing now</span></>}
            </div>
            <article className="editor-doc-body">
              <h1 className="doc-title">{currentDoc.title}</h1>
              {currentDoc.content.map((block, i) => {
                switch (block.type) {
                  case 'paragraph': return <p key={i} className="doc-paragraph">{block.text}</p>
                  case 'heading': return <h2 key={i} className="doc-heading-2">{block.text}</h2>
                  case 'callout': return <div key={i} className="doc-callout"><span className="doc-callout-icon">{block.icon}</span><p>{block.text}</p></div>
                  case 'bullet': return <div key={i} className="doc-check-item"><span className="doc-bullet" />{block.text}</div>
                  case 'check': return (
                    <div key={i} className={`doc-check-item ${block.checked ? 'checked' : ''}`} onClick={() => toggleCheck(block.id)} style={{ cursor: 'pointer' }}>
                      {block.checked ? <CheckSquare size={16} className="doc-check-icon checked" /> : <Square size={16} className="doc-check-icon" />}
                      {block.text}
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
    <div className={`sidebar-item ${active ? 'active' : ''}`} onClick={onClick}>
      <Icon size={15} /><span>{label}</span>
      {badge && <span className="badge">{badge}</span>}
    </div>
  )
}
