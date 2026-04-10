import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, "./public/temp"),
    filename: (_req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9)
        cb(null, unique + path.extname(file.originalname))
    }
})

const fileFilter = (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
    if (allowed.includes(file.mimetype)) cb(null, true)
    else cb(new Error("Only image files are allowed"), false)
}

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter,
})
