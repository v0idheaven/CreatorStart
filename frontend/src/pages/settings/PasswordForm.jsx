import { useState } from "react"
import { Check, Eye, EyeOff, ChevronRight, Lock, LogOut, Trash2 } from "lucide-react"
import { apiFetch } from "../../utils/api"
import { API_ENDPOINTS } from "../../constants/api"

// Account section: change password + logout + delete rows
export default function PasswordForm({ accent, onLogout, onDelete }) {
  const [open, setOpen] = useState(false)
  const [pwCurrent, setPwCurrent] = useState("")
  const [pwNew, setPwNew] = useState("")
  const [pwConfirm, setPwConfirm] = useState("")
  const [pwError, setPwError] = useState("")
  const [pwSaved, setPwSaved] = useState(false)
  const [showPw, setShowPw] = useState(false)

  async function handleChangePassword() {
    setPwError("")
    if (!pwCurrent) { setPwError("Enter your current password."); return }
    if (pwNew.length < 6) { setPwError("New password must be at least 6 characters."); return }
    if (pwNew === pwCurrent) { setPwError("New password cannot be the same."); return }
    if (pwNew !== pwConfirm) { setPwError("Passwords do not match."); return }
    try {
      const res = await apiFetch(API_ENDPOINTS.updatePassword, { method: "PATCH", body: JSON.stringify({ currentPassword: pwCurrent, newPassword: pwNew }) })
      const data = await res.json()
      if (!res.ok) { setPwError(data.message || "Failed to update password"); return }
      setPwSaved(true); setPwCurrent(""); setPwNew(""); setPwConfirm("")
      setTimeout(() => { setPwSaved(false); setOpen(false) }, 2000)
    } catch {
      setPwError("Network error. Please check your connection.")
    }
  }

  function cancel() { setOpen(false); setPwError(""); setPwCurrent(""); setPwNew(""); setPwConfirm("") }

  return (
    <div className="settings-section">
      <p className="settings-section-label">Account</p>
      <div className="card settings-account-card">

        {/* Change password row */}
        <div className="settings-action-row" onClick={() => setOpen(p => !p)}>
          <div className="settings-action-icon" style={{ background: accent + "15" }}>
            <Lock size={14} color={accent} strokeWidth={2} />
          </div>
          <div className="settings-action-body">
            <p className="settings-action-title">Change Password</p>
            <p className="settings-action-sub">Update your login password</p>
          </div>
          <ChevronRight size={13} color="var(--dim)" className={open ? "chevron-open" : ""} />
        </div>

        {open && (
          <div className="settings-pw-form">
            <div>
              <label className="field-label">Current password</label>
              <input className="input-sm" type="password" value={pwCurrent} onChange={e => setPwCurrent(e.target.value)} placeholder="Enter current password" />
            </div>
            <div>
              <label className="field-label">New password</label>
              <div className="settings-pw-input-wrap">
                <input className="input-sm settings-pw-input" type={showPw ? "text" : "password"} value={pwNew} onChange={e => setPwNew(e.target.value)} placeholder="Min 6 characters" />
                <button onClick={() => setShowPw(p => !p)} className="settings-pw-toggle">
                  {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>
            <div>
              <label className="field-label">Confirm new password</label>
              <input className="input-sm" type="password" value={pwConfirm} onChange={e => setPwConfirm(e.target.value)} placeholder="Repeat new password" />
            </div>
            {pwError && <p className="error-box">{pwError}</p>}
            <div className="settings-pw-btns">
              <button onClick={cancel} className="btn-cancel">Cancel</button>
              <button onClick={handleChangePassword} className="btn-primary settings-pw-save" style={{ background: pwSaved ? "#4ade80" : accent }}>
                {pwSaved ? <><Check size={12} />Saved!</> : "Update Password"}
              </button>
            </div>
          </div>
        )}

        {/* Logout row */}
        <div className="settings-action-row" onClick={onLogout}>
          <div className="settings-action-icon settings-action-icon--danger">
            <LogOut size={14} color="#f87171" strokeWidth={2} />
          </div>
          <div className="settings-action-body">
            <p className="settings-action-title danger">Log Out</p>
            <p className="settings-action-sub">Sign out of CreatorStart</p>
          </div>
          <ChevronRight size={13} color="var(--dim)" />
        </div>

        {/* Delete account row */}
        <div className="settings-action-row" onClick={onDelete}>
          <div className="settings-action-icon settings-action-icon--danger">
            <Trash2 size={14} color="#f87171" strokeWidth={2} />
          </div>
          <div className="settings-action-body">
            <p className="settings-action-title danger">Delete Account</p>
            <p className="settings-action-sub">Permanently remove your account and all data</p>
          </div>
          <ChevronRight size={13} color="var(--dim)" />
        </div>

      </div>
    </div>
  )
}
