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
      fs.createReadStream(`./04-copy-directory/files/${file.name}`).pipe(fs.createWriteStream(`./04-copy-directory/files-copy/${file.name}`));
    });
  }
});
