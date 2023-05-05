const fs = require('fs');
const path = require('path');
let data = '';

console.log(__dirname);
const stream = fs.createReadStream(
  path.join(__dirname, 'text.txt'),
  'utf-8'
);
stream.on('data', (chunkFile) => {
  data += chunkFile;
});
stream.on('end', () => console.log(data));
