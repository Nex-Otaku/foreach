#!/usr/bin/env node

const commander = require('commander');
const lib = require('./src/lib');

commander.version('0.1.0')
    .on('--help', () => {
        console.log('')
        console.log('Examples:')
        console.log('')
        console.log('  foreach path/to/files your-action')
    })
    .arguments('<path-to-files> <action...>')
    .description('Applies command to all files and directories found at specified path', {
        path: 'Path for searching files and directories, optionally with mask',
        action: 'Command to execute on each file and folder'
    })
    .action(async (path, action) => {
        return lib.applyCommand(path, action.join(' '));
    });

commander.parse(process.argv);