import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  state = { error: null }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: "40px", color: "#f87171", fontFamily: "monospace", background: "#09090b", minHeight: "100vh" }}>
          <h2 style={{ color: "#fff", marginBottom: "16px" }}>Runtime Error</h2>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: "13px" }}>{this.state.error.toString()}</pre>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: "11px", color: "#666", marginTop: "12px" }}>{this.state.error.stack}</pre>
          <button onClick={() => { localStorage.clear(); window.location.href = "/" }}
            style={{ marginTop: "24px", padding: "10px 20px", background: "#818cf8", border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer" }}>
            Clear storage & reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
)
