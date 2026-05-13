import { RELEASES } from '../data/catalog'
import StatusBadge from './StatusBadge'
import './FavoritesView.css'

function HeartFilledIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 13.5S2 9.3 2 5.5a3.5 3.5 0 0 1 6-2.4A3.5 3.5 0 0 1 14 5.5c0 3.8-6 8-6 8z"/>
    </svg>
  )
}

export default function FavoritesView({ favorites = [], onToggleFavorite, onOpenRelease }) {
  const items = RELEASES.filter(r => favorites.includes(r.id))

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
      <div className="fav-grid">
        {items.map(r => (
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
              <span className="fav-card-title">{r.title}</span>
              <span className="fav-card-artist">{r.artist}</span>
              <StatusBadge status={r.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
