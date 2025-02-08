const fs = require('fs');
const path = require('path');

function generateStructure(dir, prefix = '') {
    let structure = '';

    const files = fs.readdirSync(dir);
    files.forEach((file, index) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        // Determine prefix for proper indentation
        const connector = index === files.length - 1 ? '└── ' : '├── ';

        // Add the current file or directory to the structure
        structure += `${prefix}${connector}${file}\n`;

        // Recursively list subdirectories
        if (stat.isDirectory()) {
            structure += generateStructure(filePath, `${prefix}${index === files.length - 1 ? '    ' : '|   '}`);
        }
    });

    return structure;
}

// Define the root directory of your project
const rootDir = path.resolve(__dirname);

// Generate the directory structure starting from the rootDir
const directoryStructure = generateStructure(rootDir);

// Write the structure to a txt file
fs.writeFileSync('directory_structure.txt', directoryStructure);

console.log('Directory structure saved to directory_structure.txt');
