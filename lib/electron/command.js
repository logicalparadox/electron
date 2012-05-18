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

// ('-p, --port [6000]', 'Set the port'); => not require, default 6000
// ('-p, --port', 'Set the port', true); => required

Command.prototype.option = function (opt, desc, required) {
  this.opts.options.push({
      opts: opt.split(' ')
    , description: desc
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
