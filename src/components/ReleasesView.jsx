import { useState } from 'react'
import ReleaseRow from './ReleaseRow'
import BulkActionBar from './BulkActionBar'
import Pagination from './Pagination'
import FilterChip from './FilterChip'
import './ReleasesView.css'

const RELEASES = [
  {
    id: 1,
    title: 'Frequency',
    artist: 'Echo Park',
    trackCount: 1,
    upc: '3615939491415',
    type: 'video',
    subtype: null,
    account: 'Echo Park',
    date: '24/03/2026',
    time: '11:15',
    status: 'delivered',
    infoText: null,
    infoColor: null,
    cover: 'https://picsum.photos/seed/freq1/80/80',
  },
  {
    id: 2,
    title: 'Frequency',
    artist: 'Echo Park',
    trackCount: 8,
    upc: '3615939491420',
    type: 'music',
    subtype: null,
    account: 'Echo Park',
    date: '24/03/2026',
    time: '11:15',
    status: 'delivered',
    infoText: '1 track taken down',
    infoColor: '#b45309',
    cover: 'https://picsum.photos/seed/freq2/80/80',
  },
  {
    id: 3,
    title: 'Night Ritual',
    artist: 'Kira Voss',
    trackCount: 7,
    upc: '3615939491422',
    type: 'ring',
    subtype: null,
    account: 'Kira Voss',
    date: '02/05/2026',
    time: null,
    status: 'review',
    infoText: 'Submitted 30/04/2026',
    infoColor: '#9aa0b0',
    cover: 'https://picsum.photos/seed/nightr/80/80',
  },
  {
    id: 4,
    title: 'No Signal',
    artist: 'Lena Maris',
    trackCount: 8,
    upc: '3615939491419',
    type: 'music',
    subtype: null,
    account: 'Lena Maris',
    date: '24/03/2026',
    time: null,
    status: 'action',
    infoText: 'Artwork rejected',
    infoColor: '#e63a52',
    cover: 'https://picsum.photos/seed/nosig/80/80',
  },
  {
    id: 5,
    title: 'Saudade',
    artist: 'Maëva Cruz',
    trackCount: 10,
    upc: '3615939491417',
    type: 'music',
    subtype: 'Physical',
    account: 'Maëva Cruz',
    date: '24/03/2026',
    time: null,
    status: 'sent',
    infoText: 'Validated 03/04/2026',
    infoColor: '#9aa0b0',
    cover: 'https://picsum.photos/seed/saud/80/80',
  },
  {
    id: 6,
    title: 'Breath Again',
    artist: 'Abstrak Kid',
    trackCount: 9,
    upc: '3615939491417',
    type: 'music',
    subtype: null,
    account: 'Abstrak Kid',
    date: '24/03/2026',
    time: null,
    status: 'takedown',
    infoText: 'In progress',
    infoColor: '#b45309',
    cover: 'https://picsum.photos/seed/breath/80/80',
  },
  {
    id: 7,
    title: 'Formless',
    artist: 'Drift State',
    trackCount: 1,
    upc: '3615939491417',
    type: 'video',
    subtype: 'MV',
    account: 'Drift State',
    date: '24/03/2026',
    time: null,
    status: 'takedown',
    infoText: 'Removed 08/02/2026',
    infoColor: '#9aa0b0',
    cover: 'https://picsum.photos/seed/forml/80/80',
  },
  {
    id: 8,
    title: 'Entre 2',
    artist: 'Solène',
    trackCount: 1,
    upc: '3615939491417',
    type: 'ring',
    subtype: 'Ringtone',
    account: 'Solène',
    date: '24/03/2026',
    time: null,
    status: 'delivered',
    infoText: null,
    infoColor: null,
    cover: 'https://picsum.photos/seed/entre/80/80',
  },
]

const PEOPLE = ['Echo Park', 'Kira Voss', 'Lena Maris', 'Maëva Cruz', 'Abstrak Kid', 'Drift State', 'Solène']
const STATUS_OPTIONS = ['Delivered', 'Under review', 'Action requested', 'Sent to DSPs', 'Taken down']

