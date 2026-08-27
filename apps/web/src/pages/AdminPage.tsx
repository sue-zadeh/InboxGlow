import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Archive,
  Download,
  Inbox,
  KeyRound,
  LoaderCircle,
  LogOut,
  MailOpen,
  Search,
} from 'lucide-react'
import {
  DEMO_MODE,
  getAdminSession,
  getMessages,
  loginAdmin,
  logoutAdmin,
  updateMessageStatus,
  type ContactMessage,
} from '../lib/api'

type View = 'checking' | 'login' | 'dashboard'
type StatusFilter = 'ALL' | ContactMessage['status']

export default function AdminPage() {
  const [view, setView] = useState<View>('checking')
  const [password, setPassword] = useState('')
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')

  async function loadMessages() {
    setLoading(true)
    setError('')
    try {
      const result = await getMessages()
      setMessages(result.messages)
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to load messages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAdminSession()
      .then(() => {
        setView('dashboard')
        void loadMessages()
      })
      .catch(() => setView('login'))
  }, [])

  async function unlock(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await loginAdmin(password)
      setPassword('')
      setView('dashboard')
      await loadMessages()
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to sign in')
      setLoading(false)
    }
  }

  async function lockDashboard() {
    await logoutAdmin()
    setMessages([])
    setView('login')
  }

  async function changeStatus(id: string, status: ContactMessage['status']) {
    try {
      const { message } = await updateMessageStatus(id, status)
      setMessages((items) => items.map((item) => item.id === id ? message : item))
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to update the message')
    }
  }

  const filteredMessages = useMemo(() => {
    const normalisedQuery = query.trim().toLowerCase()
    return messages.filter((message) => {
      const matchesStatus = statusFilter === 'ALL' || message.status === statusFilter
      const matchesQuery = !normalisedQuery || [
        message.name,
        message.email,
        message.company,
        message.enquiryType,
        message.message,
      ].some((value) => value?.toLowerCase().includes(normalisedQuery))
      return matchesStatus && matchesQuery
    })
  }, [messages, query, statusFilter])

  function exportCsv() {
    const escape = (value: string | undefined) => `"${(value ?? '').replaceAll('"', '""')}"`
    const rows = [
      ['Date', 'Status', 'Name', 'Email', 'Phone', 'Company', 'Topic', 'Message'],
      ...filteredMessages.map((message) => [
        message.createdAt,
        message.status,
        message.name,
        message.email,
        message.phone ?? '',
        message.company ?? '',
        message.enquiryType,
        message.message,
      ]),
    ]
    const csv = rows.map((row) => row.map((value) => escape(value)).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `inboxglow-messages-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (view === 'checking') {
    return <main className="admin-login"><p className="dashboard-state"><LoaderCircle className="spin" /> Checking your session…</p></main>
  }

  if (view === 'login') {
    return (
      <main className="admin-login">
        <form onSubmit={unlock} className="login-card">
          <span className="brand-mark"><KeyRound size={20} /></span>
          <h1>Message dashboard</h1>
          <p>{DEMO_MODE ? 'Demo mode is active. Use any password to explore.' : 'Enter the admin password configured on your server.'}</p>
          {error && <p className="notice notice--error">{error}</p>}
          <label>
            <span>Admin password</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
          </label>
          <button className="submit-button" disabled={loading}>
            {loading ? <><LoaderCircle className="spin" size={18} /> Opening…</> : 'Open dashboard'}
          </button>
          <Link to="/">← Return to contact page</Link>
        </form>
      </main>
    )
  }

  return (
    <main className="dashboard">
      <header>
        <div><p className="eyebrow">InboxGlow {DEMO_MODE && '· Demo'}</p><h1>Messages</h1></div>
        <button className="ghost-button" onClick={lockDashboard}><LogOut size={17} /> Lock</button>
      </header>
      <section className="stats">
        <div><Inbox /><span><strong>{messages.length}</strong>Total messages</span></div>
        <div><MailOpen /><span><strong>{messages.filter((item) => item.status === 'NEW').length}</strong>New</span></div>
        <div><Archive /><span><strong>{messages.filter((item) => item.status === 'ARCHIVED').length}</strong>Archived</span></div>
      </section>
      <section className="dashboard-tools" aria-label="Message filters">
        <label className="search-box"><Search size={17} /><span className="sr-only">Search messages</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search messages…" /></label>
        <label><span className="sr-only">Filter by status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}><option value="ALL">All statuses</option><option value="NEW">New</option><option value="READ">Read</option><option value="ARCHIVED">Archived</option></select></label>
        <button className="ghost-button" onClick={exportCsv} disabled={filteredMessages.length === 0}><Download size={17} /> Export CSV</button>
      </section>
      {loading && <p className="dashboard-state"><LoaderCircle className="spin" /> Loading messages…</p>}
      {error && <p className="notice notice--error">{error}</p>}
      {!loading && !error && messages.length === 0 && <p className="dashboard-state">No messages yet. Your first enquiry will appear here.</p>}
      {!loading && messages.length > 0 && filteredMessages.length === 0 && <p className="dashboard-state">No messages match these filters.</p>}
      <section className="message-list" aria-live="polite">
        {filteredMessages.map((message) => (
          <article key={message.id} className={message.status === 'NEW' ? 'is-new' : ''}>
            <div className="message-top">
              <div><span className={`status status--${message.status.toLowerCase()}`}>{message.status}</span><h2>{message.name}</h2><a href={`mailto:${message.email}`}>{message.email}</a></div>
              <time dateTime={message.createdAt}>{new Intl.DateTimeFormat('en-NZ', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(message.createdAt))}</time>
            </div>
            <p className="message-topic">{message.enquiryType}{message.company ? ` · ${message.company}` : ''}</p>
            <p>{message.message}</p>
            <div className="message-actions">
              {message.status !== 'READ' && <button onClick={() => changeStatus(message.id, 'READ')}>Mark read</button>}
              {message.status !== 'ARCHIVED' && <button onClick={() => changeStatus(message.id, 'ARCHIVED')}>Archive</button>}
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
