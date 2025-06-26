const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://zddropyytlxznhnomwll.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkZHJvcHl5dGx4em5obm9td2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MjkyNjYsImV4cCI6MjA2NjMwNTI2Nn0.g643ZfB7ZpnYN4QMydKN-tcsK_wB4ZoBvXvhVO49gg0';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Upload file to Supabase Storage
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} fileName - The file name
 * @param {string} mimeType - The file MIME type
 * @param {string} folder - The folder path (default: 'uploads')
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
const uploadFile = async (fileBuffer, fileName, mimeType, folder = 'uploads') => {
  try {
    // Create a unique filename to avoid conflicts
    const timestamp = Date.now();
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${timestamp}_${Math.random().toString(36).substring(2)}.${fileExtension}`;
    const filePath = `${folder}/${uniqueFileName}`;

    console.log(`📁 Uploading file to Supabase: ${fileName}`);
    console.log(`📄 MIME type: ${mimeType}`);
    console.log(`🏷️ File path: ${filePath}`);

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('lms-files') // bucket name
      .upload(filePath, fileBuffer, {
        contentType: mimeType,
        upsert: false
      });

    if (error) {
      console.error('❌ Supabase upload error:', error);
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('lms-files')
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      console.error('❌ Failed to get public URL');
      return { success: false, error: 'Failed to get public URL' };
    }

    console.log(`✅ Upload successful: ${urlData.publicUrl}`);
    
    return {
      success: true,
      url: urlData.publicUrl,
      path: filePath,
      fileName: uniqueFileName
    };

  } catch (error) {
    console.error('❌ Upload error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete file from Supabase Storage
 * @param {string} filePath - The file path in storage
 * @returns {Promise<{success: boolean, error?: string}>}
 */
const deleteFile = async (filePath) => {
  try {
    const { error } = await supabase.storage
      .from('lms-files')
      .remove([filePath]);

    if (error) {
      console.error('❌ Supabase delete error:', error);
      return { success: false, error: error.message };
    }

    console.log(`✅ File deleted successfully: ${filePath}`);
    return { success: true };

  } catch (error) {
    console.error('❌ Delete error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get public URL for a file
 * @param {string} filePath - The file path in storage
 * @returns {string} - The public URL
 */
const getPublicUrl = (filePath) => {
  const { data } = supabase.storage
    .from('lms-files')
    .getPublicUrl(filePath);
    
  return data?.publicUrl;
};

/**
 * Create signed URL for private files (if needed)
 * @param {string} filePath - The file path in storage
 * @param {number} expiresIn - Expiration time in seconds (default: 1 hour)
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
const createSignedUrl = async (filePath, expiresIn = 3600) => {
  try {
    const { data, error } = await supabase.storage
      .from('lms-files')
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      console.error('❌ Signed URL error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, url: data.signedUrl };

  } catch (error) {
    console.error('❌ Signed URL error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  supabase,
  uploadFile,
  deleteFile,
  getPublicUrl,
  createSignedUrl
}; 