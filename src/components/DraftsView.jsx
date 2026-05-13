import { useState } from 'react'
import DraftRow from './DraftRow'
import BulkActionBar from './BulkActionBar'
import Pagination from './Pagination'
import FilterChip from './FilterChip'
import './ReleasesView.css'

const DRAFTS = [
  { id:101, title:'Lueurs',               artist:'Aurélie Dumas',   trackCount:1,  upc:'196871000101', type:'music', subtype:null,       account:'Lumière Records', releaseDate:'—',          coverImage:'https://images.unsplash.com/photo-1667833966178-f98135a582f8?q=80&w=400', completeness:30,  completenessLabel:'Tracks missing'      },
  { id:1,   title:'Summer Call',          artist:'Echo Park',       trackCount:1,  upc:null,           type:'video', subtype:null,       account:'Echo Park',       releaseDate:null,         coverImage:'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=400', completeness:40,  completenessLabel:'Artwork required'    },
  { id:2,   title:'Static Dreams',        artist:'Drift State',     trackCount:3,  upc:null,           type:'music', subtype:null,       account:'Lumière Records', releaseDate:'10/04/2026', coverImage:'https://images.unsplash.com/photo-1618609377864-68609b857e90?q=80&w=400', completeness:70,  completenessLabel:'Release date missing'},
  { id:3,   title:'Solar Wind',           artist:'Echo Park',       trackCount:6,  upc:'602547000122', type:'music', subtype:null,       account:'Echo Park',       releaseDate:'10/04/2026', coverImage:'https://images.unsplash.com/photo-1504704911898-68304a7d2807?q=80&w=400', completeness:100, completenessLabel:'Ready to submit'    },
  { id:4,   title:'Vinyl Sessions Vol.2', artist:'Various Artists', trackCount:12, upc:null,           type:'music', subtype:'Physical', account:'Lumière Records', releaseDate:null,         coverImage:'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=400', completeness:25,  completenessLabel:'Missing fields'     },
]

const ARTISTS  = [...new Set(DRAFTS.map(d => d.artist))].sort()
const ACCOUNTS = [...new Set(DRAFTS.map(d => d.account))].sort()

const ARTIST_AVATAR_SEEDS = {
  'Aurélie Dumas':   'aurelie_av',
  'Echo Park':       'echo_av',
  'Drift State':     'drift_av',
  'Various Artists': 'various_av',
}

const ARTIST_DRAFT_COUNTS  = DRAFTS.reduce((acc, d) => { acc[d.artist]  = (acc[d.artist]  || 0) + 1; return acc }, {})
const ACCOUNT_DRAFT_COUNTS = DRAFTS.reduce((acc, d) => { acc[d.account] = (acc[d.account] || 0) + 1; return acc }, {})

function Toolbar({ search, onSearch, filters, onFilter }) {
  const getAvatarSrc   = name => `https://picsum.photos/seed/${ARTIST_AVATAR_SEEDS[name] || 'default'}/80/80`
  const getArtistMeta  = name => { const c = ARTIST_DRAFT_COUNTS[name];  return c ? `${c} draft${c !== 1 ? 's' : ''}` : null }
  const getAccountMeta = name => { const c = ACCOUNT_DRAFT_COUNTS[name]; return c ? `${c} draft${c !== 1 ? 's' : ''}` : null }

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <div className="search-wrap">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L14 14"/></svg>
          <input
            className="search-input"
            type="text"
            placeholder="Search drafts…"
            value={search}
            onChange={e => onSearch(e.target.value)}
          />
          <span className="search-kbd">⌘K</span>
        </div>
        <FilterChip label="Account" options={ACCOUNTS} value={filters.account} onChange={v => onFilter('account', v)} multi showSearch avatarType="initials" getMeta={getAccountMeta} />
        <FilterChip label="Artist"  options={ARTISTS}  value={filters.artist}  onChange={v => onFilter('artist',  v)} multi showSearch avatarType="photo" getAvatarSrc={getAvatarSrc} getMeta={getArtistMeta} />
        <FilterChip label="Release date" value={filters.date} onChange={v => onFilter('date', v)} type="date" />
      </div>
    </div>
  )
}

export default function DraftsView() {
  const [selected, setSelected] = useState(new Set())
  const [search, setSearch]     = useState('')
  const [page, setPage]         = useState(1)
  const [filters, setFilters]   = useState({ account: [], artist: [], date: null })

  const handleFilter = (key, value) => setFilters(f => ({ ...f, [key]: value }))

  const filtered = DRAFTS.filter(d => {
    if (search && !d.title.toLowerCase().includes(search.toLowerCase()) && !d.artist.toLowerCase().includes(search.toLowerCase())) return false
    if (filters.account.length && !filters.account.includes(d.account)) return false
    if (filters.artist.length  && !filters.artist.includes(d.artist))   return false
    return true
  })

  const toggleSelect = (id, checked) => {
    setSelected(prev => {
      const next = new Set(prev)
      checked ? next.add(id) : next.delete(id)
      return next
    })
  }

  const hasReadyToSubmit = DRAFTS.some(d => selected.has(d.id) && d.completeness >= 100)

  const bulkActions = [
    ...(hasReadyToSubmit ? [{ label: 'Submit for review', onClick: () => {} }] : []),
    { label: 'Delete', onClick: () => {} },
  ]

  return (
    <div className="view-container">
      <div className="view-header">
        <div className="view-header-left">
          <h1 className="view-title">Drafts</h1>
        </div>
        <div className="view-header-right">
          <button className="btn-create-primary">+ Create release</button>
        </div>
      </div>

      <Toolbar search={search} onSearch={setSearch} filters={filters} onFilter={handleFilter} />

      <div className="list-container">
        <div className="list-table-header">
          <div style={{width: 48}}></div>
          <div className="th" style={{flex:'1'}}>Drafts ({filtered.length})</div>
          <div className="th" style={{width:164}}>Account</div>
          <div className="th" style={{width:164}}>Release date</div>
          <div className="th" style={{width:164}}>Status</div>
          <div className="th" style={{width:164}}>Completeness</div>
          <div style={{width:48}}></div>
        </div>

        <div className="list-rows">
          {filtered.map(d => (
            <DraftRow
              key={d.id}
              draft={d}
              selected={selected.has(d.id)}
              onSelect={checked => toggleSelect(d.id, checked)}
            />
          ))}
        </div>

        <Pagination page={page} rowsPerPage={10} total={filtered.length} onPage={setPage} />
      </div>

      <BulkActionBar
        count={selected.size}
        onClear={() => setSelected(new Set())}
        actions={bulkActions}
      />
    </div>
  )
}
