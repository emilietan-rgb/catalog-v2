import { useState } from 'react'
import ReleaseRow from './ReleaseRow'
import BulkActionBar from './BulkActionBar'
import Pagination from './Pagination'
import FilterChip from './FilterChip'
import './ReleasesView.css'

import { RELEASES } from '../data/catalog'

const ARTISTS  = [...new Set(RELEASES.map(r => r.artist))].sort()
const ACCOUNTS = [...new Set(RELEASES.map(r => r.account))].sort()
const STATUS_OPTIONS = ['Delivered', 'Under review', 'Action required', 'Sent to DSPs', 'Taken down']

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

const ARTIST_RELEASE_COUNTS  = RELEASES.reduce((acc, r) => { acc[r.artist]  = (acc[r.artist]  || 0) + 1; return acc }, {})
const ACCOUNT_RELEASE_COUNTS = RELEASES.reduce((acc, r) => { acc[r.account] = (acc[r.account] || 0) + 1; return acc }, {})

const STATUS_LABEL_MAP = {
  delivered: 'Delivered',
  review:    'Under review',
  action:    'Action required',
  sent:      'Sent to DSPs',
  takedown:  'Taken down',
}

function Toolbar({ search, onSearch, filters, onFilter, onClearFilters }) {
  const getAvatarSrc  = name => `https://picsum.photos/seed/${ARTIST_AVATAR_SEEDS[name] || 'default'}/80/80`
  const getArtistMeta = name => { const c = ARTIST_RELEASE_COUNTS[name];  return c ? `${c} release${c !== 1 ? 's' : ''}` : null }
  const getAccountMeta= name => { const c = ACCOUNT_RELEASE_COUNTS[name]; return c ? `${c} release${c !== 1 ? 's' : ''}` : null }

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <div className="search-wrap">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L14 14"/></svg>
          <input
            className="search-input"
            type="text"
            placeholder="Search releases…"
            value={search}
            onChange={e => onSearch(e.target.value)}
          />
          {search
            ? <button className="search-clear" onClick={() => onSearch('')} aria-label="Clear search">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 3l10 10M13 3L3 13"/></svg>
              </button>
            : <span className="search-kbd">⌘K</span>
          }
        </div>
        <FilterChip label="Account" options={ACCOUNTS} value={filters.account} onChange={v => onFilter('account', v)} multi showSearch avatarType="initials" getMeta={getAccountMeta} />
        <FilterChip label="Artist"  options={ARTISTS}  value={filters.artist}  onChange={v => onFilter('artist',  v)} multi showSearch avatarType="photo" getAvatarSrc={getAvatarSrc} getMeta={getArtistMeta} />
        <FilterChip label="Status"  options={STATUS_OPTIONS} value={filters.status} onChange={v => onFilter('status', v)} multi />
        <FilterChip label="Release date" value={filters.date} onChange={v => onFilter('date', v)} type="date" />
        {(filters.account.length > 0 || filters.artist.length > 0 || filters.status.length > 0 || filters.date) && (
          <button className="btn-clear-filters" onClick={onClearFilters}>Clear</button>
        )}
      </div>
    </div>
  )
}

