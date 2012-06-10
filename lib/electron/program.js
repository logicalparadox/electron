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
  var argv = new Args(args)
    , cmds = mountCommands.call(this)
    , command = argv.commands.slice(0);

  if (argv.mode('version', 'v')) displayVersion.call(this);
  else if (argv.mode('help', 'h')) displayHelp.call(this);
  else if (command.length === 0) this.emit('default', argv);
  else if (!~cmds.indexOf(command.join(' '))) this.emit('absent', argv);
  else this.emit(command, argv);
  return this;
};


Program.prototype.colorize = function (noColors) {
  var self = this
    , colors = {
          'red': 31
        , 'green': 32
        , 'yellow': 33
        , 'blue': 34
        , 'magenta': 35
        , 'cyan': 36
        , 'gray': 90
        , 'reset': 0
      };

  Object.keys(colors).forEach(function (color) {
    Object.defineProperty(String.prototype, color,
      { get: function () {
          if (noColors || !self.opts.useColors) return this;
          return '\033[' + colors[color] + 'm' + this + '\033[0m';
        }
    });
  });
};


function mountCommands () {
  var self = this
    , cmds = [];

  this.commands.forEach(function (command) {
    var fn = command.opts.action
      , ev = Array.isArray(command.opts.cmd)
          ? command.opts.cmd.join(' ')
          : command.opts.cmd;

    if (!~cmds.indexOf(ev)) {
      cmds.push(ev);
      self.on(ev, fn);
    }
  });

  return cmds;
}

function displayVersion () {
  process.stdout.write(this.opts.version + '\n');
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
    if (cmd.opts.cmd === 'absent') return;
    var c = cmd.opts
      , command = c.cmd === 'default'
        ? ''
        : c.cmd + ' ';

    l(base.gray + ' ' + command.green + (c.options.length ?   '<options>' :  ''));
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
