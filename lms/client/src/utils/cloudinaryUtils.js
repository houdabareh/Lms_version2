/**
 * Utility functions for handling Cloudinary URLs
 */

/**
 * Generate a downloadable URL using our backend proxy
 * This ensures proper download headers are sent for documents
 * @param {string} materialUrl - The original Cloudinary URL
 * @returns {string} - The downloadable URL through our proxy
 */
export const getDownloadableUrl = (materialUrl) => {
  if (!materialUrl) return materialUrl;
  
  // Check if it's a Cloudinary URL and a document
  if (materialUrl.includes('cloudinary.com') && 
      (materialUrl.includes('.pdf') || materialUrl.includes('.doc') || materialUrl.includes('.docx'))) {
    
    // Extract file ID from URL
    const fileIdMatch = materialUrl.match(/\/([^/]+)\.(pdf|doc|docx)(?:\?|$)/);
    const fileId = fileIdMatch ? fileIdMatch[1] : 'document';
    
    // Use our backend proxy for download
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return `${apiUrl}/api/download/${fileId}?url=${encodeURIComponent(materialUrl)}`;
  }
  
  return materialUrl;
};

/**
 * Generate a preview URL for documents (opens in browser instead of download)
 * @param {string} materialUrl - The original Cloudinary URL
 * @returns {string} - The preview URL
 */
export const getPreviewUrl = (materialUrl) => {
  if (!materialUrl) return materialUrl;
  
  // For PDFs, we can add fl_inline to force inline viewing
  if (materialUrl.includes('cloudinary.com') && materialUrl.includes('.pdf')) {
    if (materialUrl.includes('/image/upload/')) {
      return materialUrl.replace('/image/upload/', '/image/upload/fl_inline/');
    } else if (materialUrl.includes('/raw/upload/')) {
      return materialUrl.replace('/raw/upload/', '/raw/upload/fl_inline/');
    }
  }
  
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