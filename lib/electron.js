var Program = require('./electron/program')
  , Args = require('./electron/args');

var exports = module.exports = function (name, opts) {
  return new Program(name, opts);
};

exports.version = '0.1.2';

exports.argv = function (args) {
  var argv = new Args(args);
  return argv;
};
