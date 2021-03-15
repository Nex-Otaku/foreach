const fs = require('fs');
const path = require('path');

const isMatchedByMask = (filename, mask) => {
    // TODO
    return true;
};

const getCurrentDirectory = () => {
    return process.cwd();
};

const directoryExists = (filePath) => {
    return fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory();
};

const getFilesWithMask = (filePath, mask, onlyFiles, onlyDirectories) => {
    if (!directoryExists(filePath)) {
        return [];
    }

    let dirCont = fs.readdirSync(filePath);

    let files = dirCont
        .filter( function( filename ) {
            return isMatchedByMask(filename, '*');
        })
        .map(filename => {
            const basePath = filePath.startsWith(path.sep) ? filePath : getCurrentDirectory() + path.sep + filePath;
            const fullPath = basePath + path.sep + filename;

            return path.normalize(fullPath);
        });

    if (onlyFiles) {
        files = files.filter((filename) => { return !directoryExists(filename); });
    }

    if (onlyDirectories) {
        files = files.filter((filename) => { return directoryExists(filename); });
    }

    return files;
};

module.exports = {
    getFilesWithMask: getFilesWithMask,

    directoryExists: directoryExists,
};