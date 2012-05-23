var Drip = require('drip')
  , util = require('util');

var Args = require('./args')
  , Command = require('./command');

module.exports = Cli;

function Cli (base, opts) {
  Drip.call(this, { delimeter: ' ' });
  this.commands = [];
  this.opts = opts || {};
  this.opts.base = base;
}

util.inherits(Cli, Drip);

Cli.prototype.command = function (name) {
  var cmd = new Command(name);
  this.commands.push(cmd);
  return cmd;
};

Cli.prototype.cwd = function (p) {
  this.opts.cwd = p;
  return this;
};

Cli.prototype.parse = function (args) {
  mountCommands.call(this);
  var argv = new Args(args)
    , command = argv.args.slice(0);
  argv.cwd = this.opts.cwd || process.cwd();
  if (~argv.modes.indexOf('v') || ~argv.modes.indexOf('version'))
    displayVersion.call(this);
  else if (~argv.modes.indexOf('h') || ~argv.modes.indexOf('help'))
    displayHelp.call(this);
  else if (command.length)
    this.emit(command, argv, null, null);
  return this;
};

Cli.prototype.version = function (v) {
  this.opts.version = v;
  return this;
};

Cli.prototype.name = function (name) {
  this.opts.name = name;
  return this;
};


function mountCommands () {
  var self = this
    , cmds = [];

  this.commands.forEach(function (command) {
    var ev = command.opts.cmd
      , fn = command.opts.action;
    if (!~cmds.indexOf(ev)) {
      cmds.push(ev);
      self.on(ev, fn);
    }
  });
}

function displayVersion () {
  console.log(this.opts.version);
}

function displayHelp () {
  var colors = {
      'red': '\u001b[31m'
    , 'green': '\u001b[32m'
    , 'yellow': '\u001b[33m'
    , 'blue': '\u001b[34m'
    , 'magenta': '\u001b[35m'
    , 'cyan': '\u001b[36m'
    , 'gray': '\u001b[90m'
    , 'reset': '\u001b[0m'
  };

  Object.keys(colors).forEach(function (color) {
    Object.defineProperty(String.prototype, color, {
      get: function () { return colors[color] + this + colors['reset']; }
    });
  });

  function l (s) {
    console.log('  ' + s);
  }

  function pad (str, width) {
    return Array(width - str.length).join(' ') + str;
  }

  var name = this.opts.name || this.opts.base
    , base = this.opts.base;

  l('');
  l(name.magenta + ' ' + this.opts.version);
  l('');

  this.commands.forEach(function (cmd) {
    var c = cmd.opts;
    l(base.gray + ' ' + c.cmd.green + (c.options.length ?   ' <options>' :  ''));
    l(pad('', 4) + c.desc.blue);

    if(c.options.length) {
      c.options.forEach(function (opt) {
        l(pad('', 6) + opt.opts.join(' ') + ' ' + opt.description.gray);
      });
    }
    l('');
  });

  process.exit();
}
