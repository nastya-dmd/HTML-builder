const fs = require('fs');
const path = require('path');
const pathFilesFolder = path.resolve(__dirname, 'files');

(async () => {
  await fs.promises.mkdir(path.join(__dirname, 'files-copy'), { recursive: true });
})();
  
fs.readdir(pathFilesFolder, { withFileTypes: true }, (err, fileName) => {
  if (err) {
    console.error(err);
  } else {
    fileName.forEach(file => {
      fs.createReadStream(path.join(__dirname, 'files', file.name)).pipe(fs.createWriteStream(path.join(__dirname, 'files-copy', file.name)));
    });
  }
});
