/* eslint-disable indent */
const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const dist = path.join(__dirname, 'project-dist');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');

(function createDistDir() {
    fs.mkdir(path.join(__dirname, 'project-dist'), {
        recursive: true,
    }, err => {
        if (err) {
            throw new Error('Folder already exists or it maybe another problem with it');
        }
        // console.log('Folder successfully created.');
    });
})();

(function createMarkupFile() {
    const input = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
    const output = fs.createWriteStream(path.join(dist, 'index.html'));
    let str = '';
    input.on('data', data => {
        str = data.toString();

        function mapper(elem) {
            return `{{${elem}}}`;
        }
        const componentsPath = path.join(__dirname, 'components');

        fs.readdir(
            componentsPath,
            { withFileTypes: true },
            (err, data) => {
                if (err) throw err;

                const temps = [];
                data.forEach(temp => {
                    const fileName = temp.name.match(/([\w]*\.)*/)[0].replace('.', '');
                    temps.push(mapper(fileName));
                });

                fsPromises
                    .readdir(path.join(__dirname, 'components'))
                    .then(result => {
                        result.forEach((comp, ndx) => {
                            const readableStream = fs.createReadStream(path.join(__dirname, 'components', comp), 'utf-8');
                            readableStream.on('data', data => {
                                str = str.replace(temps[ndx], data);

                                if (!temps.find(temp => str.includes(temp))) {
                                    output.write(str);
                                }
                            });
                        });
                    });
            }
        );
    });
})();

(function copyStyles() {
    const output = fs.createWriteStream(path.join(dist, 'style.css'));
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
                        output.write('\n' + data.toString() + '\n');
                    });
                }
            });
        });
})();

(function copyAssetsDir() {
    fs.mkdir(path.join(dist, 'assets'), {
        recursive: true,
    }, err => {
        if (err) {
            throw new Error('Folder already exists or it maybe another problem with it');
        }
        //console.log('Folder successfully created.');
    });


    async function copyFilesFromDir(dir, dest) {
        await fsPromises
            .readdir(dir, { withFileTypes: true })
            .then(files => {
                files.forEach(async (file) => {
                    if (file.isDirectory()) {
                        const absDirPath = path.join(dir, file.name);
                        const destPath = path.join(dest, file.name);
                        copyFilesFromDir(absDirPath, destPath);
                    }
                    else {
                        fs.mkdir(dest, {
                            recursive: true,
                        }, err => {
                            if (err) {
                                throw new Error('Folder already exists or it maybe another problem with it');
                            }
                            //console.log('Folder successfully created.');
                        });
                        fsPromises.copyFile(path.join(dir, file.name), path.join(dest, file.name));
                    }
                });
            });
    }
    copyFilesFromDir(assetsPath, path.join(dist, 'assets'));
})();