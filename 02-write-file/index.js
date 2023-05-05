const fs = require('fs');
const path = require('path');
const readline = require('readline');

const dirPathFile = path.join(__dirname);
const writeableStream = fs.createWriteStream(dirPathFile + '/text.txt', { flags: 'w' });

console.log('Введите текст (для завершения нажмите Ctrl + C или введите exit)');

const rl = readline.createInterface({
  input: process.stdin,
});

rl.on('line', (input) => {
  writeableStream.write(input + '\n', (err) => {
    if (err) {
      console.log(err.message);
    }
  });
  if (input === 'exit') {
    console.log('Работа завершена. Всего хорошего!');
    writeableStream.end();
    process.exit();
  } else {
    process.on('SIGINT', () => {
      console.log('Работа завершена. Всего хорошего!');
      process.exit();
    });
  }
});

