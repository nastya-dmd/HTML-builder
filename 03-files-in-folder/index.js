const fs = require('fs');
const path = require('path');
const pathSecretFolder = path.resolve(__dirname, 'secret-folder');

fs.readdir(pathSecretFolder, { withFileTypes: true }, (error, fileName) => {
  if (error) {
    console.log('Error file not found');
    return;
  }

  fileName.forEach(file => {
    if (file.isFile()) {
      fs.stat(`${pathSecretFolder}/${file.name}`, (err, fileStats) => {
        if (err) {
          console.error(err);
          return;
        }
        const nameFile = file.name.split('.')[0];
        const extension = file.name.split('.')[1];
        console.log(`${nameFile} - ${extension} - ${fileStats.size}b`);
      });
    }
  });

});

