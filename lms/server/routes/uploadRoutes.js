const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadFile } = require('../utils/supabase');

// Configure multer to use memory storage (we'll handle the upload to Supabase manually)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allowed file types
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'video/mov',
      'video/avi',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not allowed`), false);
    }
  }
});

// Route to upload single file
router.post('/upload', (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ 
        success: false, 
        error: 'File upload failed', 
        details: err.message 
      });
    }

    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded' 
      });
    }

    try {
      console.log(`📁 Processing upload: ${req.file.originalname}`);
      console.log(`📄 MIME type: ${req.file.mimetype}`);
      console.log(`📏 File size: ${req.file.size} bytes`);

      // Determine folder based on file type
      let folder = 'uploads';
      if (req.file.mimetype.startsWith('image/')) {
        folder = 'images';
      } else if (req.file.mimetype.startsWith('video/')) {
        folder = 'videos';
      } else if (req.file.mimetype === 'application/pdf' || 
                 req.file.mimetype.includes('document') ||
                 req.file.mimetype === 'text/plain') {
        folder = 'documents';
      }

      // Upload to Supabase
      const uploadResult = await uploadFile(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        folder
      );

      if (!uploadResult.success) {
        console.error('❌ Supabase upload failed:', uploadResult.error);
        return res.status(500).json({
          success: false,
          error: 'Upload to storage failed',
          details: uploadResult.error
        });
      }

      console.log(`✅ Upload successful:`);
      console.log(`📁 Original name: ${req.file.originalname}`);
      console.log(`🔗 Supabase URL: ${uploadResult.url}`);
      console.log(`📂 Folder: ${folder}`);

      return res.status(200).json({
        success: true,
        url: uploadResult.url,
        path: uploadResult.path,
        fileName: uploadResult.fileName,
        folder: folder,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size
      });

    } catch (error) {
      console.error('❌ Upload processing error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error during upload',
        details: error.message
      });
    }
  });
});

// Route to upload multiple files
router.post('/upload-multiple', (req, res) => {
  upload.array('files', 10)(req, res, async (err) => { // Max 10 files
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ 
        success: false, 
        error: 'File upload failed', 
        details: err.message 
      });
    }

    if (!req.files || req.files.length === 0) {
      console.error('No files uploaded');
      return res.status(400).json({ 
        success: false, 
        error: 'No files uploaded' 
      });
    }

    try {
      console.log(`📁 Processing ${req.files.length} files...`);

      const uploadPromises = req.files.map(async (file) => {
        // Determine folder based on file type
        let folder = 'uploads';
        if (file.mimetype.startsWith('image/')) {
          folder = 'images';
        } else if (file.mimetype.startsWith('video/')) {
          folder = 'videos';
        } else if (file.mimetype === 'application/pdf' || 
                   file.mimetype.includes('document') ||
                   file.mimetype === 'text/plain') {
          folder = 'documents';
        }

        const uploadResult = await uploadFile(
          file.buffer,
          file.originalname,
          file.mimetype,
          folder
        );

        return {
          originalName: file.originalname,
          ...uploadResult
        };
      });

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(r => r.success);
      const failedUploads = results.filter(r => !r.success);

      console.log(`✅ ${successfulUploads.length} files uploaded successfully`);
      if (failedUploads.length > 0) {
        console.log(`❌ ${failedUploads.length} files failed to upload`);
      }

      return res.status(200).json({
        success: true,
        uploadedFiles: successfulUploads,
        failedFiles: failedUploads,
        totalFiles: req.files.length,
        successCount: successfulUploads.length,
        failureCount: failedUploads.length
      });

    } catch (error) {
      console.error('❌ Multiple upload processing error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error during upload',
        details: error.message
      });
    }
  });
});

module.exports = router;
