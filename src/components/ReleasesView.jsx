import { useState } from 'react'
import ReleaseRow from './ReleaseRow'
import BulkActionBar from './BulkActionBar'
import Pagination from './Pagination'
import FilterChip from './FilterChip'
import './ReleasesView.css'

const RELEASES = [
  { id:2,  title:'Phosphène',            artist:'Doux Rêve',          trackCount:2,  upc:'196871000102', status:'delivered',type:'music', subtype:'Physical',  info:'1 track taken down',    account:'Lumière Records', releaseDate:'12/03/2026', releaseTime:'10:00', coverImage:'https://images.unsplash.com/photo-1619376269004-7e287504b323?q=80&w=400', tracklist:[{id:1,title:'Phosphène',version:'Original',isrc:'FR-DRV-26-001',duration:'3:42',status:'live'},{id:2,title:'Phosphène',version:'Reprise',isrc:'FR-DRV-26-002',duration:'3:38',status:'takedown'}] },
  { id:3,  title:'Hypnose',              artist:'Neon Waves',          trackCount:10, upc:'196871000201', status:'review',   type:'music', subtype:null,       info:'Submitted 28/04/2026',  account:'Neon Records',    releaseDate:'20/05/2026', releaseTime:'08:00', coverImage:'https://images.unsplash.com/photo-1614302102862-16c84d59f855?q=80&w=400', tracklist:[{id:1,title:'Hypnose',version:'Original',isrc:'FR-NWV-26-001',duration:'4:12',status:'live'},{id:2,title:'Hypnose',version:'Radio Edit',isrc:'FR-NWV-26-002',duration:'3:28',status:'live'},{id:3,title:'Hypnose',version:'Instrumental',isrc:'FR-NWV-26-003',duration:'4:12',status:'live'},{id:4,title:'Courants',version:'Original',isrc:'FR-NWV-26-004',duration:'3:55',status:'live'},{id:5,title:'Flux',version:'Original',isrc:'FR-NWV-26-005',duration:'3:18',status:'live'},{id:6,title:'Onde',version:'Original',isrc:'FR-NWV-26-006',duration:'4:02',status:'live'},{id:7,title:'Résonance',version:'Original',isrc:'FR-NWV-26-007',duration:'3:44',status:'live'},{id:8,title:'Signal',version:'Original',isrc:'FR-NWV-26-008',duration:'3:29',status:'live'},{id:9,title:'Fréquence',version:'Original',isrc:'FR-NWV-26-009',duration:'4:08',status:'live'},{id:10,title:'Silence',version:'Original',isrc:'FR-NWV-26-010',duration:'5:12',status:'live'}] },
  { id:4,  title:'Dérives',              artist:'Marco & The Drift',  trackCount:1,  upc:'196871000202', status:'review',   type:'video', subtype:'Video',    info:'Submitted 30/04/2026',  account:'Drift Music',     releaseDate:'15/05/2026', releaseTime:null,  coverImage:'https://images.unsplash.com/photo-1565437919135-fd813caf3540?q=80&w=400', tracklist:[{id:1,title:'Dérives',version:'Original',isrc:'FR-MTD-26-001',duration:'3:52',status:'live'}] },
  { id:5,  title:'Zéro Kelvin',          artist:'Null Pointer',        trackCount:4,  upc:'196871000203', status:'sent',     type:'music', subtype:null,       info:null,                    account:'Null Records',    releaseDate:'18/05/2026', releaseTime:'00:00', coverImage:'https://images.unsplash.com/photo-1579284209845-8476c2eb0fde?q=80&w=400', tracklist:[{id:1,title:'Zéro Kelvin',version:'Original',isrc:'FR-NPT-26-001',duration:'4:22',status:'live'},{id:2,title:'Zéro Kelvin',version:'Radio Edit',isrc:'FR-NPT-26-002',duration:'3:30',status:'live'},{id:3,title:'Absolu',version:'Original',isrc:'FR-NPT-26-003',duration:'3:48',status:'live'},{id:4,title:'Vide',version:'Original',isrc:'FR-NPT-26-004',duration:'5:02',status:'live'}] },
  { id:6,  title:'Solstice',             artist:'Solange Mireille',   trackCount:7,  upc:'196871000204', status:'sent',     type:'music', subtype:null,       info:null,                    account:'Mireille Music',  releaseDate:'21/06/2026', releaseTime:'08:00', coverImage:'https://images.unsplash.com/photo-1666185761628-00a3655f4f7b?q=80&w=400', tracklist:[{id:1,title:'Solstice',version:'Original',isrc:'FR-SMR-26-001',duration:'4:15',status:'live'},{id:2,title:'Solstice',version:'Instrumental',isrc:'FR-SMR-26-002',duration:'4:15',status:'live'},{id:3,title:'Équinoxe',version:'Original',isrc:'FR-SMR-26-003',duration:'3:42',status:'live'},{id:4,title:'Aurore',version:'Original',isrc:'FR-SMR-26-004',duration:'3:58',status:'live'},{id:5,title:'Crépuscule',version:'Original',isrc:'FR-SMR-26-005',duration:'4:32',status:'live'},{id:6,title:'Midi',version:'Original',isrc:'FR-SMR-26-006',duration:'3:18',status:'live'},{id:7,title:'Minuit',version:'Original',isrc:'FR-SMR-26-007',duration:'5:44',status:'live'}] },
  { id:7,  title:'Midnight Frequencies', artist:'Neon Waves',          trackCount:9,  upc:'196871000701', status:'action',   type:'music', subtype:null,       info:'Audio quality', account:'Neon Records',  releaseDate:'01/05/2026', releaseTime:'00:00', coverImage:'https://images.unsplash.com/photo-1646464824553-879b506b7a2d?q=80&w=400', tracklist:[{id:1,title:'Midnight Frequencies',version:'Original',isrc:'FR-NWV-26-011',duration:'4:05',status:'live'},{id:2,title:'Midnight Frequencies',version:'Radio Edit',isrc:'',duration:'3:28',status:'live'},{id:3,title:'Dark Signal',version:'Original',isrc:'FR-NWV-26-013',duration:'3:52',status:'live'},{id:4,title:'Night Wave',version:'Original',isrc:'FR-NWV-26-014',duration:'4:18',status:'live'},{id:5,title:'AM',version:'Original',isrc:'FR-NWV-26-015',duration:'3:35',status:'live'},{id:6,title:'FM',version:'Original',isrc:'FR-NWV-26-016',duration:'3:42',status:'live'},{id:7,title:'Static',version:'Original',isrc:'FR-NWV-26-017',duration:'4:02',status:'live'},{id:8,title:'Broadcast',version:'Original',isrc:'FR-NWV-26-018',duration:'3:28',status:'live'},{id:9,title:'Signal Lost',version:'Original',isrc:'FR-NWV-26-019',duration:'5:15',status:'live'}] },
  { id:8,  title:'Tessellate',           artist:'Éclat',               trackCount:4,  upc:'196871000801', status:'action',   type:'music', subtype:null,       info:'Artwork rejected',      account:'Éclat Music',     releaseDate:'10/05/2026', releaseTime:null,  coverImage:'https://images.unsplash.com/photo-1677468679328-732c647338e9?q=80&w=400', tracklist:[{id:1,title:'Tessellate',version:'Original',isrc:'FR-ECL-26-001',duration:'3:48',status:'live'},{id:2,title:'Tessellate',version:'Radio Edit',isrc:'FR-ECL-26-002',duration:'3:12',status:'live'},{id:3,title:'Fragments',version:'Original',isrc:'FR-ECL-26-003',duration:'4:22',status:'live'},{id:4,title:'Mosaïque',version:'Original',isrc:'FR-ECL-26-004',duration:'3:55',status:'live'}] },
  { id:9,  title:'Analogique',           artist:'Cassian Bleu',        trackCount:2,  upc:'196871000901', status:'takedown', type:'music', subtype:null,       info:'In progress',           account:'Bleu Label',      releaseDate:'15/01/2026', releaseTime:null,  coverImage:'https://images.unsplash.com/photo-1771795530901-7b569b8e585d?q=80&w=400', tracklist:[{id:1,title:'Analogique',version:'Original',isrc:'FR-CBL-26-001',duration:'4:12',status:'takedown'},{id:2,title:'Analogique',version:'Instrumental',isrc:'FR-CBL-26-002',duration:'4:12',status:'takedown'}] },
  { id:10, title:'Première Lumière',     artist:'Aurélie Dumas',     trackCount:1,  upc:'196871001001', status:'takedown', type:'music', subtype:null,       info:'Removed 03/02/2026',    account:'Lumière Records', releaseDate:'10/10/2025', releaseTime:null,  coverImage:'https://images.unsplash.com/photo-1654303440866-a53cd1285cc3?q=80&w=400', tracklist:[{id:1,title:'Première Lumière',version:'Original',isrc:'FR-ADM-26-001',duration:'3:28',status:'takedown'}] },
  { id:11, title:'Cascade',              artist:'Aurélie Dumas',     trackCount:2,  upc:'196871001101', status:'delivered',type:'music', subtype:null,       info:null,                    account:'Lumière Records', releaseDate:'14/04/2026', releaseTime:'14:00', coverImage:'https://images.unsplash.com/photo-1690993660127-1a7cdd87ec9e?q=80&w=400', tracklist:[{id:1,title:'Cascade',version:'Original',isrc:'FR-ADM-26-002',duration:'3:42',status:'live'},{id:2,title:'Cascade',version:'Acoustic',isrc:'FR-ADM-26-003',duration:'3:38',status:'live'}] },
  { id:12, title:'Chrome',               artist:'Neon Waves',          trackCount:1,  upc:'196871001401', status:'delivered',type:'ring',  subtype:'Ringtone', info:null,                    account:'Neon Records',    releaseDate:'01/03/2026', releaseTime:null,  coverImage:'https://images.unsplash.com/photo-1625513035102-fb52db47979b?q=80&w=400', tracklist:[{id:1,title:'Chrome',version:'Ringtone edit',isrc:'FR-NWV-26-020',duration:'0:30',status:'live'}] },
  { id:13, title:'Éclipse Dorée',        artist:'Aurélie Dumas',     trackCount:9,  upc:'196871001201', status:'delivered',type:'music', subtype:null,       info:null,                    account:'Lumière Records', releaseDate:'20/02/2026', releaseTime:'10:00', coverImage:'https://images.unsplash.com/photo-1634149135793-7e8027d3ce20?q=80&w=400', tracklist:[{id:1,title:'Éclipse Dorée',version:'Original',isrc:'FR-ADM-26-004',duration:'4:18',status:'live'},{id:2,title:'Aurore',version:'Original',isrc:'FR-ADM-26-005',duration:'3:52',status:'live'},{id:3,title:'Crépuscule',version:'Original',isrc:'FR-ADM-26-006',duration:'4:05',status:'live'},{id:4,title:'Zénith',version:'Original',isrc:'FR-ADM-26-007',duration:'3:38',status:'live'},{id:5,title:'Nadir',version:'Original',isrc:'FR-ADM-26-008',duration:'4:22',status:'live'},{id:6,title:'Pénombre',version:'Original',isrc:'FR-ADM-26-009',duration:'3:48',status:'live'},{id:7,title:'Lumière',version:'Original',isrc:'FR-ADM-26-010',duration:'5:02',status:'live'},{id:8,title:'Ombre',version:'Original',isrc:'FR-ADM-26-011',duration:'3:28',status:'live'},{id:9,title:'Éclat',version:'Original',isrc:'FR-ADM-26-012',duration:'4:44',status:'live'}] },
  { id:14, title:'Synthétique',          artist:'Neon Waves',          trackCount:8,  upc:'196871001301', status:'delivered',type:'music', subtype:null,       info:null,                    account:'Neon Records',    releaseDate:'10/03/2026', releaseTime:'08:00', coverImage:'https://images.unsplash.com/photo-1604955123743-3bcf76e1f486?q=80&w=400', tracklist:[{id:1,title:'Synthétique',version:'Original',isrc:'FR-NWV-26-021',duration:'4:02',status:'live'},{id:2,title:'Analogique',version:'Original',isrc:'FR-NWV-26-022',duration:'3:48',status:'live'},{id:3,title:'Numérique',version:'Original',isrc:'FR-NWV-26-023',duration:'3:55',status:'live'},{id:4,title:'Binaire',version:'Original',isrc:'FR-NWV-26-024',duration:'4:12',status:'live'},{id:5,title:'Pixel',version:'Original',isrc:'FR-NWV-26-025',duration:'3:28',status:'live'},{id:6,title:'Vecteur',version:'Original',isrc:'FR-NWV-26-026',duration:'4:35',status:'live'},{id:7,title:'Algorithme',version:'Original',isrc:'FR-NWV-26-027',duration:'3:42',status:'live'},{id:8,title:'Code',version:'Original',isrc:'FR-NWV-26-028',duration:'5:18',status:'live'}] },
  { id:15, title:'Soleil Levant',        artist:'Marco & The Drift',  trackCount:4,  upc:'196871001501', status:'delivered',type:'music', subtype:null,       info:null,                    account:'Drift Music',     releaseDate:'28/03/2026', releaseTime:'06:00', coverImage:'https://images.unsplash.com/photo-1639490204002-e38aef42e021?q=80&w=400', tracklist:[{id:1,title:'Soleil Levant',version:'Original',isrc:'FR-MTD-26-002',duration:'4:28',status:'live'},{id:2,title:'Aube',version:'Original',isrc:'FR-MTD-26-003',duration:'3:52',status:'live'},{id:3,title:'Matin',version:'Original',isrc:'FR-MTD-26-004',duration:'3:38',status:'live'},{id:4,title:'Midi',version:'Original',isrc:'FR-MTD-26-005',duration:'4:15',status:'live'}] },
  { id:16, title:'Brouillard',           artist:'Éclat',               trackCount:7,  upc:'196871001701', status:'delivered',type:'music', subtype:null,       info:null,                    account:'Éclat Music',     releaseDate:'05/02/2026', releaseTime:null,  coverImage:'https://images.unsplash.com/photo-1559825195-0cebb6ea1d18?q=80&w=400', tracklist:[{id:1,title:'Brouillard',version:'Original',isrc:'FR-ECL-26-005',duration:'4:02',status:'live'},{id:2,title:'Givre',version:'Original',isrc:'FR-ECL-26-006',duration:'3:48',status:'live'},{id:3,title:'Buée',version:'Original',isrc:'FR-ECL-26-007',duration:'3:55',status:'live'},{id:4,title:'Vapeur',version:'Original',isrc:'FR-ECL-26-008',duration:'4:22',status:'live'},{id:5,title:'Nuage',version:'Original',isrc:'FR-ECL-26-009',duration:'3:38',status:'live'},{id:6,title:'Brume',version:'Original',isrc:'FR-ECL-26-010',duration:'4:48',status:'live'},{id:7,title:'Voile',version:'Original',isrc:'FR-ECL-26-011',duration:'5:02',status:'live'}] },
  { id:17, title:'Kernel Panic',         artist:'Null Pointer',        trackCount:8,  upc:'196871001901', status:'delivered',type:'music', subtype:null,       info:null,                    account:'Null Records',    releaseDate:'15/01/2026', releaseTime:'00:00', coverImage:'https://images.unsplash.com/photo-1639746292626-690a884030b5?q=80&w=400', tracklist:[{id:1,title:'Kernel Panic',version:'Original',isrc:'FR-NPT-26-005',duration:'4:18',status:'live'},{id:2,title:'Stack Overflow',version:'Original',isrc:'FR-NPT-26-006',duration:'3:52',status:'live'},{id:3,title:'Segfault',version:'Original',isrc:'FR-NPT-26-007',duration:'3:38',status:'live'},{id:4,title:'Deadlock',version:'Original',isrc:'FR-NPT-26-008',duration:'4:02',status:'live'},{id:5,title:'Race Condition',version:'Original',isrc:'FR-NPT-26-009',duration:'3:48',status:'live'},{id:6,title:'Memory Leak',version:'Original',isrc:'FR-NPT-26-010',duration:'4:35',status:'live'},{id:7,title:'Buffer',version:'Original',isrc:'FR-NPT-26-011',duration:'3:28',status:'live'},{id:8,title:'Cache',version:'Original',isrc:'FR-NPT-26-012',duration:'5:12',status:'live'}] },
  { id:18, title:'Minuit à Paris',       artist:'Solange Mireille',   trackCount:7,  upc:'196871002101', status:'delivered',type:'music', subtype:null,       info:null,                    account:'Mireille Music',  releaseDate:'14/02/2026', releaseTime:'00:00', coverImage:'https://images.unsplash.com/photo-1744058589034-1894cbcd4065?q=80&w=400', tracklist:[{id:1,title:'Minuit à Paris',version:'Original',isrc:'FR-SMR-26-008',duration:'4:12',status:'live'},{id:2,title:'Pigalle',version:'Original',isrc:'FR-SMR-26-009',duration:'3:48',status:'live'},{id:3,title:'Montmartre',version:'Original',isrc:'FR-SMR-26-010',duration:'3:55',status:'live'},{id:4,title:'Seine',version:'Original',isrc:'FR-SMR-26-011',duration:'4:22',status:'live'},{id:5,title:'Marais',version:'Original',isrc:'FR-SMR-26-012',duration:'3:38',status:'live'},{id:6,title:'Bastille',version:'Original',isrc:'FR-SMR-26-013',duration:'4:48',status:'live'},{id:7,title:'République',version:'Original',isrc:'FR-SMR-26-014',duration:'5:02',status:'live'}] },
  { id:19, title:'Aquarelle',            artist:'Doux Rêve',          trackCount:8,  upc:'196871002301', status:'delivered',type:'music', subtype:null,       info:null,                    account:'Lumière Records', releaseDate:'08/03/2026', releaseTime:null,  coverImage:'https://images.unsplash.com/photo-1508865896381-9e8a88f5ec94?q=80&w=400', tracklist:[{id:1,title:'Aquarelle',version:'Original',isrc:'FR-DRV-26-003',duration:'4:05',status:'live'},{id:2,title:'Pastel',version:'Original',isrc:'FR-DRV-26-004',duration:'3:52',status:'live'},{id:3,title:'Lavis',version:'Original',isrc:'FR-DRV-26-005',duration:'3:38',status:'live'},{id:4,title:'Encre',version:'Original',isrc:'FR-DRV-26-006',duration:'4:18',status:'live'},{id:5,title:'Gouache',version:'Original',isrc:'FR-DRV-26-007',duration:'3:48',status:'live'},{id:6,title:'Tempera',version:'Original',isrc:'FR-DRV-26-008',duration:'4:32',status:'live'},{id:7,title:'Fresque',version:'Original',isrc:'FR-DRV-26-009',duration:'3:28',status:'live'},{id:8,title:'Toile',version:'Original',isrc:'FR-DRV-26-010',duration:'5:15',status:'live'}] },
  { id:20, title:'Brûme de mer',         artist:'Cassian Bleu',        trackCount:7,  upc:'196871002501', status:'delivered',type:'music', subtype:null,       info:null,                    account:'Bleu Label',      releaseDate:'22/03/2026', releaseTime:null,  coverImage:'https://images.unsplash.com/photo-1600180073523-fa4a48f9b8b3?q=80&w=400', tracklist:[{id:1,title:'Brûme de mer',version:'Original',isrc:'FR-CBL-26-003',duration:'4:22',status:'live'},{id:2,title:'Embruns',version:'Original',isrc:'FR-CBL-26-004',duration:'3:48',status:'live'},{id:3,title:'Marée',version:'Original',isrc:'FR-CBL-26-005',duration:'3:55',status:'live'},{id:4,title:'Vague',version:'Original',isrc:'FR-CBL-26-006',duration:'4:12',status:'live'},{id:5,title:'Écume',version:'Original',isrc:'FR-CBL-26-007',duration:'3:38',status:'live'},{id:6,title:'Sel',version:'Original',isrc:'FR-CBL-26-008',duration:'4:48',status:'live'},{id:7,title:'Iode',version:'Original',isrc:'FR-CBL-26-009',duration:'5:02',status:'live'}] },
  { id:21, title:'404',                  artist:'Null Pointer',        trackCount:1,  upc:'196871002001', status:'delivered',type:'video', subtype:'Video',    info:null,                    account:'Null Records',    releaseDate:'18/03/2026', releaseTime:null,  coverImage:'https://images.unsplash.com/photo-1601518296869-26176c7d9436?q=80&w=400', tracklist:[{id:1,title:'404',version:'Original',isrc:'FR-NPT-26-013',duration:'3:45',status:'live'}] },
  { id:22, title:'Rosée',                artist:'Doux Rêve',           trackCount:1,  upc:'196871003401', status:'delivered',type:'video', subtype:'Video',    info:null,                    account:'Lumière Records', releaseDate:'25/02/2026', releaseTime:null,  coverImage:'https://images.unsplash.com/photo-1484589065579-248aad0d8b13?q=80&w=400', tracklist:[{id:1,title:'Rosée',version:'Original',isrc:'FR-DRV-26-011',duration:'3:28',status:'live'}] },
  { id:23, title:'Velours',              artist:'Solange Mireille',    trackCount:1,  upc:'196871002201', status:'delivered',type:'video', subtype:'Video',    info:null,                    account:'Mireille Music',  releaseDate:'12/01/2026', releaseTime:null,  coverImage:'https://images.unsplash.com/photo-1607059991241-58ea9e39fd1b?q=80&w=400', tracklist:[{id:1,title:'Velours',version:'Original',isrc:'FR-SMR-26-015',duration:'4:02',status:'live'}] },
]

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

