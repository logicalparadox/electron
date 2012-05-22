var CLI = require('./electron/cli');

var exports = module.exports = function (name, opts) {
  return new CLI(name, opts);
};

exports.CLI = CLI;
exports.version = '0.1.1';
