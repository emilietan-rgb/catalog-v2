import { useState } from 'react'
import ReleaseRow from './ReleaseRow'
import BulkActionBar from './BulkActionBar'
import Pagination from './Pagination'
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

function Toolbar({ search, onSearch }) {
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
        {['Account','Artist','Status','Release date'].map(f => (
          <button key={f} className="filter-chip">{f} <span className="chip-caret">▾</span></button>
        ))}
      </div>
    </div>
  )
}

export default function ReleasesView() {
  const [selected, setSelected] = useState(new Set())
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = RELEASES.filter(r =>
    !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.artist.toLowerCase().includes(search.toLowerCase())
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
          <h1 className="view-title">Releases</h1>
        </div>
        <div className="view-header-right">
          <button className="btn-export">Export</button>
        </div>
      </div>

      <Toolbar search={search} onSearch={setSearch} />

      <div className="list-container">
        <div className="list-header">
          <div className="list-count">Releases (300)</div>
        </div>

        <div className="list-table-header">
          <div style={{width: 36}}></div>
          <div className="th" style={{flex:'2.4'}}>Release</div>
          <div className="th" style={{flex:'1'}}>Account</div>
          <div className="th" style={{width:110}}>Release date</div>
          <div className="th" style={{width:180}}>Status</div>
          <div style={{width:40}}></div>
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
