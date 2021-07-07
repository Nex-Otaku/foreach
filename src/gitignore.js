const parse = require('parse-gitignore');
const ignore = require('ignore');
const files = require('./files');
const path = require('path');

let roots = [];
let rootPaths = [];

const stripFirstSlash = (filePath) => {
    if (!filePath.startsWith('/') && !filePath.startsWith('\\')) {
        return filePath;
    }

    return filePath.substring(1);
};

const makeForwardSlashes = (filePath) => {
    return filePath.replace('\\', '/');
};

const isIgnoredForRoot = (root, filePath) => {
    if (!filePath.startsWith(root.rootPath)) {
        return false;
    }

    if (filePath === root.rootPath) {
        return false;
    }

    const relativePath = filePath.substring(root.rootPath.length);
    const normalizedRelativePath = makeForwardSlashes(stripFirstSlash(relativePath)) + '/';

    return root.checker.ignores(normalizedRelativePath);
};

const isRootRegistered = (filePath) => {
    return rootPaths.includes(filePath);
};

const addGitignore = (directoryPath) => {
    if (isRootRegistered(directoryPath)) {
        return;
    }

    rootPaths.push(directoryPath);
    const filePath = directoryPath + path.sep + '.gitignore';

    if (!files.fileExists(filePath)) {
        return;
    }

    const fileContent = files.readFile(filePath);
    const localRules = parse(fileContent);

    roots.push({
        checker: ignore().add(localRules),
        rootPath: directoryPath
    });
};

const isIgnored = (filePath) => {
    for (let i = 0; i < roots.length; i++) {
        if (isIgnoredForRoot(roots[i], filePath)) {
            return true;
        }
    }

    return false;
};

module.exports = {
    addGitignore: addGitignore,
    isIgnored: isIgnored,
};