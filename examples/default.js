var electron = require('..');

var program = electron('node default.js');

program
  .name('Electron Default Example')
  .version(electron.version);

program
  .command('default')
  .option('-f, --file [name]', 'File paramter')
  .option('-l, --local', 'Local mode')
  .action(function (args) {
    console.log('file:  ' + args.param('f', 'file'));
    console.log('local: ' + args.mode('l', 'local'));
  });

program.parse(process.argv);
