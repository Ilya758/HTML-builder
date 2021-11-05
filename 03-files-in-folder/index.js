/* eslint-disable indent */
const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

fsPromises
    .readdir(path.join(__dirname, 'secret-folder'), {
        withFileTypes: true,
    })
    .then(results => {
        results.forEach(result => {
            if (!result.isDirectory()) {
                const filePath = path.join(
                    __dirname,
                    'secret-folder',
                    result.name
                );
                const fileName = path.basename(filePath);
                const ext = path.extname(filePath);
                fsPromises.stat(filePath).then(res => {
                    console.log(
                        `${fileName.replace(ext, '')} - ${ext.replace(
                            '.',
                            ''
                        )} - ${res.size}b`
                    );
                });
            }
        });
    });
