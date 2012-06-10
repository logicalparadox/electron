var Drip = require('drip')
  , tty = require('tty')
  , util = require('util');

var Args = require('./args')
  , Command = require('./command');

var istty = tty.isatty(1) && tty.isatty(2);

function defaults (a, b) {
  if (a && b) {
    for (var key in b) {
      if ('undefined' == typeof a[key]) a[key] = b[key];
    }
  }
  return a;
};

module.exports = Program;

function Program (base, opts) {
  Drip.call(this, { delimeter: ' ' });
  this.commands = [];
  this.opts = defaults(opts || {}, {
      useColors: istty
    , version: null
    , name: base
    , base: base
    , cwd: process.cwd()
  });
}

util.inherits(Program, Drip);

Program.prototype.name = function (name) {
  this.opts.name = name;
  return this;
};

Program.prototype.version = function (v) {
  this.opts.version = v;
  return this;
};

Program.prototype.cwd = function (p) {
  this.opts.cwd = p;
  return this;
};

Program.prototype.command = function (name) {
  var cmd = new Command(name);
  this.commands.push(cmd);
  return cmd;
};

Program.prototype.parse = function (args) {
  mountCommands.call(this);
  var argv = new Args(args)
    , command = argv.commands.slice(0);
  if (~argv.modes.indexOf('v') || ~argv.modes.indexOf('version'))
    displayVersion.call(this);
  else if (~argv.modes.indexOf('h') || ~argv.modes.indexOf('help'))
    displayHelp.call(this);
  else if (command.length)
    this.emit(command, argv, null, null);
  return this;
};


Program.prototype.colorize = function () {
  var self = this
    , colors = {
          'red': 31 // '\u001b[31m'
        , 'green': 32 // '\u001b[32m'
        , 'yellow': 33 // '\u001b[33m'
        , 'blue': 34 // '\u001b[34m'
        , 'magenta': 35 // '\u001b[35m'
        , 'cyan': 36 // '\u001b[36m'
        , 'gray': 90 // '\u001b[90m'
        , 'reset': 0 // '\u001b[0m'
      };

  Object.keys(colors).forEach(function (color) {
    Object.defineProperty(String.prototype, color,
      { get: function () {
          if (!self.opts.useColors) return this;
          return '\033[' + colors[color] + 'm' + this + '\033[0m';
        }
    });
  });
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
  this.colorize();

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
