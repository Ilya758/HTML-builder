/* eslint-disable indent */
const fs = require('fs');
const fsPromises = fs.promises;
const copyFile = fsPromises.copyFile;
const path = require('path');

(function copyDir() {
    fs.mkdir(path.join(__dirname, 'files-copy'), {
        recursive: true,
    }, err => {
        if (err) {
            throw new Error('Folder already exists or it maybe another problem with it');
        }
        console.log('Folder successfully created.');
    });

    fsPromises
        .readdir(path.join(__dirname, 'files'))
        .then(files => {
            files.forEach(file => {
                const filePath = path.join(__dirname, 'files', file);
                copyFile(filePath, path.join(__dirname, 'files-copy', file));
                console.log(file);
            });
        });
})();