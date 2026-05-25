import { useState } from 'react'
import { RELEASES } from '../data/catalog'
import StatusBadge from './StatusBadge'
import FilterChip from './FilterChip'
import './ReleasesView.css'
import './FavoritesView.css'

const STATUS_OPTIONS = ['Delivered', 'Under review', 'Sent to DSPs', 'Not delivered']
const STATUS_LABEL_MAP = {
  delivered: 'Delivered',
  review:    'Under review',
  action:    'Not delivered',
  sent:      'Sent to DSPs',
  takedown:  'Not delivered',
}

const ALERT_GROUPS = [
  { label: 'Issues',    options: ['Back to producer', 'Copyright alert', 'Blacklisted'] },
  { label: 'Takedowns', options: ['Track taken down', 'Release taken down'] },
]

function getAlertCategories(release) {
  const tracklist = release.tracklist
  if (tracklist && tracklist.length) {
    const allTakenDown = tracklist.every(t => t.status === 'takedown-progress' || t.status === 'takedown')
    if (allTakenDown) return ['Release taken down']
    const hasTrackTakedown = tracklist.some(t => t.status === 'takedown-progress' || t.status === 'takedown')
    if (hasTrackTakedown) return ['Track taken down']
  }
  const info = release.info
  if (!info) return []
  if (info.includes('taken down') || info.includes('takedown')) return ['Track taken down']
  if (info === 'Correction requested' || info === 'Back to producer') return ['Back to producer']
  if (info === 'Copyright alert') return ['Copyright alert']
  if (info === 'Blacklisted') return ['Blacklisted']
  return []
}

const ARTIST_AVATAR_SEEDS = {
  'Aurélie Dumas':     'aurelie_av',
  'Doux Rêve':         'doux_av',
  'Neon Waves':        'neon_av',
  'Marco & The Drift': 'marco_av',
  'Null Pointer':      'null_av',
  'Solange Mireille':  'solange_av',
  'Éclat':             'eclat_av',
  'Cassian Bleu':      'cassian_av',
}

function TypeIcon({ type, subtype }) {
  if (subtype === 'Physical') return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ color: '#ff852f', flexShrink: 0 }}>
      <circle cx="8" cy="8" r="6"/><circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  )
  if (type === 'video') return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ color: '#9aa0b0', flexShrink: 0 }}>
      <rect x="2" y="3" width="10" height="10" rx="1"/><path d="M12 6l3-2v8l-3-2"/>
    </svg>
  )
  if (type === 'ring') return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ color: '#9aa0b0', flexShrink: 0 }}>
      <path d="M8 2a5 5 0 0 1 5 5v2.5l1 1.5H2l1-1.5V7a5 5 0 0 1 5-5z"/><path d="M6.5 13.5a1.5 1.5 0 0 0 3 0"/>
    </svg>
  )
  return null
}

function HeartFilledIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 13.5S2 9.3 2 5.5a3.5 3.5 0 0 1 6-2.4A3.5 3.5 0 0 1 14 5.5c0 3.8-6 8-6 8z"/>
    </svg>
  )
}

