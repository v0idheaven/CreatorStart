import { useState } from "react"
import Sidebar from "../../components/Sidebar"
import useSettingsData from "./useSettingsData"
import StatCards from "./StatCards"
import ProfileCard from "./ProfileCard"
import PlatformPicker from "./PlatformPicker"
import PasswordForm from "./PasswordForm"
import { LogoutModal, DeleteAccountModal } from "./ConfirmModals"
import "./Settings.css"

export default function Settings() {
  const data = useSettingsData()
  const [editingProfile, setEditingProfile] = useState(false)
  const [showLogout, setShowLogout] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  async function handleSave() {
    const ok = await data.saveProfile()
    if (ok) setEditingProfile(false)
  }

  return (
    <>
      <div className="page-root">
        <Sidebar />
        <div className="settings-content">
          <main className="settings-main">

            <div className="settings-heading">
              <p className="page-kicker">Account</p>
              <h1 className="page-title">Settings</h1>
            </div>

            <StatCards statItems={data.statItems} accent={data.accent} />

            <ProfileCard
              name={data.name} setName={data.setName}
              email={data.email} setEmail={data.setEmail}
              username={data.username} setUsername={data.setUsername}
              niche={data.niche} setNiche={data.setNiche}
              bio={data.bio} setBio={data.setBio}
              avatar={data.avatar} initials={data.initials}
              accent={data.accent}
              editingProfile={editingProfile} setEditingProfile={setEditingProfile}
              profileSaving={data.profileSaving} profileSaved={data.profileSaved}
              profileError={data.profileError} setProfileError={data.setProfileError}
              onSave={handleSave}
              onAvatarChange={data.updateAvatar}
            />

            <PlatformPicker selected={data.selectedPlatform} onChange={data.changePlatform} />

            <PasswordForm
              accent={data.accent}
              onLogout={() => setShowLogout(true)}
              onDelete={() => setShowDelete(true)}
            />

            <p className="settings-footer">CreatorStart v1.0.0 · Made for creators</p>
          </main>
        </div>
      </div>

      {showLogout && <LogoutModal onClose={() => setShowLogout(false)} onConfirm={data.logout} />}
      {showDelete && <DeleteAccountModal onClose={() => setShowDelete(false)} onConfirm={data.deleteAccount} />}
    </>
  )
}
