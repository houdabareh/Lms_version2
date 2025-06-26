# Cloudinary to Supabase Migration Guide

This guide covers the complete migration from Cloudinary to Supabase Storage for the LMS application.

## ✅ Completed Migration Steps

### 1. Backend Changes
- ✅ Installed `@supabase/supabase-js` 
- ✅ Created `utils/supabase.js` with upload/download functions
- ✅ Updated `routes/uploadRoutes.js` to use Supabase Storage
- ✅ Updated `routes/downloadRoutes.js` for Supabase URLs
- ✅ Removed Cloudinary dependencies and files
- ✅ Removed old `utils/cloudinary.js`

### 2. Frontend Changes
- ✅ Installed `@supabase/supabase-js`
- ✅ Created `utils/supabaseUtils.js` with file handling functions
- ✅ Created `utils/supabaseClient.js` for client configuration
- ✅ Updated imports from `cloudinaryUtils` to `supabaseUtils`
- ✅ Removed old `utils/cloudinaryUtils.js`

## 🔧 Required Supabase Setup

### Step 1: Create Storage Bucket
1. Go to your Supabase Dashboard: https://app.supabase.com
2. Navigate to **Storage** → **Buckets**
3. Click **"New bucket"**
4. Create bucket with these settings:
   - **Name**: `lms-files`
   - **Public bucket**: ✅ Enabled
   - **File size limit**: 50 MB
   - **Allowed MIME types**: Leave empty for all types

### Step 2: Set Up Storage Policies (Important!)
1. Go to **Storage** → **Policies**
2. For the `lms-files` bucket, create these policies:

#### Policy 1: Public Upload
```sql
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'lms-files');
```

#### Policy 2: Public Downloads
```sql
CREATE POLICY "Allow public downloads" ON storage.objects
FOR SELECT USING (bucket_id = 'lms-files');
```

#### Policy 3: Public Deletes (for cleanup)
```sql
CREATE POLICY "Allow public deletes" ON storage.objects
FOR DELETE USING (bucket_id = 'lms-files');
```

### Step 3: Test the Setup
Run the test script from your server directory:
```bash
node scripts/setupSupabase.js
```

## 📁 File Structure Changes

### New Files Added:
```
lms/server/
├── utils/supabase.js              # Supabase configuration and utilities
└── scripts/setupSupabase.js       # Setup and test script

lms/client/src/utils/
├── supabaseClient.js              # Frontend Supabase client
└── supabaseUtils.js               # Frontend file handling utilities
```

### Files Removed:
```
lms/server/
├── utils/cloudinary.js            # ❌ Removed
└── scripts/
    ├── checkCloudinaryFiles.js    # ❌ Removed
    └── testDownload.js            # ❌ Removed

lms/client/src/utils/
└── cloudinaryUtils.js             # ❌ Removed
```

## 🔄 API Changes

### Upload Endpoint
- **URL**: Same (`POST /api/upload`)
- **Request**: Same (FormData with 'file' field)
- **Response**: Enhanced with more metadata
```json
{
  "success": true,
  "url": "https://zddropyytlxznhnomwll.supabase.co/storage/v1/object/public/lms-files/images/1234567890_abc123.jpg",
  "path": "images/1234567890_abc123.jpg",
  "fileName": "1234567890_abc123.jpg",
  "folder": "images",
  "originalName": "my-image.jpg",
  "mimeType": "image/jpeg",
  "size": 123456
}
```

### Multiple Upload Endpoint
- **New**: `POST /api/upload-multiple`
- **Request**: FormData with 'files' field (array)
- **Response**: Detailed results for each file

### Download Endpoint
- **URL**: Same (`GET /api/download/:fileId?url=...`)
- **Functionality**: Same, now proxies Supabase URLs

## 🌐 URL Format Changes

### Before (Cloudinary):
```
https://res.cloudinary.com/dtd1vs5ak/image/upload/v1750646330/LMS/filename.pdf
```

### After (Supabase):
```
https://zddropyytlxznhnomwll.supabase.co/storage/v1/object/public/lms-files/documents/1750729266_abc123.pdf
```

## 📂 File Organization

Files are now organized in folders by type:
- `images/` - JPG, PNG, GIF, WebP files
- `videos/` - MP4, WebM, MOV, AVI files  
- `documents/` - PDF, DOC, DOCX, TXT files
- `uploads/` - Other file types

## 🔧 Configuration

### Server Configuration (`utils/supabase.js`):
```javascript
const supabaseUrl = 'https://zddropyytlxznhnomwll.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Your anon key
```

### Client Configuration (`utils/supabaseClient.js`):
Same configuration as server.

## 🧪 Testing the Migration

### 1. Test File Upload
```bash
# From your frontend, try uploading a file through the UI
# Check the network tab for the API call to /api/upload
```

### 2. Test File Access
```bash
# Verify uploaded files are accessible via their public URLs
# Test both direct access and download proxy
```

### 3. Test Different File Types
- Images (JPG, PNG)
- Videos (MP4)
- Documents (PDF, DOC)

## 🚨 Important Notes

1. **Bucket Policies**: Must be set up correctly for uploads to work
2. **Public Access**: The bucket is configured as public for simplicity
3. **File Size Limit**: Currently set to 50MB per file
4. **CORS**: Supabase handles CORS automatically for storage
5. **Security**: Consider implementing Row Level Security (RLS) for production

## 🔄 Migration Checklist

- ✅ Install Supabase packages
- ✅ Create Supabase configuration files
- ✅ Update upload routes
- ✅ Update download routes  
- ✅ Update frontend utilities
- ✅ Remove Cloudinary dependencies
- ⚠️ Create Supabase bucket (manual step required)
- ⚠️ Set up storage policies (manual step required)
- ⚠️ Test file uploads
- ⚠️ Test file downloads
- ⚠️ Update existing file URLs (if needed)

## 🆘 Troubleshooting

### "StorageApiError: new row violates row-level security policy"
- Solution: Set up storage policies as described in Step 2 above

### "Bucket does not exist"
- Solution: Create the `lms-files` bucket manually in Supabase dashboard

### Upload fails with CORS error
- Solution: Supabase should handle CORS automatically, check your bucket settings

### Files not accessible
- Solution: Ensure the bucket is set to public or policies allow access

## 🎉 Benefits of Supabase Migration

1. **Better Integration**: Native PostgreSQL integration
2. **Cost Effective**: More generous free tier
3. **Real-time Capabilities**: Can add real-time features later
4. **Unified Platform**: Database + Storage + Auth in one place
5. **Better Performance**: CDN distribution included
6. **Enhanced Security**: Row Level Security support 