const fs = require('fs');
const path = require('path');

const createFolder = async (folderPath) => {
  return fs.promises.mkdir(folderPath, { recursive: true });
};

const createFile = async (filePath, data) => {
  return fs.writeFile(filePath, data, () => { });
};

const copyFileToFile = async (fileReadPath, fileWritePath) => {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(fileReadPath).pipe(fs.createWriteStream(fileWritePath));
    stream.on('finish', () => {
      resolve();
    });
    stream.on('error', (err) => reject(err));
  });
};

const readFileContent = async (filePath) => {
  return new Promise((resolve, reject) => {

    let data = '';

    const stream = fs.createReadStream(
      filePath,
      'utf-8'
    );
    stream.on('data', (chunkFile) => {
      data += chunkFile;
    });
    stream.on('end', () => {
      resolve(data);
    });
    stream.on('error', (err) => reject(err));
  });
};

const copyFolderToFolder = async (folderFrom, folderTo) => {
  return new Promise((resolve, reject) => {
    createFolder(folderTo).then(()=>{
      fs.readdir(folderFrom, (err, components) => {
        if (err) {
          console.error(err);
          reject(err);
        }
      
        components.forEach(content => {
          const pathContent = path.join(folderFrom, content);
      
          fs.stat(pathContent, async (err, stats) => {
            if (err) {
              console.error(err);
              reject(err);
            }
      
            if (stats.isFile()) {
              await copyFileToFile(pathContent, path.join(folderTo, content));
            } else {
              await copyFolderToFolder(path.join(folderFrom, content), path.join(folderTo, content));
            }
          });
        });
      });
      
      resolve();

    });

   
  });
};

(async () => {

  const rootFolder = path.join(__dirname, 'project-dist');
  await createFolder(rootFolder);

  const resultTemplateFilePath = path.join(__dirname, 'template.html');
  let dataFileString = await readFileContent(resultTemplateFilePath);
  let newDataString = dataFileString;
 
  const componentsPath = path.join(__dirname, 'components');

  fs.readdir(componentsPath, (err, components) => {
    if (err) {
      console.error(err);
    }

    components.forEach(async nameFile => {

      const content = await readFileContent(path.join(componentsPath, nameFile));

      const key = nameFile.split('.')[0];

      if (newDataString.indexOf(`{{${key}}}`)) {
        newDataString = newDataString.replace(`{{${key}}}`, content);
               
      }
      const resultHtmlFilePath = path.join(__dirname, 'project-dist', 'index.html');
      await createFile(resultHtmlFilePath, newDataString);
    });
  });

  const assetsFolderPath = path.join(__dirname, 'assets');

  const projDistAssetsFolderPath = path.join(__dirname, 'project-dist', 'assets');
  await copyFolderToFolder(assetsFolderPath, projDistAssetsFolderPath);

  const pathStyles = path.join(__dirname, 'styles');
  const resultFilePath = path.join(__dirname, 'project-dist', 'style.css');

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

