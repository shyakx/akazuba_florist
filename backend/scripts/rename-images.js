const fs = require('fs');
const path = require('path');

const flowersDir = path.join(__dirname, '../public/images/flowers');

console.log('🌸 Renaming Flower Images for Web Compatibility');
console.log('================================================\n');

// Function to rename files in a directory
function renameFilesInDirectory(dirPath, color) {
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  ${color} directory not found`);
    return [];
  }

  const files = fs.readdirSync(dirPath)
    .filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'))
    .filter(file => !file.startsWith('image-mapping'));

  console.log(`📁 Processing ${color} flowers (${files.length} images)...`);

  const renamedFiles = [];

  files.forEach((file, index) => {
    const oldPath = path.join(dirPath, file);
    const extension = path.extname(file);
    const newName = `${color}-${index + 1}${extension}`;
    const newPath = path.join(dirPath, newName);

    try {
      fs.renameSync(oldPath, newPath);
      console.log(`   ✅ ${file} → ${newName}`);
      renamedFiles.push({
        oldName: file,
        newName: newName,
        newPath: `/images/flowers/${color}/${newName}`
      });
    } catch (error) {
      console.log(`   ❌ Failed to rename ${file}: ${error.message}`);
    }
  });

  return renamedFiles;
}

// Process each color directory
const colors = ['red', 'pink', 'white', 'yellow', 'orange', 'mixed'];
const allRenamedFiles = {};

colors.forEach(color => {
  const colorDir = path.join(flowersDir, color);
  allRenamedFiles[color] = renameFilesInDirectory(colorDir, color);
  console.log('');
});

console.log('🎉 Image renaming completed!');
console.log('\n📋 Summary of renamed files:');

Object.keys(allRenamedFiles).forEach(color => {
  if (allRenamedFiles[color].length > 0) {
    console.log(`\n${color.toUpperCase()} FLOWERS:`);
    allRenamedFiles[color].forEach(file => {
      console.log(`   ${file.oldName} → ${file.newName}`);
    });
  }
});

console.log('\n💡 Next step: Update the data file with new image paths!'); 