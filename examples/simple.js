var electron = require('..');

var program = electron('node simple.js');

program
  .name('Electron Simple Theme')
  .desc('https://github.com/logicalparadox/electron')
  .theme('simple')
  .version('0.2.x');

program
  .command('default')
  .desc('This is sample cli to show off the `simple` theme.')
  .option('-p, --port [6000]', 'Set the simple port')
  .option('-f, --file [path]', 'Use a specific file for this task', true)
  .option('-l, --local', 'Flag as local task')
  .option('-t, --test', 'Run the tests first')
  .option('-w, --watch [dir]', 'Watch directory for changes')
  .action(function (args) {
    console.log('file:  ' + args.param('f', 'file'));
    console.log('local: ' + args.mode('l', 'local'));
  });

program.parse();
