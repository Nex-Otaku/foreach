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
    let exists = false;

    try {
        exists = fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory();
    } catch (error) {
        return false;
    }

    return exists;
};

const pathStartsFromRoot = (filePath) => {
    return filePath.startsWith(path.sep) || filePath.match(/[a-zA-Z]:[\\\/]/);
}

const getFullFilePath = (filePath, filename) => {
    const basePath = pathStartsFromRoot(filePath) ? filePath : getCurrentDirectory() + path.sep + filePath;
    const fullPath = basePath + path.sep + filename;

    return path.normalize(fullPath);
};

const searchInDirectory = (
    filePath,
    mask,
    onlyFiles,
    onlyDirectories
) => {
    if (!directoryExists(filePath)) {
        return [];
    }

    let dirCont = fs.readdirSync(filePath);

    let files = dirCont
        .filter( function( filename ) {
            return isMatchedByMask(filename, '*');
        })
        .map(filename => { return getFullFilePath(filePath, filename); });


    if (onlyFiles) {
        files = files.filter((filename) => { return !directoryExists(filename); });
    }

    if (onlyDirectories) {
        files = files.filter((filename) => { return directoryExists(filename); });
    }

    return files;
};

const getAllNestedDirectories = (filePath) => {
    if (!directoryExists(filePath)) {
        return [];
    }

    const dirCont = fs.readdirSync(filePath);
    const paths = dirCont.map(filename => { return getFullFilePath(filePath, filename); });
    const directories = paths.filter((path) => { return directoryExists(path); });
    let results = [].concat(directories);

    for (let i = 0; i < directories.length; i++) {
        const directory = directories[0];

        results = results.concat(getAllNestedDirectories(directory));
    }

    return results;
};

const getFilesWithMask = (
    filePath,
    mask,
    onlyFiles,
    onlyDirectories,
    recursive
) => {
    if (recursive) {
        const directories = getAllNestedDirectories(filePath);
        let results = [];

        for (let i = 0; i < directories.length; i++) {
            const directory = directories[i];
            results = results.concat(searchInDirectory(directory, mask, onlyFiles, onlyDirectories));
        }

        return results;
    }

    return searchInDirectory(filePath, mask, onlyFiles, onlyDirectories);
};

module.exports = {
    getFilesWithMask: getFilesWithMask,

    directoryExists: directoryExists,
};