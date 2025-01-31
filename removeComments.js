const fs = require('fs');
const path = require('path');

// Function to remove single-line and multi-line comments
function removeComments(code) {
  // Remove single-line comments
  code = code.replace(/\/\/.*$/gm, '');
  
  // Remove multi-line comments
  code = code.replace(/\/\*[\s\S]*?\*\//g, '');
  
  return code;
}

// Function to process each file
function processFiles(dir) {
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    files.forEach(file => {
      const filePath = path.join(dir, file);

      fs.stat(filePath, (err, stat) => {
        if (err) {
          console.error('Error reading file stats:', err);
          return;
        }

        if (stat.isDirectory()) {
          // If it's a directory, recursively process the files inside it
          processFiles(filePath);
        } else if (filePath.endsWith('.js')) {
          // Process only JavaScript files (you can add more extensions if needed)
          fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
              console.error('Error reading file:', err);
              return;
            }

            // Remove comments
            const cleanedData = removeComments(data);

            // Write the cleaned data back to the file
            fs.writeFile(filePath, cleanedData, 'utf-8', (err) => {
              if (err) {
                console.error('Error writing file:', err);
                return;
              }
              console.log(`Removed comments from ${filePath}`);
            });
          });
        }
      });
    });
  });
}

// Start processing from the current directory or specify the target folder
const targetDir = process.argv[2] || './'; // Use provided folder or current directory
processFiles(targetDir);
