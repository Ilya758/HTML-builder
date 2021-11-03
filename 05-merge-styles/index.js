/* eslint-disable indent */
const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const stylesPath = path.join(__dirname, 'styles');
const distPath = path.join(__dirname, 'project-dist/bundle.css');
const output = fs.createWriteStream(distPath);

fsPromises
    .readdir(stylesPath)
    .then(async (files) => {
        files.forEach(async (file) => {
            const filePath = path.join(stylesPath, file);
            const fileName = path.basename(filePath);
            const ext = path.extname(filePath);
            if (ext === '.css') {
                const input = fs.createReadStream(path.join(stylesPath, fileName));
                input.on('data', data => {
                    output.write(data.toString() + '\n');
                });
            }
        });
    });