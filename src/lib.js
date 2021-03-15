const searcher = require('./searcher');
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
    const onlyFiles = options.file === true;
    const onlyDirectories = options.directory === true;
    const recursive = options.recursive === true;
    const includeDotDirectories = options.includeDotDirectories === true;
    const includeDirectoriesIgnoredByGit = options.includeDirectoriesIgnoredByGit === true;
    const entries = searcher.getFilesWithMask(
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