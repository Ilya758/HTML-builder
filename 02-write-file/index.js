/* eslint-disable indent */
const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = require('process');
const absPath = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(absPath);
stdout.write('Have a nice day! Please, enter the text...\n');
stdin.on('data', data => {
    if (data.toString().trim() === 'exit') {
        sayBye();
    }
    output.write(data);
});

process.on('SIGINT', sayBye);

function sayBye() {
    stdout.write('\nNice to meet you. Good luck!');
    exit();
}