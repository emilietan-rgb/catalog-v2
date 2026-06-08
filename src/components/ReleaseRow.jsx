import { useState, useEffect } from 'react'
import StatusBadge from './StatusBadge'
import './ReleaseRow.css'

function ArtistDialog({ artist, label = 'artist', onClose }) {
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="rr-overlay" onMouseDown={onClose}>
      <div className="rr-dialog" onMouseDown={e => e.stopPropagation()}>
        <div className="rr-dialog-header">
          <h3 className="rr-dialog-title">Open {label} page</h3>
          <button className="rr-dialog-close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M3 3l10 10M13 3L3 13"/>
            </svg>
          </button>
        </div>
        <p className="rr-dialog-body">
          This will redirect you to the {label} page for {artist}.
        </p>
        <p className="rr-dialog-note">Prototype — link not active</p>
      </div>
    </div>
  )
}

function tooltipLabel(type, subtype) {
  if (subtype === 'Physical') return 'Physical distribution'
  if (type === 'video') return 'Video'
  if (type === 'ring') return 'Ringtone'
  return null
}

function TypeIconWithTooltip({ type, subtype }) {
  const label = tooltipLabel(type, subtype)
  if (!label) return null

  return (
    <span className="type-icon-wrap">
      {subtype === 'Physical' ? (
        <svg className="type-icon type-icon--physical" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="8" cy="8" r="6"/>
          <circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none"/>
        </svg>
      ) : type === 'video' ? (
        <svg className="type-icon" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <rect x="2" y="3" width="10" height="10" rx="1"/>
          <path d="M12 6l3-2v8l-3-2"/>
        </svg>
      ) : (
        <svg className="type-icon" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M8 2a5 5 0 0 1 5 5v2.5l1 1.5H2l1-1.5V7a5 5 0 0 1 5-5z"/>
          <path d="M6.5 13.5a1.5 1.5 0 0 0 3 0"/>
        </svg>
      )}
      <span className="type-tooltip">{label}</span>
    </span>
  )
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const [dd, mm, yyyy] = dateStr.split('/')
  return `${dd} ${MONTHS[parseInt(mm, 10) - 1]} ${yyyy}`
}

function getDerivedStatus(release) {
  if (release.status !== 'delivered') return release.status
  const tracklist = release.tracklist
  if (!tracklist || !tracklist.length) return release.status
  const allTakenDown = tracklist.every(t => t.status === 'takedown-progress' || t.status === 'takedown')
  return allTakenDown ? 'takedown' : release.status
}

function getTrackDerivedInfo(release) {
  const tracklist = release.tracklist
  if (!tracklist || !tracklist.length) return null
  const allTakenDown = tracklist.every(t => t.status === 'takedown-progress' || t.status === 'takedown')
  if (allTakenDown) return { text: 'Release taken down', color: '#0F1012', icon: 'renew' }
  const progressCount = tracklist.filter(t => t.status === 'takedown-progress').length
  if (progressCount > 0) {
    return { text: `${progressCount} ${progressCount === 1 ? 'track' : 'tracks'} taken down`, color: '#0F1012', icon: 'renew' }
  }
  const takenDownCount = tracklist.filter(t => t.status === 'takedown').length
  if (takenDownCount > 0) {
    return { text: `${takenDownCount} ${takenDownCount === 1 ? 'track' : 'tracks'} taken down`, color: '#0F1012', icon: 'block' }
  }
  return null
}

function getInfoColor(status, info) {
  if (!info) return '#9aa0b0'
  if (status === 'action') return '#0F1012'
  if (info.includes('taken down') || info.includes('takedown in progress')) return '#0F1012'
  if (info === 'Copyright alert' || info === 'Locked' || info === 'Delivery issue') return '#0F1012'
  return '#9aa0b0'
}

function getInfoIcon(info) {
  if (!info) return undefined
  if (info.includes('takedown in progress') || info.includes('taken down')) return 'block'
  if (info === 'Blacklisted') return 'block'
  if (info === 'Copyright alert' || info === 'Locked' || info === 'Delivery issue') return 'alert'
  return undefined
}

function getInfoVariant(status, info) {
  if (status === 'action') return 'action'
  if (info && (info.includes('takedown in progress') || info.includes('taken down'))) return 'action'
  if (info === 'Copyright alert' || info === 'Locked' || info === 'Delivery issue') return 'action'
  return undefined
}

function AlertIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="6"/>
      <path d="M8 5v3.5"/>
      <circle cx="8" cy="11" r="0.6" fill={color} stroke="none"/>
    </svg>
  )
}

function BlockIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="6"/>
      <path d="M3.5 3.5l9 9"/>
    </svg>
  )
}

function RenewIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M13 8a5 5 0 1 1-1.5-3.5"/>
      <path d="M11 2l1.5 2.5L10 6"/>
    </svg>
  )
}

function getExploitation(status) {
  if (status === 'delivered' || status === 'on_hold') return { label: 'Sellable', variant: 'success' }
  if (status === 'takedown' || status === 'removed' || status === 'action')
    return { label: 'Unsellable', variant: 'neutral' }
  if (status === 'draft')               return { label: 'Draft', variant: 'neutral' }
  if (status === 'awaiting_correction') return { label: 'Awaiting correction', variant: 'danger' }
  if (status === 'review')              return { label: 'To approve', variant: 'purple' }
  return { label: 'Not commercialized', variant: 'neutral' }
}

const CHIP_EDIT_ICON = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M11 2l3 3-8 8H3v-3l8-8z"/>
  </svg>
)

const CHIP_SCHEDULE_ICON = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <circle cx="8" cy="8" r="6"/>
    <path d="M8 5v3.5l2 2"/>
  </svg>
)