export default function FavoritesView({ favorites = [], onToggleFavorite, onOpenRelease }) {
  const [search, setSearch]   = useState('')
  const [filters, setFilters] = useState({ account: [], artist: [], status: [], alerts: [], date: null })

  const items = RELEASES.filter(r => favorites.includes(r.id))

  const ARTISTS  = [...new Set(items.map(r => r.artist))].sort()
  const ACCOUNTS = [...new Set(items.map(r => r.account))].sort()

  const artistReleaseCounts  = items.reduce((acc, r) => { acc[r.artist]  = (acc[r.artist]  || 0) + 1; return acc }, {})
  const accountReleaseCounts = items.reduce((acc, r) => { acc[r.account] = (acc[r.account] || 0) + 1; return acc }, {})

  const getAvatarSrc  = name => `https://picsum.photos/seed/${ARTIST_AVATAR_SEEDS[name] || 'default'}/80/80`
  const getArtistMeta = name => { const c = artistReleaseCounts[name];  return c ? `${c} release${c !== 1 ? 's' : ''}` : null }
  const getAccountMeta= name => { const c = accountReleaseCounts[name]; return c ? `${c} release${c !== 1 ? 's' : ''}` : null }

  const handleFilter = (key, value) => setFilters(f => ({ ...f, [key]: value }))
  const clearFilters = () => setFilters({ account: [], artist: [], status: [], alerts: [], date: null })

  const parseDate = str => {
    if (!str || str === '—') return null
    const [d, m, y] = str.split('/')
    return new Date(+y, +m - 1, +d)
  }

  const matchesDateFilter = (releaseDate, filter) => {
    if (!filter) return true
    const date = parseDate(releaseDate)
    if (!date) return false
    const now = new Date()
    if (filter === 'This week') {
      const mon = new Date(now); mon.setDate(now.getDate() - ((now.getDay() + 6) % 7)); mon.setHours(0,0,0,0)
      const sun = new Date(mon); sun.setDate(mon.getDate() + 6); sun.setHours(23,59,59,999)
      return date >= mon && date <= sun
    }
    if (filter === 'This month')
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    if (filter === 'Last 3 months') {
      const from = new Date(now); from.setMonth(now.getMonth() - 3)
      return date >= from && date <= now
    }
    if (filter === 'This year')
      return date.getFullYear() === now.getFullYear()
    if (filter.includes('→')) {
      const [fromStr, toStr] = filter.split('→').map(s => s.trim())
      const from = parseDate(fromStr); const to = parseDate(toStr)
      if (!from || !to) return true
      to.setHours(23,59,59,999)
      return date >= from && date <= to
    }
    return true
  }

  const hasActiveFilter = filters.account.length > 0 || filters.artist.length > 0 || filters.status.length > 0 || filters.alerts.length > 0 || filters.date

  const filtered = items.filter(r => {
    if (search) {
      const q = search.toLowerCase()
      if (!r.title.toLowerCase().includes(q) && !r.artist.toLowerCase().includes(q)) return false
    }
    if (filters.account.length && !filters.account.includes(r.account)) return false
    if (filters.artist.length  && !filters.artist.includes(r.artist))   return false
    if (filters.date   && !matchesDateFilter(r.releaseDate, filters.date)) return false
    if (filters.status.length  && !filters.status.includes(STATUS_LABEL_MAP[r.status])) return false
    if (filters.alerts.length) {
      const cats = getAlertCategories(r)
      if (!filters.alerts.some(a => cats.includes(a))) return false
    }
    return true
  })

  if (items.length === 0) {
    return (
      <div className="fav-container">
        <div className="view-header">
          <div className="view-header-left">
            <h1 className="view-title">Favorites</h1>
          </div>
        </div>
        <div className="fav-empty">
          <svg width="32" height="32" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#cdd3e2' }}>
            <path d="M8 13.5S2 9.3 2 5.5a3.5 3.5 0 0 1 6-2.4A3.5 3.5 0 0 1 14 5.5c0 3.8-6 8-6 8z"/>
          </svg>
          <p className="fav-empty-title">No favorites yet</p>
          <p className="fav-empty-sub">Heart a release from the list to save it here.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fav-container">
      <div className="view-header">
        <div className="view-header-left">
          <h1 className="view-title">Favorites</h1>
        </div>
      </div>

      <div className="toolbar">
        <div className="toolbar-left">
          <div className="search-wrap">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L14 14"/></svg>
            <input
              className="search-input"
              type="text"
              placeholder="Search for release, track, ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search
              ? <button className="search-clear" onClick={() => setSearch('')} aria-label="Clear search">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 3l10 10M13 3L3 13"/></svg>
                </button>
              : <span className="search-kbd">⌘K</span>
            }
          </div>
          <FilterChip label="Account" options={ACCOUNTS} value={filters.account} onChange={v => handleFilter('account', v)} multi showSearch avatarType="initials" getMeta={getAccountMeta} />
          <FilterChip label="Artist"  options={ARTISTS}  value={filters.artist}  onChange={v => handleFilter('artist',  v)} multi showSearch avatarType="photo" getAvatarSrc={getAvatarSrc} getMeta={getArtistMeta} />
          <FilterChip label="Release date" value={filters.date} onChange={v => handleFilter('date', v)} type="date" />
          <FilterChip label="Status"  options={STATUS_OPTIONS} value={filters.status} onChange={v => handleFilter('status', v)} multi />
          <FilterChip label="Alerts" groups={ALERT_GROUPS} value={filters.alerts} onChange={v => handleFilter('alerts', v)} multi />
          {(search || hasActiveFilter) && (
            <button className="btn-clear-filters" onClick={() => { clearFilters(); setSearch('') }}>Clear</button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="fav-empty">
          <svg width="24" height="24" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" style={{ color: '#cdd3e2' }}>
            <circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L14 14"/>
          </svg>
          <p className="fav-empty-title">No favorites match your filters</p>
        </div>
      ) : (
        <div className="fav-grid">
          {filtered.map(r => (
            <div key={r.id} className="fav-card" onClick={() => onOpenRelease?.(r)}>
              <div className="fav-card-cover">
                {r.coverImage
                  ? <img src={r.coverImage} alt={r.title} />
                  : <div className="fav-card-placeholder">
                      <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M9 3v7.5a2.5 2.5 0 1 1-2-2.45V3h2z"/>
                      </svg>
                    </div>
                }
                <button
                  className="fav-card-heart"
                  onClick={e => { e.stopPropagation(); onToggleFavorite?.(r.id) }}
                  title="Remove from favorites"
                >
                  <HeartFilledIcon />
                </button>
              </div>
              <div className="fav-card-info">
                <span className="fav-card-title-row">
                  <TypeIcon type={r.type} subtype={r.subtype} />
                  <span className="fav-card-title">{r.title}</span>
                </span>
                <span className="fav-card-artist">{r.artist}</span>
                <StatusBadge status={r.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
