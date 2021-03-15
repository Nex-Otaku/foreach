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
    .option('-d, --directory', 'only directories')
    .option('-f, --file', 'only files')
    .option('-r, --recursive', 'search recursively')
    .option('--include-dot-directories', 'do not skip directories with names started with dot - ".git", ".idea" etc')
    .option('--include-directories-ignored-by-git', 'do not skip ".gitignore"\'d directories')
    .description('Applies command to all files and directories found at specified path', {
        path: 'Path for searching files and directories, optionally with mask',
        action: 'Command to execute on each file and folder'
    })
    .action(async (path, action, options) => {
        return lib.applyCommand(path, action.join(' '), options);
    });

commander.parse(process.argv);
