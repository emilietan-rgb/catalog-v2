import { useState } from 'react'
import Sidebar from './components/Sidebar'
import ReleasesView from './components/ReleasesView'
import DraftsView from './components/DraftsView'
import ReleasePage from './components/ReleasePage'
import './App.css'

export default function App() {
  const [activeView, setActiveView] = useState('releases')
  const [openRelease, setOpenRelease] = useState(null)

  const handleNavigate = view => { setActiveView(view); setOpenRelease(null) }

  return (
    <div className="app-shell">
      <Sidebar activeView={activeView} onNavigate={handleNavigate} />
      <main className="main-content">
        {openRelease ? (
          <ReleasePage release={openRelease} onBack={() => setOpenRelease(null)} />
        ) : (
          <>
            {activeView === 'releases' && <ReleasesView onOpenRelease={setOpenRelease} />}
            {activeView === 'drafts'   && <DraftsView />}
          </>
        )}
      </main>
    </div>
  )
}
