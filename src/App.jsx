import { useState } from 'react'
import Sidebar from './components/Sidebar'
import ReleasesView from './components/ReleasesView'
import DraftsView from './components/DraftsView'
import './App.css'

export default function App() {
  const [activeView, setActiveView] = useState('releases')

  return (
    <div className="app-shell">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      <main className="main-content">
        {activeView === 'releases' && <ReleasesView />}
        {activeView === 'drafts' && <DraftsView />}
      </main>
    </div>
  )
}