function Toolbar({ search, onSearch, filters, onFilter }) {
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
          <span className="search-kbd">⌘K</span>
        </div>
        <FilterChip label="Account" options={ACCOUNTS} value={filters.account} onChange={v => onFilter('account', v)} multi showSearch avatarType="initials" getMeta={getAccountMeta} />
        <FilterChip label="Artist"  options={ARTISTS}  value={filters.artist}  onChange={v => onFilter('artist',  v)} multi showSearch avatarType="photo" getAvatarSrc={getAvatarSrc} getMeta={getArtistMeta} />
        <FilterChip label="Status"  options={STATUS_OPTIONS} value={filters.status} onChange={v => onFilter('status', v)} multi />
        <FilterChip label="Release date" value={filters.date} onChange={v => onFilter('date', v)} type="date" />
      </div>
    </div>
  )
}

export default function ReleasesView({ onOpenRelease }) {
  const [selected, setSelected] = useState(new Set())
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ account: [], artist: [], status: [], date: null })

  const handleFilter = (key, value) => { setFilters(f => ({ ...f, [key]: value })); setPage(1) }

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
    return true
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
    delivered: ['Export CSV', 'Request takedown'],
    review:    ['Export CSV', 'Cancel submission'],
    sent:      ['Export CSV', 'Cancel delivery'],
    action:    ['Export CSV', 'View issues'],
    takedown:  ['Export CSV', 'Restore'],
  }

  const selectedReleases = RELEASES.filter(r => selected.has(r.id))
  const bulkActions = selectedReleases.length === 0 ? [] : selectedReleases
    .map(r => ACTIONS_BY_STATUS[r.status] || ['Export CSV'])
    .reduce((common, actions) => common.filter(a => actions.includes(a)))
    .map(label => ({ label, onClick: () => {} }))

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
          <div className="th" style={{flex:'2'}}>Releases ({filtered.length})</div>
          <div className="th" style={{width:164}}>Account</div>
          <div className="th" style={{width:164}}>Release date</div>
          <div className="th" style={{width:164}}>Status</div>
          <div className="th" style={{flex:'1'}}>Information</div>
          <div style={{width:48}}></div>
        </div>

        <div className="list-rows">
          {pageRows.map(r => (
            <ReleaseRow
              key={r.id}
              release={r}
              selected={selected.has(r.id)}
              onSelect={checked => toggleSelect(r.id, checked)}
              onOpen={() => onOpenRelease?.(r)}
            />
          ))}
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
