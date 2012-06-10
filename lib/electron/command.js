module.exports = Command;

function Command(cmd) {
  this.opts = {
      cmd: cmd
    , desc: ''
    , options: []
    , action: function () {}
  }
}

Command.prototype.description = function (desc) {
  this.opts.desc = desc;
  return this;
};

Command.prototype.desc = Command.prototype.description;

// ('-p, --port [6000]', 'Set the port'); => not require, default 6000
// ('-p, --port', 'Set the port', true); => required

Command.prototype.option = function (opt, desc, required) {
  var opts = prepareOptions(opt);

  this.opts.options.push({
      opts: opts
    , desc: desc
    , required: ('boolean' === typeof required)
      ? required
      : false
  });

  return this;
};

Command.prototype.action = function (fn) {
  if ('function' === typeof fn)
    this.opts.action = fn;
  return this;
};

function prepareOptions (str) {
  var list = str.split(' ')
    , res = { flags: [], def: null }
    , m;

  list.forEach(function (line) {
    // remove trailing commas
    if (line[line.length - 1] === ',')
      line = line.substr(0, line.length - 1);

    // parse out flags and default value
    if (line.substr(0, 2) === '--')
      res.flags.push(line.substr(2));
    else if (line[0] === '-')
      res.flags.push(line.substr(1));
    else if (m = line.match(/[^\[\]]+(?=\])/g))
      if (!res.def) res.def= m[0];
  });

  return res;
}