const ARTIST_AVATAR_SEEDS = {
  'Echo Park':  'ep_av', 'Kira Voss': 'kv_av', 'Lena Maris': 'lm_av',
  'Maëva Cruz': 'mc_av', 'Abstrak Kid': 'ak_av', 'Drift State': 'ds_av', 'Solène': 'sol_av',
}

const RELEASE_COUNTS = RELEASES.reduce((acc, r) => {
  acc[r.account] = (acc[r.account] || 0) + 1
  return acc
}, {})

function Toolbar({ search, onSearch, filters, onFilter }) {
  const getAvatarSrc = name => `https://picsum.photos/seed/${ARTIST_AVATAR_SEEDS[name]}/80/80`
  const getMeta = name => { const c = RELEASE_COUNTS[name]; return c ? `${c} release${c !== 1 ? 's' : ''}` : null }

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
          <span className="search-kbd">⌘K</span>
        </div>
        <FilterChip label="Account"      options={PEOPLE}          value={filters.account} onChange={v => onFilter('account', v)} multi showSearch avatarType="initials" getMeta={getMeta} />
        <FilterChip label="Artist"       options={PEOPLE}          value={filters.artist}  onChange={v => onFilter('artist',  v)} multi showSearch avatarType="photo" getAvatarSrc={getAvatarSrc} getMeta={getMeta} />
        <FilterChip label="Status"       options={STATUS_OPTIONS}  value={filters.status}  onChange={v => onFilter('status',  v)} multi />
        <FilterChip label="Release date" value={filters.date}      onChange={v => onFilter('date', v)} type="date" />
      </div>
    </div>
  )
}

export default function ReleasesView() {
  const [selected, setSelected] = useState(new Set())
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ account: [], artist: [], status: [], date: null })

  const STATUS_LABEL_MAP = {
    delivered: 'Delivered', review: 'Under review', action: 'Action requested',
    sent: 'Sent to DSPs', takedown: 'Taken down',
  }

  const handleFilter = (key, value) => setFilters(f => ({ ...f, [key]: value }))

  const filtered = RELEASES.filter(r => {
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.artist.toLowerCase().includes(search.toLowerCase())) return false
    if (filters.account.length && !filters.account.includes(r.account)) return false
    if (filters.artist.length  && !filters.artist.includes(r.artist))   return false
    if (filters.status.length  && !filters.status.includes(STATUS_LABEL_MAP[r.status])) return false
    return true
  })

  const toggleSelect = (id, checked) => {
    setSelected(prev => {
      const next = new Set(prev)
      checked ? next.add(id) : next.delete(id)
      return next
    })
  }

  const clearSelection = () => setSelected(new Set())

  return (
    <div className="view-container">
      <div className="view-header">
        <div className="view-header-left">
          <h1 className="view-title">Releases</h1>
        </div>
        <div className="view-header-right">
          <button className="btn-export">Export</button>
        </div>
      </div>

      <Toolbar search={search} onSearch={setSearch} filters={filters} onFilter={handleFilter} />

      <div className="list-container">
        <div className="list-table-header">
          <div style={{width: 48}}></div>
          <div className="th" style={{flex:'2'}}>Releases (300)</div>
          <div className="th" style={{width:164}}>Account</div>
          <div className="th" style={{width:164}}>Release date</div>
          <div className="th" style={{width:164}}>Status</div>
          <div className="th" style={{flex:'1'}}>Information</div>
          <div style={{width:48}}></div>
        </div>

        <div className="list-rows">
          {filtered.map(r => (
            <ReleaseRow
              key={r.id}
              release={r}
              selected={selected.has(r.id)}
              onSelect={checked => toggleSelect(r.id, checked)}
            />
          ))}
        </div>

        <Pagination page={page} rowsPerPage={10} total={300} onPage={setPage} />
      </div>

      <BulkActionBar
        count={selected.size}
        onClear={clearSelection}
        actions={[
          { label: 'Export CSV', onClick: () => {} },
          { label: '♡', onClick: () => {} },
        ]}
      />
    </div>
  )
}
