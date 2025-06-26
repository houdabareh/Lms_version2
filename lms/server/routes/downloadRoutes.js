const express = require('express');
const router = express.Router();
const https = require('https');
const http = require('http');

// Download proxy route
router.get('/download/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    console.log(`📥 Download request for: ${url}`);

    // Parse the URL to determine protocol
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;

    // Set proper headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${fileId}.pdf"`);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Cache-Control', 'no-cache');

    // Create request to Supabase Storage
    const request = protocol.get(url, (supabaseResponse) => {
      console.log(`📄 Supabase response status: ${supabaseResponse.statusCode}`);
      console.log(`📋 Content-Type from Supabase: ${supabaseResponse.headers['content-type']}`);
      
      // Set content length if available
      if (supabaseResponse.headers['content-length']) {
        res.setHeader('Content-Length', supabaseResponse.headers['content-length']);
      }

      // Use the actual content type from Supabase if available
      if (supabaseResponse.headers['content-type']) {
        res.setHeader('Content-Type', supabaseResponse.headers['content-type']);
      }

      // Pipe the response from Supabase to client
      supabaseResponse.pipe(res);
    });

    request.on('error', (error) => {
      console.error('❌ Download error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to download file' });
      }
    });

    // Handle client disconnection
    req.on('close', () => {
      request.destroy();
    });

  } catch (error) {
    console.error('❌ Download route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 