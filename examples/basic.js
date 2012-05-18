var electron = require('..');

var program = electron('testing');

program
  .name('Electron Testing')
  .version('0.0.1');

program
  .command('simple')
  .description('A simple task')
  .option('-p, --port [6000]', 'Set the simple port.')
  .option('-f, --file', 'Use a file', true)
  .action(function (args) {
    console.log('simple');
    console.log(args);
  });


program.parse(process.argv);
