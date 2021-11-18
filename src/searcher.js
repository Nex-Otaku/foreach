const fs = require('fs');
const path = require('path');
const files = require('./files');
const gitignore = require('./gitignore');

const isMatchedByMask = (filename, mask) => {
    if (mask === '*') {
        return true;
    }

    if (!mask.includes('*')) {
        return filename === mask;
    }

    if (mask.startsWith('*')) {
        return filename.endsWith(mask.substring(1));
    }

    if (mask.endsWith('*')) {
        return filename.startsWith(mask.substring(0, mask.length - 1));
    }

    return false;
};

const getCurrentDirectory = () => {
    return process.cwd();
};

const pathStartsFromRoot = (filePath) => {
    return filePath.startsWith(path.sep) || filePath.match(/[a-zA-Z]:[\\\/]/);
}

const getBasePath = (filePath) => {
    const basePath = pathStartsFromRoot(filePath) ? filePath : getCurrentDirectory() + path.sep + filePath;

    return path.normalize(basePath);
}

const getFullFilePath = (filePath, filename) => {
    const fullPath = getBasePath(filePath) + path.sep + filename;

    return path.normalize(fullPath);
};

const isDotDirectory = (dirname) => {
    return dirname !== '.'
        && dirname !== '..'
        && dirname.startsWith('.');
};

const isGitIgnoredDirectory = (directoryPath) => {
    return gitignore.isIgnored(directoryPath);
};

const searchInDirectory = (
    filePath,
    mask,
    onlyFiles,
    onlyDirectories,
    includeDotDirectories,
    includeDirectoriesIgnoredByGit
) => {
    if (!files.directoryExists(filePath)) {
        return [];
    }

    gitignore.addGitignore(getBasePath(filePath));

    let dirCont = fs.readdirSync(filePath);

    let paths = dirCont
        .filter( function( filename ) {
            return isMatchedByMask(filename, mask);
        })
        .filter(dirname => {
            const fullPath = getFullFilePath(filePath, dirname);

            return files.fileExists(fullPath)
                || (files.directoryExists(fullPath) && (includeDotDirectories || !isDotDirectory(dirname)));
        })
        .map(filename => { return getFullFilePath(filePath, filename); })
        .filter(directoryPath => {
            return files.fileExists(directoryPath)
                || files.directoryExists(directoryPath) && (includeDirectoriesIgnoredByGit || !isGitIgnoredDirectory(directoryPath));
        });

    if (onlyFiles) {
        paths = paths.filter((filename) => { return files.fileExists(filename); });
    }

    if (onlyDirectories) {
        paths = paths.filter((filename) => { return files.directoryExists(filename); });
    }

    return paths;
};

const getAllNestedDirectories = (
    filePath,
    includeDotDirectories,
    includeDirectoriesIgnoredByGit
) => {
    if (!files.directoryExists(filePath)) {
        return [];
    }

    gitignore.addGitignore(getBasePath(filePath));

    const dirCont = fs.readdirSync(filePath)
        .filter(dirname => { return includeDotDirectories || !isDotDirectory(dirname); });

    const paths = dirCont.map(filename => { return getFullFilePath(filePath, filename); })
        .filter(directoryPath => { return includeDirectoriesIgnoredByGit || !isGitIgnoredDirectory(directoryPath); });

    const directories = paths.filter((path) => { return files.directoryExists(path); });
    let results = [].concat(directories);

    for (let i = 0; i < directories.length; i++) {
        const directory = directories[i];

        results = results.concat(getAllNestedDirectories(directory));
    }

    return results;
};

const getFilesWithMask = (
    filePath,
    mask,
    onlyFiles,
    onlyDirectories,
    recursive,
    includeDotDirectories,
    includeDirectoriesIgnoredByGit
) => {
    let results = searchInDirectory(
        filePath,
        mask,
        onlyFiles,
        onlyDirectories,
        includeDotDirectories,
        includeDirectoriesIgnoredByGit
    );

    if (recursive) {
        const directories = getAllNestedDirectories(
            filePath,
            includeDotDirectories,
            includeDirectoriesIgnoredByGit
        );

        for (let i = 0; i < directories.length; i++) {
            const directory = directories[i];

            results = results.concat(searchInDirectory(
                directory,
                mask,
                onlyFiles,
                onlyDirectories,
                includeDotDirectories,
                includeDirectoriesIgnoredByGit
            ));
        }
    }

    return results;
};

module.exports = {
    getFilesWithMask: getFilesWithMask
};