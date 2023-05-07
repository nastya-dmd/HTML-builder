const fs = require('fs');
const path = require('path');
const pathFilesFolder = path.resolve(__dirname, 'files');

(async () => { 
  const pathFilesCopy = path.join(__dirname, 'files-copy');
  await fs.promises.mkdir(pathFilesCopy, { recursive: true });

  if (pathFilesCopy.length !== 0) {
    fs.readdir(pathFilesCopy, (err, fileName) => {
      if (err) {
        console.error(err);
      }
      
      fileName?.forEach(file => {
        console.log(file);
        fs.unlink(path.join(pathFilesCopy, file), (err) => {
          if (err) {
            console.error(err);
          }
        });
      });
    });
  }

  fs.readdir(pathFilesFolder, { withFileTypes: true }, (err, fileName) => {
    if (err) {
      console.error(err);
    } else {
      fileName.forEach(file => {
        fs.createReadStream(path.join(__dirname, 'files', file.name)).pipe(fs.createWriteStream(path.join(pathFilesCopy, file.name)));
      });
    }
  });

})();


