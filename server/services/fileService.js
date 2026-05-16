const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * File Service
 * Verzorgt bestandsuploads voor het offerteformulier
 */
class FileService {
  constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads');
    this.maxSize = (parseInt(process.env.MAX_FILE_SIZE_MB) || 10) * 1024 * 1024; // 10MB default
    this.allowedTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/heif', 'image/webp'];
    this._ensureUploadDir();
  }

  /**
   * Zorg dat de upload directory bestaat
   */
  _ensureUploadDir() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
      console.log(`[FileService] Upload directory aangemaakt: ${this.uploadDir}`);
    }
  }

  /**
   * Multer storage configuratie
   */
  _getStorage() {
    return multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `offerte-${uniqueSuffix}${ext}`);
      }
    });
  }

  /**
   * Multer file filter
   */
  _fileFilter(req, file, cb) {
    if (this.allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Alleen ${this.allowedTypes.join(', ')} zijn toegestaan`), false);
    }
  }

  /**
   * Genereer een multer middleware instantie
   */
  getUploadMiddleware() {
    return multer({
      storage: this._getStorage(),
      limits: {
        fileSize: this.maxSize,
        files: 5 // Max 5 bestanden
      },
      fileFilter: this._fileFilter.bind(this)
    }).array('files', 5);
  }

  /**
   * Verwijder oude uploads (ouder dan 7 dagen)
   */
  cleanOldUploads() {
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    if (!fs.existsSync(this.uploadDir)) return;

    fs.readdir(this.uploadDir, (err, files) => {
      if (err) return;
      files.forEach(file => {
        const filePath = path.join(this.uploadDir, file);
        fs.stat(filePath, (err, stats) => {
          if (err) return;
          if (now - stats.mtimeMs > sevenDays) {
            fs.unlink(filePath, err => {
              if (!err) console.log(`[FileService] Oude upload verwijderd: ${file}`);
            });
          }
        });
      });
    });
  }
}

module.exports = new FileService();
