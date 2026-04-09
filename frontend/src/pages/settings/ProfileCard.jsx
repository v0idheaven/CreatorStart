import { Check, Loader } from "lucide-react"
import AvatarCrop from "./AvatarCrop"

// Profile view/edit card — avatar, name, bio, niche
export default function ProfileCard({ name, setName, email, setEmail, username, setUsername, niche, setNiche, bio, setBio, avatar, initials, accent, editingProfile, setEditingProfile, profileSaving, profileSaved, profileError, setProfileError, onSave, onAvatarChange }) {
  return (
    <div className="card settings-profile-card">
      <div className="settings-profile-row">
        <AvatarCrop avatar={avatar} editingProfile={editingProfile} accent={accent} initials={initials} onAvatarChange={onAvatarChange} />

        <div className="settings-profile-info">
          {!editingProfile ? (
            <>
              <p className="settings-profile-name">{name || "—"}</p>
              <p className="settings-profile-username">@{username || "—"}</p>
              <p className="settings-profile-email">{email}</p>
              {bio && <p className="settings-profile-bio">{bio}</p>}
              {niche && <span className="settings-niche-badge" style={{ color: accent, background: accent + "15" }}>{niche}</span>}
            </>
          ) : (
            <div className="settings-edit-grid">
              {[["Full Name", name, setName, "text"], ["Username", username, setUsername, "text"], ["Email", email, setEmail, "email"], ["Niche", niche, setNiche, "text"]].map(([label, val, setter, type]) => (
                <div key={label}>
                  <label className="field-label">{label}</label>
                  <input className="input-sm" type={type} value={val} onChange={e => setter(e.target.value)} placeholder={label} />
                </div>
              ))}
              <div className="settings-edit-full">
                <label className="field-label">Bio</label>
                <input className="input-sm" value={bio} onChange={e => setBio(e.target.value)} placeholder="Short bio..." />
              </div>
              {profileError && <p className="settings-edit-error">{profileError}</p>}
            </div>
          )}
        </div>

        <div className="settings-profile-actions">
          {editingProfile && (
            <button onClick={onSave} disabled={profileSaving} className="settings-save-btn"
              style={{ background: profileSaved ? "#4ade80" : accent, opacity: profileSaving ? 0.7 : 1 }}>
              {profileSaving ? <Loader size={12} /> : profileSaved ? <><Check size={12} />Saved</> : "Save"}
            </button>
          )}
          <button onClick={() => { setEditingProfile(!editingProfile); setProfileError("") }} className="settings-edit-btn"
            style={{ border: `1px solid ${editingProfile ? "var(--border2)" : accent + "60"}`, color: editingProfile ? "var(--muted)" : accent }}>
            {editingProfile ? "Cancel" : "Edit"}
          </button>
        </div>
      </div>
    </div>
  )
}
