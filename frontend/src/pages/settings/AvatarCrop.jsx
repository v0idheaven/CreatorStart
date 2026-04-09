import { useState, useRef } from "react"
import { Camera, Eye, Pencil, Loader } from "lucide-react"

export default function AvatarCrop({ avatar, editingProfile, accent, initials, onAvatarChange }) {
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [showAvatarPreview, setShowAvatarPreview] = useState(false)
  const [showAvatarMenu, setShowAvatarMenu] = useState(false)
  const [cropSrc, setCropSrc] = useState(null)
  const [cropPos, setCropPos] = useState({ x: 0, y: 0 })
  const [cropZoom, setCropZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const cropImgRef = useRef(null)
  const fileInputRef = useRef(null)

  function handleFileSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => { setCropSrc(ev.target.result); setCropPos({ x: 0, y: 0 }); setCropZoom(1) }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  async function handleCropAndUpload() {
    const img = cropImgRef.current
    if (!img) return
    setAvatarUploading(true); setCropSrc(null)
    const size = 400
    const canvas = document.createElement("canvas")
    canvas.width = size; canvas.height = size
    const ctx = canvas.getContext("2d")
    ctx.beginPath(); ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2); ctx.clip()
    const iw = img.naturalWidth, ih = img.naturalHeight
    const baseScale = Math.min(size / iw, size / ih) * cropZoom
    const sw = iw * baseScale, sh = ih * baseScale
    const dx = (size - sw) / 2 + cropPos.x * (size / 360)
    const dy = (size - sh) / 2 + cropPos.y * (size / 360)
    ctx.drawImage(img, dx, dy, sw, sh)
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92)
    canvas.toBlob(async (blob) => {
      try {
        const { apiFetch } = await import("../../utils/api")
        const { API_ENDPOINTS } = await import("../../constants/api")
        const form = new FormData()
        form.append("avatar", blob, "avatar.jpg")
        const res = await apiFetch(API_ENDPOINTS.updateAvatar, { method: "PATCH", body: form, headers: {} })
        const data = await res.json()
        const url = res.ok && data?.data?.user?.avatar ? data.data.user.avatar : dataUrl
        onAvatarChange(url)
      } catch {
        onAvatarChange(dataUrl)
      }
      setAvatarUploading(false)
    }, "image/jpeg", 0.92)
  }

  return (
    <>
      <div className="settings-avatar-wrap">
        <div className="settings-avatar-click" onClick={() => { if (editingProfile) setShowAvatarMenu(m => !m); else if (avatar) setShowAvatarPreview(true) }}>
          {avatarUploading
            ? <div className="settings-avatar-loading"><Loader size={18} color="var(--dim)" /></div>
            : avatar
            ? <img src={avatar} alt="avatar" className="settings-avatar-img" />
            : <div className="settings-avatar-initials" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}99)` }}>{initials}</div>
          }
          {editingProfile && !avatarUploading && (
            <div className="settings-avatar-overlay"><Camera size={15} color="#fff" /></div>
          )}
        </div>
        {showAvatarMenu && editingProfile && (
          <>
            <div onClick={() => setShowAvatarMenu(false)} className="settings-avatar-menu-backdrop" />
            <div className="settings-avatar-menu">
              {avatar && (
                <button onClick={() => { setShowAvatarMenu(false); setShowAvatarPreview(true) }} className="settings-avatar-menu-item">
                  <Eye size={13} color="var(--muted)" /> View photo
                </button>
              )}
              <button onClick={() => { setShowAvatarMenu(false); fileInputRef.current?.click() }} className="settings-avatar-menu-item">
                <Pencil size={13} color="var(--muted)" /> Change photo
              </button>
            </div>
          </>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
      </div>

      {showAvatarPreview && avatar && (
        <>
          <div onClick={() => setShowAvatarPreview(false)} className="modal-overlay settings-preview-overlay" />
          <img src={avatar} alt="avatar" className="settings-avatar-preview" />
        </>
      )}

      {cropSrc && (
        <>
          <div className="crop-overlay" />
          <div className="crop-modal">
            <div className="crop-modal-head">
              <button onClick={() => setCropSrc(null)} className="crop-cancel-btn">Cancel</button>
              <p className="crop-modal-title">Edit photo</p>
              <button onClick={handleCropAndUpload} className="crop-done-btn" style={{ color: accent }}>Done</button>
            </div>
            <div className={`crop-canvas${isDragging ? " crop-canvas--grabbing" : ""}`}
              onMouseDown={e => { setIsDragging(true); setDragStart({ x: e.clientX - cropPos.x, y: e.clientY - cropPos.y }) }}
              onMouseMove={e => { if (isDragging) setCropPos({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }) }}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onWheel={e => { e.preventDefault(); setCropZoom(z => Math.min(4, Math.max(1, z - e.deltaY * 0.002))) }}
            >
              <img ref={cropImgRef} src={cropSrc} alt="crop"
                onLoad={e => {
                  const img = e.target
                  const scale = Math.min(360 / img.naturalWidth, 360 / img.naturalHeight)
                  img.style.width = img.naturalWidth * scale + "px"
                  img.style.height = img.naturalHeight * scale + "px"
                }}
                style={{ position: "absolute", top: "50%", left: "50%", transform: `translate(calc(-50% + ${cropPos.x}px), calc(-50% + ${cropPos.y}px)) scale(${cropZoom})`, transformOrigin: "center", userSelect: "none", pointerEvents: "none" }} />
              <div className="crop-circle-mask" />
            </div>
            <div className="crop-zoom-row">
              <button onClick={() => setCropZoom(z => Math.max(1, z - 0.1))} className="crop-zoom-btn">−</button>
              <div className="crop-zoom-track" onClick={e => { const r = e.currentTarget.getBoundingClientRect(); setCropZoom(1 + ((e.clientX - r.left) / r.width) * 3) }}>
                <div className="crop-zoom-fill" style={{ width: `${((cropZoom - 1) / 3) * 100}%` }} />
                <div className="crop-zoom-thumb" style={{ left: `${((cropZoom - 1) / 3) * 100}%` }} />
              </div>
              <button onClick={() => setCropZoom(z => Math.min(4, z + 0.1))} className="crop-zoom-btn">+</button>
            </div>
            <p className="crop-hint">Drag to reposition · scroll to zoom</p>
          </div>
        </>
      )}
    </>
  )
}
