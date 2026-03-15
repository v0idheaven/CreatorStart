import Sidebar from './components/Sidebar'

function App() {
  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)' }}>
      <Sidebar />
      <main style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
        <p style={{ color: 'var(--text)' }}>Main content here</p>
      </main>
    </div>
  )
}

export default App