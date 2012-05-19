var electron = require('..');

var program = electron('testing');

program
  .name('Electron Testing')
  .version('0.0.1');

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


program.parse(process.argv);
