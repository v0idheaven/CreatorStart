import { LogOut, Trash2 } from "lucide-react"

export function LogoutModal({ onClose, onConfirm }) {
  return (
    <>
      <div onClick={onClose} className="modal-overlay" />
      <div className="modal-box settings-confirm-modal">
        <div className="settings-confirm-icon settings-confirm-icon--danger"><LogOut size={20} color="#f87171" /></div>
        <h2 className="settings-confirm-title">Log out?</h2>
        <p className="settings-confirm-sub">You will be signed out. Your data and plans stay saved.</p>
        <div className="settings-confirm-btns">
          <button onClick={onClose} className="btn-cancel">Stay</button>
          <button onClick={onConfirm} className="btn-danger">Log out</button>
        </div>
      </div>
    </>
  )
}

export function DeleteAccountModal({ onClose, onConfirm }) {
  return (
    <>
      <div onClick={onClose} className="modal-overlay" />
      <div className="modal-box settings-confirm-modal">
        <div className="settings-confirm-icon settings-confirm-icon--danger"><Trash2 size={20} color="#f87171" /></div>
        <h2 className="settings-confirm-title">Delete account?</h2>
        <p className="settings-confirm-sub">This permanently deletes your account, all plans, and content. Cannot be undone.</p>
        <div className="settings-confirm-btns">
          <button onClick={onClose} className="btn-cancel">Cancel</button>
          <button onClick={onConfirm} className="btn-danger">Yes, delete</button>
        </div>
      </div>
    </>
  )
}
