var electron = require('..')
  , program = electron('node basic.js');

program
  .name('Electron Testing')
  .desc('https://github.com/logicalparadox/electron')
  .version(electron.version);

program
  .command('simple')
  .description('A simple task')
  .option('-p, --port [6000]', 'Set the simple port.')
  .option('-f, --file [path]', 'Use a file', true)
  .option('-l, --local', 'Flag a local variable')
  .action(function (args) {
    console.log(args.mode('l', 'local'));
    console.log(args.param('p', 'port'));
  });

program
  .command('absent')
  .action(function (args) {
    var cmd = args.commands.join(' ');
    console.log(cmd + ' is not a valid command. Try --help for a list.');
  });

program.parse();
