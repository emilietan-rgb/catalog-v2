import { useState } from 'react'
import Sidebar from './components/Sidebar'
import ReleasesView from './components/ReleasesView'
import DraftsView from './components/DraftsView'
import FavoritesView from './components/FavoritesView'
import ReleasePage from './components/ReleasePage'
import './App.css'

function loadFavorites() {
  try { return JSON.parse(localStorage.getItem('favorites') || '[]') } catch { return [] }
}

export default function App() {
  const [activeView, setActiveView]   = useState('releases')
  const [openRelease, setOpenRelease] = useState(null)
  const [favorites, setFavorites]     = useState(loadFavorites)

  const toggleFavorite = id => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      localStorage.setItem('favorites', JSON.stringify(next))
      return next
    })
  }

  const handleNavigate = view => { setActiveView(view); setOpenRelease(null) }

  return (
    <div className="app-shell">
      <Sidebar
        activeView={activeView}
        onNavigate={handleNavigate}
        favoritesCount={favorites.length}
      />
      <main className="main-content">
        {openRelease ? (
          <ReleasePage
            release={openRelease}
            onBack={() => setOpenRelease(null)}
            isFavorited={favorites.includes(openRelease.id)}
            onToggleFavorite={() => toggleFavorite(openRelease.id)}
          />
        ) : (
          <>
            {activeView === 'releases'  && <ReleasesView onOpenRelease={setOpenRelease} favorites={favorites} onToggleFavorite={toggleFavorite} />}
            {activeView === 'drafts'    && <DraftsView />}
            {activeView === 'favorites' && <FavoritesView favorites={favorites} onToggleFavorite={toggleFavorite} onOpenRelease={r => setOpenRelease(r)} />}
          </>
        )}
      </main>
    </div>
  )
}
