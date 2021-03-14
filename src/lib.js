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

const applyCommand = async (path, action) => {
    const entries = files.getFilesWithMask(path, '');

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
    applyCommand: async (path, action) => {
        await applyCommand(path, action);
    }
}