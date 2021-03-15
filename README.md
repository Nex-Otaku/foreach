# For Each

Apply a command to multiple files and directories with **ForEach**

## How it works

 - Takes a path to directory optionally with a mask
 - Applies command **for each** file or directory in this path

## Examples

```bash
# Remove all temporary files from home
foreach ~/*.tmp rm

# List all files and directories in current directory
foreach . echo

# List current Git branch for all projects
foreach --directory ~/projects "cd <file> && git status | grep branch"
```

## Options

Option | Description
--- | ---
**-d, --directory** | Apply command only to directories
**-f, --file** | Apply command only to files
**--include-dot-directories** | Look inside directories with names started with dot - ".git", ".idea" etc. Ignoring these directories by default.
**--include-directories-ignored-by-git** | Do not use ".gitignore" rules. By default we skip all directories mentioned in ".gitignore".

## Getting Started

### Prerequisites

For use this tool, you need [NodeJS](https://nodejs.org/).

### Installing

You can run tool from its own repo.

```
Clone the repo
cd foreach
```

Or just install it globally to run from anywhere.

```
Clone the repo
cd foreach
npm link
```

## Usage

```
foreach path/to/directory your-action
```

## To Be Done

 - Register package on NPM
 - File mask support
 - Continue after failed commands
 - Add more examples  
 - Remember last 10 commands
 - Input from file


## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

- **[MIT license](http://opensource.org/licenses/mit-license.php)**
- Copyright 2021 © Nex Otaku.
