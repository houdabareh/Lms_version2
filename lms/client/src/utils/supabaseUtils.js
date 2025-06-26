/**
 * Utility functions for handling Supabase Storage URLs
 */

/**
 * Generate a downloadable URL using our backend proxy
 * This ensures proper download headers are sent for documents
 * @param {string} materialUrl - The original Supabase URL
 * @returns {string} - The downloadable URL through our proxy
 */
export const getDownloadableUrl = (materialUrl) => {
  if (!materialUrl) return materialUrl;
  
  // Check if it's a Supabase URL and a document
  if (materialUrl.includes('supabase.co') && 
      (materialUrl.includes('.pdf') || materialUrl.includes('.doc') || materialUrl.includes('.docx'))) {
    
    // Extract file name from URL
    const urlParts = materialUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const fileIdMatch = fileName.match(/^(.+)\.(pdf|doc|docx)$/);
    const fileId = fileIdMatch ? fileIdMatch[1] : 'document';
    
    // Use our backend proxy for download
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return `${apiUrl}/api/download/${fileId}?url=${encodeURIComponent(materialUrl)}`;
  }
  
  return materialUrl;
};

/**
 * Generate a preview URL for documents (opens in browser instead of download)
 * @param {string} materialUrl - The original Supabase URL
 * @returns {string} - The preview URL
 */
export const getPreviewUrl = (materialUrl) => {
  if (!materialUrl) return materialUrl;
  
  // For Supabase URLs, we can use the direct URL for preview
  // Supabase Storage serves files with appropriate content-type headers
  return materialUrl;
};

/**
 * Get file extension from URL
 * @param {string} url - The file URL
 * @returns {string} - The file extension (e.g., 'pdf', 'doc', 'mp4')
 */
export const getFileExtension = (url) => {
  if (!url) return '';
  const match = url.match(/\.([^./?]+)(?:\?|$)/);
  return match ? match[1].toLowerCase() : '';
};

/**
 * Check if URL is a document file
 * @param {string} url - The file URL
 * @returns {boolean} - True if it's a document
 */
export const isDocumentFile = (url) => {
  if (!url) return false;
  const extension = getFileExtension(url);
  return ['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extension);
};

/**
 * Check if URL is a video file
 * @param {string} url - The file URL
 * @returns {boolean} - True if it's a video
 */
export const isVideoFile = (url) => {
  if (!url) return false;
  const extension = getFileExtension(url);
  return ['mp4', 'webm', 'mov', 'avi', 'mkv', 'flv'].includes(extension);
};

/**
 * Check if URL is an image file
 * @param {string} url - The file URL
 * @returns {boolean} - True if it's an image
 */
export const isImageFile = (url) => {
  if (!url) return false;
  const extension = getFileExtension(url);
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(extension);
};

/**
 * Get file name from Supabase URL
 * @param {string} url - The Supabase URL
 * @returns {string} - The file name
 */
export const getFileName = (url) => {
  if (!url) return '';
  
  try {
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    
    // Remove any query parameters
    return fileName.split('?')[0];
  } catch (error) {
    console.error('Error extracting file name:', error);
    return 'file';
  }
};

/**
 * Get file size (if available in URL or metadata)
 * Note: Supabase doesn't include file size in URLs, so this would need to be stored separately
 * @param {string} url - The file URL
 * @returns {string} - Human readable file size or empty string
 */
export const getFileSize = (url) => {
  // Supabase doesn't provide file size in URL
  // This would need to be stored in your database or fetched separately
  return '';
};

/**
 * Check if URL is from Supabase Storage
 * @param {string} url - The URL to check
 * @returns {boolean} - True if it's a Supabase Storage URL
 */
export const isSupabaseUrl = (url) => {
  if (!url) return false;
  return url.includes('supabase.co');
};

/**
 * Create a thumbnail URL for images (Supabase doesn't have built-in transformations)
 * @param {string} imageUrl - The original image URL
 * @param {number} width - Desired width
 * @param {number} height - Desired height
 * @returns {string} - The image URL (unchanged for Supabase)
 */
export const getThumbnailUrl = (imageUrl, width = 300, height = 200) => {
  // Supabase Storage doesn't have built-in image transformations
  // You would need to implement this on your own or use a service like Cloudinary for transformations
  return imageUrl;
};

/**
 * Upload file to Supabase via backend API
 * @param {File} file - The file to upload
 * @param {function} onProgress - Progress callback (optional)
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export const uploadFile = async (file, onProgress = null) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    const response = await fetch(`${apiUrl}/api/upload`, {
      method: 'POST',
      body: formData,
      // Note: Don't set Content-Type header when using FormData
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Upload failed');
    }

    if (onProgress) {
      onProgress(100); // Since we don't have built-in progress tracking
    }

    return {
      success: true,
      url: result.url,
      path: result.path,
      fileName: result.fileName
    };

  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error.message || 'Upload failed'
    };
  }
};

/**
 * Upload multiple files to Supabase via backend API
 * @param {FileList|Array} files - The files to upload
 * @param {function} onProgress - Progress callback (optional)
 * @returns {Promise<{success: boolean, uploadedFiles?: Array, failedFiles?: Array, error?: string}>}
 */
export const uploadMultipleFiles = async (files, onProgress = null) => {
  try {
    const formData = new FormData();
    
    Array.from(files).forEach((file, index) => {
      formData.append('files', file);
    });

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    const response = await fetch(`${apiUrl}/api/upload-multiple`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Upload failed');
    }

    if (onProgress) {
      onProgress(100);
    }

    return {
      success: true,
      uploadedFiles: result.uploadedFiles,
      failedFiles: result.failedFiles,
      totalFiles: result.totalFiles,
      successCount: result.successCount,
      failureCount: result.failureCount
    };

  } catch (error) {
    console.error('Multiple upload error:', error);
    return {
      success: false,
      error: error.message || 'Upload failed'
    };
  }
}; 