import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  state = { error: null }
  static getDerivedStateFromError(error) { return { error } }
  componentDidCatch(error, info) {
    // Log to an error reporting service in production if needed
    if (process.env.NODE_ENV !== "production") {
      console.error("ErrorBoundary caught:", error, info)
    }
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: "40px", color: "#f87171", fontFamily: "monospace", background: "#09090b", minHeight: "100vh" }}>
          <h2 style={{ color: "#fff", marginBottom: "16px" }}>Runtime Error</h2>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: "13px" }}>{this.state.error.toString()}</pre>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: "11px", color: "#666", marginTop: "12px" }}>{this.state.error.stack}</pre>
          <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
            <button onClick={() => this.setState({ error: null })}
              style={{ padding: "10px 20px", background: "#27272a", border: "1px solid #3f3f46", borderRadius: "8px", color: "#fff", cursor: "pointer" }}>
              Try again
            </button>
            <button onClick={() => {
              localStorage.removeItem("accessToken")
              localStorage.removeItem("refreshToken")
              localStorage.removeItem("user")
              window.location.href = "/"
            }}
              style={{ padding: "10px 20px", background: "#2d8fa3", border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer" }}>
              Clear auth & reload
            </button>
          </div>
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
