const fs = require('fs');
const path = require('path');

// Sync uploaded images from backend to frontend
function syncUploads() {
  const backendUploadsDir = path.join(__dirname, 'uploads');
  const frontendUploadsDir = path.join(__dirname, '..', 'public', 'uploads');
  
  console.log('🔄 Syncing uploaded images...');
  console.log(`📁 Backend uploads: ${backendUploadsDir}`);
  console.log(`📁 Frontend uploads: ${frontendUploadsDir}`);
  
  // Ensure frontend uploads directory exists
  if (!fs.existsSync(frontendUploadsDir)) {
    fs.mkdirSync(frontendUploadsDir, { recursive: true });
    console.log('📁 Created frontend uploads directory');
  }
  
  // Get all files from backend uploads
  const files = fs.readdirSync(backendUploadsDir);
  let syncedCount = 0;
  
  files.forEach(file => {
    const backendPath = path.join(backendUploadsDir, file);
    const frontendPath = path.join(frontendUploadsDir, file);
    
    // Copy file if it doesn't exist in frontend or is newer
    if (!fs.existsSync(frontendPath) || 
        fs.statSync(backendPath).mtime > fs.statSync(frontendPath).mtime) {
      fs.copyFileSync(backendPath, frontendPath);
      console.log(`✅ Synced: ${file}`);
      syncedCount++;
    } else {
      console.log(`⏭️  Skipped: ${file} (already up to date)`);
    }
  });
  
  console.log(`🎉 Sync complete! ${syncedCount} files synced.`);
}

// Run sync
syncUploads();
