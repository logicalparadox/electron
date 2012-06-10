var electron = require('..')
  , program = electron('node clean.js');

program
  .name('Electron Clean Theme')
  .desc('https://github.com/logicalparadox/electron')
  .version('0.2.x');

program
  .command('start simple')
  .description('Start a simple task')
  .option('-p, --port [6000]', 'Set the simple port')
  .option('-f, --file [path]', 'Use a specific file for this task', true)
  .option('-l, --local', 'Flag as local task')
  .action(function (args) {
    console.log(args.mode('l', 'local'));
    console.log(args.param('p', 'port'));
  });

program
  .command('start complex')
  .description('Start a complex task')
  .option('-p, --port [6000]', 'Set the comples port')
  .option('-f, --file [path]', 'Use a specific file for this task', true)
  .option('-l, --local', 'Flag as local task')
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