export default function ReleasesView({ onOpenRelease, favorites = [], onToggleFavorite, trackOverrides = {} }) {
  const [selected, setSelected] = useState(new Set())
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ account: [], artist: [], status: [], date: null })

  const handleFilter = (key, value) => { setFilters(f => ({ ...f, [key]: value })); setPage(1) }

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

  const filtered = RELEASES.filter(r => {
    if (search) {
      const q = search.toLowerCase()
      const matchRelease = r.title.toLowerCase().includes(q) || r.artist.toLowerCase().includes(q)
      const matchTrack   = (r.tracklist || []).some(t =>
        t.title.toLowerCase().includes(q) || (t.isrc && t.isrc.toLowerCase().includes(q))
      )
      if (!matchRelease && !matchTrack) return false
    }
    if (filters.account.length && !filters.account.includes(r.account)) return false
    if (filters.artist.length  && !filters.artist.includes(r.artist))   return false
    if (filters.status.length  && !filters.status.includes(STATUS_LABEL_MAP[r.status])) return false
    if (!matchesDateFilter(r.releaseDate, filters.date)) return false
    return true
  }).sort((a, b) => {
    const da = parseDate(a.releaseDate)
    const db = parseDate(b.releaseDate)
    if (!da && !db) return 0
    if (!da) return 1
    if (!db) return -1
    return db - da
  })

  const pageRows = filtered.slice((page - 1) * 10, page * 10)

  const toggleSelect = (id, checked) => {
    setSelected(prev => {
      const next = new Set(prev)
      checked ? next.add(id) : next.delete(id)
      return next
    })
  }

  const clearSelection = () => setSelected(new Set())

  const ACTIONS_BY_STATUS = {
    delivered: ['Export CSV', 'Add to favorites'],
    review:    ['Export CSV', 'Add to favorites', 'Cancel submission'],
    sent:      ['Export CSV', 'Add to favorites', 'Cancel delivery'],
    action:    ['Export CSV', 'Add to favorites', 'View issues'],
    takedown:  ['Export CSV', 'Add to favorites', 'Restore'],
  }

  const selectedReleases = RELEASES.filter(r => selected.has(r.id))
  const bulkActions = selectedReleases.length === 0 ? [] : selectedReleases
    .map(r => ACTIONS_BY_STATUS[r.status] || ['Export CSV'])
    .reduce((common, actions) => common.filter(a => actions.includes(a)))
    .map(label => ({
      label,
      onClick: label === 'Add to favorites'
        ? () => { selectedReleases.forEach(r => { if (!favorites.includes(r.id)) onToggleFavorite(r.id) }); clearSelection() }
        : () => {},
    }))

  return (
    <div className="view-container">
      <div className="view-header">
        <div className="view-header-left">
          <h1 className="view-title">Releases</h1>
        </div>
        <div className="view-header-right">
          <button className="btn-export">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 2v8M5 7l3 3 3-3M3 11v2h10v-2"/>
            </svg>
            Export releases
          </button>
        </div>
      </div>

      <Toolbar search={search} onSearch={setSearch} filters={filters} onFilter={handleFilter} onClearFilters={() => { setFilters({ account: [], artist: [], status: [], date: null }); setPage(1) }} />

      <div className="list-container">
        <div className="list-table-header">
          <div></div>
          <div className="th">Releases ({filtered.length})</div>
          <div className="th">Account</div>
          <div className="th">Release date</div>
          <div className="th">Status</div>
          <div className="th">Information</div>
          <div></div>
        </div>

        <div className="list-rows">
          {filtered.length === 0 ? (
            <div className="list-empty">
              <svg width="24" height="24" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" style={{ color: '#cdd3e2' }}>
                <circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L14 14"/>
              </svg>
              <span>No releases match your filters</span>
            </div>
          ) : (
            pageRows.map(r => {
              const overrides = trackOverrides[r.id] || {}
              const effectiveRelease = Object.keys(overrides).length === 0 ? r : {
                ...r,
                tracklist: (r.tracklist || []).map(t => ({ ...t, status: overrides[t.id] ?? t.status }))
              }
              return (
                <ReleaseRow
                  key={r.id}
                  release={effectiveRelease}
                  selected={selected.has(r.id)}
                  onSelect={checked => toggleSelect(r.id, checked)}
                  onOpen={() => onOpenRelease?.(r)}
                  isFavorited={favorites.includes(r.id)}
                  onToggleFavorite={() => onToggleFavorite?.(r.id)}
                />
              )
            })
          )}
        </div>

        <Pagination page={page} rowsPerPage={10} total={filtered.length} onPage={setPage} />
      </div>

      <BulkActionBar
        count={selected.size}
        onClear={clearSelection}
        actions={bulkActions}
      />
    </div>
  )
}
