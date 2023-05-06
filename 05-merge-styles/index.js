const fs = require('fs');
const path = require('path');

(async () => {
  const pathStyles = path.join(__dirname, 'styles');

  const resultFilePath = path.join(__dirname, 'project-dist', 'bundle.css');
  console.log(resultFilePath);

  await fs.writeFile(resultFilePath, '', () => { });
  fs.readdir(pathStyles, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(err);
    } else {
      let position = 0;

      files.forEach((file) => {
        const pathFile = path.join(__dirname, 'styles', file.name);

        if (file.isFile() && path.extname(pathFile) === '.css') {
          fs.stat(pathFile, (_error, stats) => {
       
            fs.createReadStream(pathFile).pipe(fs.createWriteStream(resultFilePath, { start: position }), { end: true });

            const fileSize = stats.size;
            position += fileSize;

          });
        }
      });
    }

  });
})();
