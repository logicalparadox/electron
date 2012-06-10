var electron = require('..');

var program = electron('node default.js');

program
  .name('Electron Default Example')
  .desc('https://github.com/logicalparadox/electron')
  .theme('simple')
  .version(electron.version);

program
  .command('default')
  .desc('This is sample cli to show off the `simple` theme.')
  .option('-f, --file [name]', 'File paramter')
  .option('-l, --local', 'Local mode')
  .action(function (args) {
    console.log('file:  ' + args.param('f', 'file'));
    console.log('local: ' + args.mode('l', 'local'));
  });

program.parse();
