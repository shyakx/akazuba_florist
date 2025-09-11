#!/usr/bin/env node

/**
 * Manual Upload Sync Script
 * 
 * This script can be run manually to sync all uploaded images from backend to frontend.
 * However, the main image serving API already handles this automatically!
 * 
 * Usage: node scripts/sync-uploads.js
 */

const fs = require('fs');
const path = require('path');

function syncUploads() {
  console.log('🔄 Manual Upload Sync Script');
  console.log('=====================================');
  
  const backendUploadsDir = path.join(__dirname, '..', 'backend', 'uploads');
  const frontendUploadsDir = path.join(__dirname, '..', 'public', 'uploads');
  
  console.log(`📁 Backend uploads: ${backendUploadsDir}`);
  console.log(`📁 Frontend uploads: ${frontendUploadsDir}`);
  
  // Check if backend uploads directory exists
  if (!fs.existsSync(backendUploadsDir)) {
    console.log('❌ Backend uploads directory not found');
    return;
  }
  
  // Ensure frontend uploads directory exists
  if (!fs.existsSync(frontendUploadsDir)) {
    fs.mkdirSync(frontendUploadsDir, { recursive: true });
    console.log('📁 Created frontend uploads directory');
  }
  
  // Get all files from backend uploads
  const files = fs.readdirSync(backendUploadsDir);
  let syncedCount = 0;
  let skippedCount = 0;
  
  console.log(`\n📋 Found ${files.length} files in backend uploads`);
  
  files.forEach(file => {
    const backendPath = path.join(backendUploadsDir, file);
    const frontendPath = path.join(frontendUploadsDir, file);
    
    try {
      // Copy file if it doesn't exist in frontend or is newer
      if (!fs.existsSync(frontendPath) || 
          fs.statSync(backendPath).mtime > fs.statSync(frontendPath).mtime) {
        fs.copyFileSync(backendPath, frontendPath);
        console.log(`✅ Synced: ${file}`);
        syncedCount++;
      } else {
        console.log(`⏭️  Skipped: ${file} (already up to date)`);
        skippedCount++;
      }
    } catch (error) {
      console.log(`❌ Error syncing ${file}:`, error.message);
    }
  });
  
  console.log('\n=====================================');
  console.log(`🎉 Sync complete!`);
  console.log(`   - Synced: ${syncedCount} files`);
  console.log(`   - Skipped: ${skippedCount} files`);
  console.log(`\n💡 Note: The image serving API automatically handles this!`);
  console.log(`   Images are served directly from backend when available.`);
}

// Run sync
syncUploads();