
module.exports = function cleanHelp (spec) {
  spec = spec || {};
  spec.prefix = spec.prefix || '';
  this.colorize(spec.noColor || false);

  var l = function (s) { console.log(spec.prefix.cyan+ '  ' + (s || '')); }
    , pad = function (s, w) { return Array(w - s.length - 1).join(' ') + s; }
    , name = this.opts.name
    , base = this.opts.base;

  l();
  l(name.magenta + ' ' + this.opts.version);

  this.commands.forEach(function (cmd) {
    if (cmd.opts.cmd === 'absent') return;
    var c = cmd.opts
      , command = c.cmd !== 'default' ? c.cmd + ' ' : ''
      , opts = c.options.length ? '<options>' : '';

    l();
    l(base.gray + ' ' + command.green + opts);
    if (c.desc.length) l(pad('', 4) + c.desc.blue);
    if (!c.options.length) return;

    c.options.forEach(function (opt) {
      var n = c.desc.length ? 6 : 4
        , opts = opt.opts.flags.map(function (flag) {
            if (flag.length === 1) return '-' + flag;
            else return '--' + flag;
          });

      l(pad('', n) + opts.join(', ')
        + (opt.opts.def ? ' [' + opt.opts.def + ']' : '' )
        + ' ' + opt.desc.gray);
    });
  });

  l();
  process.exit();
}
