import './Sidebar.css'

export default function Sidebar({ activeView, onNavigate }) {
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

        <div className="nav-section-label">Catalog</div>
        <div className="nav-subitems">
          <button
            className={`nav-sub${activeView === 'releases' ? ' active' : ''}`}
            onClick={() => onNavigate('releases')}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="2" width="12" height="12" rx="1"/><path d="M2 6h12M6 6v8"/></svg>
            Releases
          </button>
          <button
            className={`nav-sub${activeView === 'drafts' ? ' active' : ''}`}
            onClick={() => onNavigate('drafts')}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 2h6l4 4v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/><path d="M10 2v4h4"/></svg>
            Drafts
          </button>
          <button className="nav-sub">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="8,2 10.5,6.5 15.5,7.3 11.7,11 12.6,16 8,13.5 3.4,16 4.3,11 0.5,7.3 5.5,6.5"/></svg>
            Favorites
          </button>
        </div>

        <div className="nav-spacer" />

        {['Promotion','Analytics','Finance','Rights','Admin'].map(label => (
          <button key={label} className="nav-item">{label}</button>
        ))}

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
