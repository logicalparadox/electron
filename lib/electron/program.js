var Drip = require('drip')
  , tty = require('tty')
  , util = require('util');

var Args = require('./args')
  , Command = require('./command')
  , themes = require('./themes');

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
    , name: base || 'Electron'
    , base: base || 'electron'
    , cwd: process.cwd()
    , theme: {
          name: 'clean'
        , spec: {
            noColor: false
          }
      }
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

Program.prototype.theme = function (name, spec) {
  if ('function' === typeof name) {
    this.opts.theme = name;
  } else {
    var theme = {};
    theme.name = name || 'clean';
    theme.spec = defaults(spec || {}, { noColor: false });
    this.opts.theme = theme;
  }

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

  argv.cwd = this.opts.cwd;
  if (argv.mode('help', 'h')) {
    displayHelp.call(this);
  } else if (argv.mode('version', 'v')) {
    displayVersion.call(this);
  } else if (!command.length) {
    if (cmds.def) cmds.def(argv);
  } else if (!this.has(command)) {
    if (cmds.absent) cmds.absent(argv);
  } else {
    this.emit(command, argv);
  }

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
    , res = {}
    , arr = [];

  this.commands.forEach(function (command) {
    var fn = command.opts.action
      , ev = Array.isArray(command.opts.cmd)
          ? command.opts.cmd.join(' ')
          : command.opts.cmd;

    if (ev === 'default') res.def = fn;
    else if (ev === 'absent') res.absent = fn;
    else if (!~arr.indexOf(ev)) {
      arr.push(ev);
      self.on(ev, fn);
    }
  });

  return res;
}

function displayVersion () {
  process.stdout.write(this.opts.version + '\n');
}

function displayHelp () {
  if ('function' === typeof this.opts.theme)
    return this.opts.theme.call(this);

  var name = this.opts.theme.name
    , theme = themes[name]
    , spec = this.opts.theme.spec || {};

  if (!theme) throw new Error('Electron: Invalid help theme defined.');
  else theme.call(this, spec);
}
