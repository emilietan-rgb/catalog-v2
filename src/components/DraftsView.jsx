import { useState } from 'react'
import DraftRow from './DraftRow'
import BulkActionBar from './BulkActionBar'
import Pagination from './Pagination'
import './ReleasesView.css'

const DRAFTS = [
  {
    id: 1,
    title: 'Summer Call',
    artist: 'Echo Park',
    trackCount: 1,
    upc: null,
    type: 'video',
    subtype: 'MV',
    account: 'Echo Park',
    date: null,
    completeness: 40,
    completenessLabel: 'Artwork required',
  },
  {
    id: 2,
    title: 'Static Dreams',
    artist: 'Drift State',
    trackCount: 3,
    upc: null,
    type: 'music',
    subtype: null,
    account: 'Lumière Records',
    date: '10/04/2026',
    completeness: 70,
    completenessLabel: 'Release date missing',
  },
  {
    id: 3,
    title: 'Solar Wind',
    artist: 'Echo Park',
    trackCount: 6,
    upc: '602547000122',
    type: 'music',
    subtype: null,
    account: 'Echo Park',
    date: '10/04/2026',
    completeness: 100,
    completenessLabel: 'Ready to submit',
  },
  {
    id: 4,
    title: 'Vinyl Sessions Vol.2',
    artist: 'Various Artists',
    trackCount: 12,
    upc: null,
    type: 'music',
    subtype: 'Physical',
    account: 'Lumière Records',
    date: null,
    completeness: 25,
    completenessLabel: 'Missing fields',
  },
]

function Toolbar({ search, onSearch }) {
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
        {['Account','Artist','Status','Release date'].map(f => (
          <button key={f} className="filter-chip">{f} <span className="chip-caret">▾</span></button>
        ))}
      </div>
    </div>
  )
}

export default function DraftsView() {
  const [selected, setSelected] = useState(new Set())
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = DRAFTS.filter(d =>
    !search || d.title.toLowerCase().includes(search.toLowerCase()) || d.artist.toLowerCase().includes(search.toLowerCase())
  )

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
          <h1 className="view-title">Drafts</h1>
        </div>
        <div className="view-header-right">
          <button className="btn-create-primary">+ Create release</button>
        </div>
      </div>

      <Toolbar search={search} onSearch={setSearch} />

      <div className="list-container">
        <div className="list-header">
          <div className="list-count">Drafts (4)</div>
        </div>

        <div className="list-table-header">
          <div style={{width: 36}}></div>
          <div className="th" style={{flex:'2.4'}}>Release</div>
          <div className="th" style={{flex:'1'}}>Account</div>
          <div className="th" style={{width:110}}>Release date</div>
          <div className="th" style={{width:180}}>Completeness</div>
          <div style={{width:40}}></div>
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

        <Pagination page={page} rowsPerPage={10} total={4} onPage={setPage} />
      </div>

      <BulkActionBar
        count={selected.size}
        onClear={clearSelection}
        actions={[
          { label: 'Export CSV', onClick: () => {} },
          { label: 'Delete', onClick: () => {} },
        ]}
      />
    </div>
  )
}
