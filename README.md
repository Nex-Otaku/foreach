# For Each

Apply a command to multiple files and directories with **ForEach**

```bash
# Remove all temporary files from home
foreach --file --mask "*.tmp" ~ rm

# List all files and directories in current directory
foreach . echo

# List current Git branch for all projects
foreach --directory ~/projects "cd <file> && git status | grep branch"

# Change all Windows line endings to Unix (CRLF to LF)
foreach --file --recursive ~/projects dos2unix

# Change all tabs to spaces in PHP source files
foreach --file --mask "*.php" --recursive ~/projects/myproject "expand -i -t 4 <file> | sponge <file>"
```

## How it works

 - Takes a path to directory optionally with a mask
 - Applies command **for each** file or directory in this path

## Options

Option | Description
--- | ---
**-d, --directory** | Apply command only to directories
**-f, --file** | Apply command only to files
**-r, --recursive** | Search recursively
**-m, --mask** | Search mask, applied only to search results
**--include-dot-directories** | Look inside directories with names started with dot - ".git", ".idea" etc. Ignoring these directories by default.
**--include-directories-ignored-by-git** | Do not use ".gitignore" rules. By default we skip all directories mentioned in ".gitignore".

## Getting Started

To use this tool, you need [NodeJS](https://nodejs.org/).

```
sudo npm install -g @nex_otaku/foreach
```

## Usage

```
foreach path/to/directory your-action
```

## Features

 - Recursive search is supported
 - Respects ".gitignore" rules
 - Skips directories with dot - ".git", ".idea" etc
 - Search can be limited to files or to directories
 - Search by mask

## To Be Done

 - Continue after failed commands
 - Remember last 10 commands
 - Input from file
 - Dry run mode


## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

- **[MIT license](http://opensource.org/licenses/mit-license.php)**
- Copyright 2021 © Nex Otaku.