const CHIP_CHECK_ICON = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <circle cx="8" cy="8" r="6"/>
    <path d="M5.5 8l2 2 3-3"/>
  </svg>
)

const CHIP_BLOCK_ICON = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ flexShrink: 0 }}>
    <circle cx="8" cy="8" r="6"/>
    <path d="M3.5 3.5l9 9"/>
  </svg>
)

function ExploitationChip({ status }) {
  const { label, variant } = getExploitation(status)
  const icon = status === 'draft' || status === 'awaiting_correction' ? CHIP_EDIT_ICON
             : status === 'review'    ? CHIP_SCHEDULE_ICON
             : (status === 'delivered' || status === 'on_hold') ? CHIP_CHECK_ICON
             : (status === 'takedown' || status === 'removed' || status === 'action') ? CHIP_BLOCK_ICON
             : null
  return (
    <span className={`exploitation-chip exploitation-chip--${variant}`}>
      {icon}
      {label}
    </span>
  )
}

function InfoLine({ text, color, icon, variant }) {
  if (!text) return null
  const cls = `release-info-line${variant ? ` release-info-line--${variant}` : ''}`
  const iconEl = icon === 'alert' ? <AlertIcon color={color || '#9aa0b0'} />
               : icon === 'renew' ? <RenewIcon color={color || '#9aa0b0'} />
               : icon === 'block' ? <BlockIcon color={color || '#9aa0b0'} />
               : null
  return (
    <span className={cls} style={{ color: color || '#9aa0b0', display: 'flex', alignItems: 'center', gap: '4px' }}>
      {iconEl}
      {text}
    </span>
  )
}


export default function ReleaseRow({ release, selected, onSelect, onOpen, isFavorited, onToggleFavorite }) {
  const derivedStatus = getDerivedStatus(release)
  const hasAction = release.status === 'action'
  const [artistDialog, setArtistDialog] = useState(false)
  const [accountDialog, setAccountDialog] = useState(false)
  const [copied, setCopied] = useState(false)

  function handleCopyUpc(e) {
    e.stopPropagation()
    navigator.clipboard.writeText(release.upc)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className={`release-row${selected ? ' selected' : ''}${hasAction ? ' has-action' : ''}`} onClick={onOpen}>
      {/* Checkbox */}
      <div className="release-cell-check">
        <input
          type="checkbox"
          checked={selected}
          onChange={e => onSelect(e.target.checked)}
          onClick={e => e.stopPropagation()}
        />
      </div>

      {/* Entity cell: cover + title/subtitle */}
      <div className="release-cell-release">
        <div className="release-cover">
          {release.coverImage
            ? <img src={release.coverImage} alt={release.title} width="48" height="48" />
            : <div className="cover-placeholder">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M9 3v7.5a2.5 2.5 0 1 1-2-2.45V3h2z"/>
                </svg>
              </div>
          }
        </div>
        <div className="release-info">
          <div className="release-title-row">
            <TypeIconWithTooltip type={release.type} subtype={release.subtype} />
            <span className="release-title">{release.title}</span>
          </div>
          <div className="release-meta">
            <span className="release-trackcount">{release.trackCount === 0 ? '—' : `${release.trackCount} ${release.trackCount === 1 ? 'track' : 'tracks'}`}</span>
            <span className="meta-sep">·</span>
            <span
              className="release-artist"
              onClick={e => { e.stopPropagation(); setArtistDialog(true) }}
            >{release.artist}</span>
          </div>
        </div>
      </div>

      {/* UPC */}
      <div className="release-cell release-cell-upc">
        {release.status === 'draft' || release.status === 'review' ? (
          <span style={{ color: '#9aa0b0' }}>—</span>
        ) : (
          <>
            <span>{release.upc || '—'}</span>
            {release.upc && (
              <div className="upc-copy-wrap">
                <button className="upc-copy-btn" onClick={handleCopyUpc}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="5" width="8" height="9" rx="1"/>
                    <path d="M3 11V3a1 1 0 0 1 1-1h7"/>
                  </svg>
                </button>
                {copied && <span className="upc-copied-tooltip">Copied!</span>}
              </div>
            )}
          </>
        )}
      </div>

      {/* Release date */}
      <div className="release-cell release-cell-date">
        <span className="release-date-value">{formatDate(release.releaseDate)}</span>
        {release.releaseTime && <span className="release-time-value">{release.releaseTime}</span>}
      </div>

      {/* Exploitation */}
      <div className="release-cell release-cell-exploitation">
        <ExploitationChip status={release.status} />
      </div>

      {/* Status */}
      <div className="release-cell release-cell-status">
        {release.status === 'review' || release.status === 'draft' || release.status === 'awaiting_correction'
          ? <span style={{ color: '#9aa0b0' }}>—</span>
          : <StatusBadge status={derivedStatus} count={derivedStatus === 'delivered' ? 52 : undefined} />}
      </div>

      {/* Information */}
      <div className="release-cell release-cell-info">
        {(() => {
          if (derivedStatus === 'review') return null
          const derived = getTrackDerivedInfo(release)
          return derived
            ? <InfoLine text={derived.text} color={derived.color} icon={derived.icon} variant="action" />
            : <InfoLine text={release.info === 'Correction requested' ? 'Back to producer' : release.info} color={getInfoColor(derivedStatus, release.info)} icon={derivedStatus === 'action' ? 'alert' : getInfoIcon(release.info)} variant={getInfoVariant(derivedStatus, release.info)} />
        })()}
      </div>

      {/* Actions */}
      <div className="release-cell release-cell-actions"></div>

      {artistDialog && <ArtistDialog artist={release.artist} onClose={() => setArtistDialog(false)} />}
      {accountDialog && <ArtistDialog artist={release.account} label="account" onClose={() => setAccountDialog(false)} />}
    </div>
  )
}
