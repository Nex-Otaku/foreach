const files = require('./files');
const exec = require('child-process-promise').exec;

const shellRun = async (command) => {
    return exec(command)
        .then(function (result) {
            return result.stdout.trim();
        })
        .catch(function (err) {
            return err.stderr.trim();
        });
};

const buildCommand = (action, filepath) => {
    if (action.includes('<file>')) {
        return action.replace(/\<file\>/g, filepath);
    }

    return action + ' ' + filepath;
};

const applyCommand = async (path, action, options) => {
    const onlyFiles = 'file' in options && options.file === true;
    const onlyDirectories = 'directory' in options && options.directory === true;
    const recursive = 'recursive' in options && options.recursive === true;
    const includeDotDirectories = 'includeDotDirectories' in options && options.includeDotDirectories === true;
    const includeDirectoriesIgnoredByGit = 'includeDirectoriesIgnoredByGit' in options && options.includeDirectoriesIgnoredByGit === true;
    const entries = files.getFilesWithMask(
        path,
        '',
        onlyFiles,
        onlyDirectories,
        recursive,
        includeDotDirectories,
        includeDirectoriesIgnoredByGit
    );

    if (entries.length === 0) {
        console.log('No matched files.');

        return;
    }

    for (let i = 0; i < entries.length; i++) {
        const filepath = entries[i];
        const command = buildCommand(action, filepath);
        const output = await shellRun(command);
        console.log(output);
    }
};

module.exports = {
    applyCommand: async (path, action, options) => {
        await applyCommand(path, action, options);
    }
}