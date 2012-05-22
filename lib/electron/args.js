module.exports = Args;

function Args (args) {
  this._raw = args;
  this.cwd = process.cwd;

  this.modes = [];
  this.args = [];
  this.params = {};

  processArgs.call(this, args);
}

Args.prototype.mode = filter('modes');

Args.prototype.arg = filter('args');

Args.prototype.param = function () {
  var params = Array.prototype.slice.call(arguments)
    , res = null;

  for (var i = 0; i < params.length; i++) {
    if ('undefined' !== typeof this.params[params[i]]) {
      res = this.params[params[i]];
      break;
    }
  }

  return res;
};

function processArgs (args) {
  var param_key = null
    , parts = process.argv.slice(2)
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
      input.args.push(part);
    }
  });

  checkParamKey();
}

function filter (which) {
  return function () {
    var modes = Array.prototype.slice.call(arguments)
      , res = false;

    for (var i = 0; i < modes.length; i++) {
      if (~this[which].indexOf(modes[i]))
        res = true;
    }

    return res;
  };
}
