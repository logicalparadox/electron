module.exports = Args;

function Args (args) {
  this._raw = args;

  this.modes = [];
  this.commands = [];
  this.params = {};

  processArgs.call(this, args);
}

Args.prototype.mode = filter('modes');

Args.prototype.param = filter('params');

Args.prototype.command = filter('commands');

function processArgs (args) {
  var param_key = null
    , parts = args.slice(2)
    , input = this;

  function checkParamKey () {
    if (param_key !== null) {
      input.modes.push(param_key);
      param_key = null;
    }
  }

  parts.forEach(function (part) {
    if (part.substr(0, 2) === '--') {
      checkParamKey();
      if (part.indexOf('=') !== -1) {
        part = part.substr(2).split('=', 2);
        return input.params[part[0]] = part[1]
      }

      return param_key = part.substr(2);
    }

    if (part[0] === '-') {
      checkParamKey();
      var sstr = part.substr(1);
      if (sstr.length > 1) {
        if (part.indexOf('=') !== -1) {
          part = part.substr(1).split('=', 2);
          return input.params[part[0]] = part[1]
        }
        for (var i = 0; i < sstr.length; i++)
          input.modes.push(sstr[i]);
        return;
      } else {
        return param_key = part.substr(1);
      }
    }

    part = Number(part) || part

    if (param_key !== null) {
      input.params[param_key] = part;
      param_key = null;
    } else {
      input.commands.push(part);
    }
  });

  checkParamKey();
}

function filter (which) {
  return function () {
    var self = this
      , modes = Array.prototype.slice.call(arguments)
      , res = Array.isArray(this[which])
        ? false
        : null;

    function check (el) {
      if (Array.isArray(self[which])) {
        return self[which].indexOf(el) > -1
          ? true
          : null;
      } else {
        return 'undefined' !== typeof self[which][el]
          ? self[which][el]
          : null;
      }
    }

    for (var i = 0; i < modes.length; i++) {
      var val = check(modes[i]);
      if (val && !res) res = val;
    }

    return res;
  };
}
