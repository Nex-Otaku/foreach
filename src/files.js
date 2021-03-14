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
    return fs.existsSync(filePath);
};

const getFilesWithMask = (filePath, mask) => {
    if (!directoryExists(filePath)) {
        return [];
    }

    let dirCont = fs.readdirSync(filePath);

    return dirCont
        .filter( function( filename ) {
            return isMatchedByMask(filename, '*');
        })
        .map(filename => {
            const basePath = filePath.startsWith(path.sep) ? filePath : getCurrentDirectory() + path.sep + filePath;

            return basePath + path.sep + filename;
        });
};

module.exports = {
    getFilesWithMask: getFilesWithMask,

    directoryExists: directoryExists,
};