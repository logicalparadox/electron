---
  title: Electron
---

> A simple argument-parsing and program framework for [node.js](http://nodejs.org) command-line interfaces.

#### Features

- reimagined `process.argv` parsing utility
- framework for single or multiple command programs
- automatic `--help` command generation with multiple theming options
- built in cli coloring 
- chainable api

## Quick Start Guide

#### Installation

The `electron` package is available through [npm](http://npmjs.org). It is recommended
that you add it to your project's `package.json`.

```bash
npm install electron
```

#### Parsing Arguments

The argument parsing utility can be used independently of the program
framework. Just pass the `process.argv` from any node modules and your
ready to go.

The following command execution...

```bash
$ node cli.js build --minify --out saved.min.js
```

Could be captured as so...

```javascript
var argv = require('electron').argv();

// objects
argv.commands;               // [ 'build' ]
argv.modes;                  // [ 'minify' ]
argv.params;                 // { out: 'saved.min.js' }

// helpers
argv.command('build');       // true
argv.mode('m', 'minify');    // true
argv.param('o', 'out');      // 'saved.min.js'
```

Recommend reading the "Argument Parsing" section of this documentation
to learn about the methodologies and specifics of each of the helpers.

#### Your First Program

To construct your first program, simply execute the electron export
with a parameter of the namespace you wish to use for your program.
Then proceed to define your settings and commands.

```javascript
var myApp = require('../lib/myapp')
  , program = require('electron')('myapp');

/**
 * Define your program settings
 */

program
  .name('My Cool App')
  .desc('http://docs.mycoolapp.com')
  .version(myApp.version);

/**
 * Define your first command
 */

program
  .command('build')
  .desc('start a build task')
  .option('-m, --minify', 'flag to set enable minification')
  .option('-o, --out [file.js]', 'name of output file')
  .action(function (argv) {
    var minify = argv.mode('m', 'minify')
      , savefile = argv.param('o', 'out')
      , cwd = argv.cwd;

   program.colorize();
   console.log('Welcome to myApp'.gray + myApp.version);
   console.log('It works if it ends with '.gray + 'myApp ' + 'ok'.green);
   // etc...
  });

/**
 * Parse argv and execute respective command
 */

program.parse();
```

Your `-h, --help` and `-v, --version` will be generated for you automatically.
Recommend reading the "Program Framework" and "Constructing Commands" sections
of this documentation to learn about all of the available chainable commands
and theming options available to construct your programs.
