import { useState } from 'react'
import './Sidebar.css'

const BOTTOM_NAV = [
  {
    label: 'Promotion',
    icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 10V6l9-4v12L2 10z"/><path d="M2 10h3v3l-3-3z"/></svg>,
  },
  {
    label: 'Analytics',
    icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="2,12 5,7 8,9 11,4 14,6"/></svg>,
  },
  {
    label: 'Finance',
    icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="6"/><path d="M8 5v6M6 6.5h3a1 1 0 0 1 0 2H7a1 1 0 0 0 0 2h3"/></svg>,
  },
  {
    label: 'Rights',
    icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M8 2l5 2v4c0 3-2.5 5.5-5 6-2.5-.5-5-3-5-6V4l5-2z"/></svg>,
  },
  {
    label: 'Admin',
    icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="2"/><path d="M8 2v1M8 13v1M2 8h1M13 8h1M4 4l.7.7M11.3 11.3l.7.7M4 12l.7-.7M11.3 4.7l.7-.7"/></svg>,
  },
]

const Chevron = () => (
  <svg className="nav-chevron" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6,4 10,8 6,12"/>
  </svg>
)

export default function Sidebar({ activeView, onNavigate }) {
  const [catalogOpen, setCatalogOpen] = useState(true)

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-logo">believe.</span>
        <button className="sidebar-bell" aria-label="Notifications">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M8 2a5 5 0 0 1 5 5v2.5l1 1.5H2l1-1.5V7a5 5 0 0 1 5-5z"/>
            <path d="M6.5 13.5a1.5 1.5 0 0 0 3 0"/>
          </svg>
        </button>
      </div>

      <nav className="sidebar-nav">
        <button className="nav-item nav-create">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M8 3v10M3 8h10"/></svg>
          Create new
        </button>

        <button className="nav-item">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="7" cy="7" r="4"/><line x1="10.5" y1="10.5" x2="14" y2="14"/></svg>
          Search
        </button>

        <button className="nav-item">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="2" width="5" height="5" rx="1"/><rect x="9" y="2" width="5" height="5" rx="1"/><rect x="2" y="9" width="5" height="5" rx="1"/><rect x="9" y="9" width="5" height="5" rx="1"/></svg>
          Overview
        </button>

        <button
          className={`nav-item nav-item--expandable${catalogOpen ? ' nav-item--open' : ''}`}
          onClick={() => setCatalogOpen(o => !o)}
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="2" width="12" height="12" rx="1"/><path d="M2 6h12M2 10h12"/></svg>
          Catalog
          <Chevron />
        </button>

        {catalogOpen && (
          <div className="nav-subitems">
            <button
              className={`nav-sub${activeView === 'releases' ? ' active' : ''}`}
              onClick={() => onNavigate('releases')}
            >
              Releases
            </button>
            <button
              className={`nav-sub${activeView === 'drafts' ? ' active' : ''}`}
              onClick={() => onNavigate('drafts')}
            >
              Drafts
            </button>
            <button className="nav-sub">
              Favorites
            </button>
          </div>
        )}

        {BOTTOM_NAV.map(({ label, icon }) => (
          <button key={label} className="nav-item nav-item--expandable">
            {icon}
            {label}
            <Chevron />
          </button>
        ))}

        <div className="nav-spacer" />

        <button className="nav-item nav-help">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="6"/><path d="M8 7v4"/><circle cx="8" cy="5.5" r="0.5" fill="currentColor" stroke="none"/></svg>
          Help &amp; support
        </button>
      </nav>

      <div className="sidebar-user">
        <div className="user-avatar">ET</div>
        <div className="user-info">
          <div className="user-name">Emilie Tan</div>
          <div className="user-email">emilie.tan@believe.com</div>
        </div>
      </div>
    </aside>
  )
}
