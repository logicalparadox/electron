describe('program', function () {
  var Args = __electron.Args
    , Command = __electron.Command
    , Program = __electron.Program;

  describe('factory', function () {
    it('can return a program without using options', function () {
      var program = electron();
      program.should.be.instanceof(Program);
    });

    it('can return a program with using options', function () {
      var program = electron('test', { name: 'Testing' });
      program.should.be.instanceof(Program);
      program.should.have.deep.property('opts.base', 'test');
      program.should.have.deep.property('opts.name', 'Testing');
      program.should.have.deep.property('opts.theme.name', 'clean');
    });
  });

  describe('option helpers', function () {
    it('can modify the name', function () {
      var program = electron('test', { name: 'Hello' });
      program.should.be.instanceof(Program);
      program.should.have.deep.property('opts.base', 'test');
      program.should.have.deep.property('opts.name', 'Hello');

      var chain = program.name('Universe');
      chain.should.deep.equal(program);
      program.should.have.deep.property('opts.name', 'Universe');
    });

    it('can modify version', function () {
      var program = electron('test');
      program.should.be.instanceof(Program);
      program.should.have.deep.property('opts.version', null);

      var chain = program.version('0.1.0');
      chain.should.deep.equal(program);
      program.should.have.deep.property('opts.version', '0.1.0');
    });

    it('can modify the cwd', function () {
      var program = electron('test');
      program.should.be.instanceof(Program);
      program.should.have.deep.property('opts.cwd', process.cwd());

      var chain = program.cwd('/opt/electron');
      chain.should.deep.equal(program);
      program.should.have.deep.property('opts.cwd', '/opt/electron');
    });

    describe('theme', function () {
      it('can use a theme object', function () {
        var program = electron('test');
        program.should.be.instanceof(Program);
        program.should.have.deep.property('opts.theme')
          .deep.equal({ name: 'clean', spec: { noColor: false }});

        var chain = program.theme('classic');
        chain.should.deep.equal(program);
        program.should.have.deep.property('opts.theme')
          .deep.equal({ name: 'classic', spec: { noColor: false }});

        program.theme('classic', { noColor: true, prefix: 'help: ' });
        program.should.have.deep.property('opts.theme')
          .deep.equal({ name: 'classic', spec: { noColor: true, prefix: 'help: '}});
      });

      it('can use a theme function', function () {
        var program = electron('test');
        program.should.be.instanceof(Program);
        program.should.have.deep.property('opts.theme')
          .deep.equal({ name: 'clean', spec: { noColor: false }});

        var theme = function () {}
          , chain = program.theme(theme);
        chain.should.deep.equal(program);
        program.should.have.deep.property('opts.theme', theme);
      });
    });
  });

  describe('commands', function () {
    var program = electron('test')
      , cmd;

    it('can be constructed', function () {
      cmd = program.command('universe');
      cmd.should.be.instanceof(Command);
      cmd.should.have.property('opts');
      cmd.should.have.deep.property('opts.cmd', 'universe');
      cmd.should.have.deep.property('opts.desc', '');
      cmd.should.have.deep.property('opts.options')
        .an('array').with.lengthOf(0)
      cmd.should.have.deep.property('opts.action')
        .a('function');
    });

    it('can have description changed', function () {
      cmd.should.respondTo('description');
      cmd.should.respondTo('desc');

      var desc = 'Hello Universe'
        , chain = cmd.desc(desc);
      chain.should.deep.equal(cmd);
      cmd.should.have.deep.property('opts.desc', desc);
    });

    it('can have options added', function () {
      cmd.should.respondTo('description');
      cmd.should.respondTo('desc');

      var chain = cmd.option('-p, --port [6000]', 'Provide a port');
      chain.should.deep.equal(cmd);
      cmd.should.have.deep.property('opts.options')
        .an('array').with.lengthOf(1);

      var opt1 = cmd.opts.options[0]
      opt1.should.have.property('desc')
        .a('string', 'Provide a port');
      opt1.should.have.property('required', false);
      opt1.should.have.property('opts')
        .an('object').with.property('flags')
          .an('array').with.lengthOf(2)
          .and.include('p', 'port');
      opt1.opts.should.have.property('def')
        .a('string', '6000');

      cmd.option('-h, --host', 'Provide a host', true);
      cmd.should.have.deep.property('opts.options')
        .an('array').with.lengthOf(2);

      var opt2 = cmd.opts.options[1]
      opt2.should.have.property('desc')
        .a('string', 'Provide a host');
      opt2.should.have.property('opts')
        .an('object').with.property('flags')
          .an('array').with.lengthOf(2)
          .and.include('h', 'host');
      opt2.opts.should.have.property('def', null);
      opt2.should.have.property('required', true);
    });

    it('can have actions added', function () {
      cmd.should.respondTo('action');
      var action = function () { 1 == 1 };
      cmd.action(action);
      cmd.should.have.deep.property('opts.action', action);
    });
  });

  describe('parsing', function () {
    it('can use a default command', function () {
      var program = electron('test')
        , spy = chai.spy(function (args) {
            args.should.be.instanceof(Args);
          });

      program
        .command('default')
        .action(spy);

      var subject = 'node test.js'.split(' ');
      program.parse(subject);
      spy.should.have.been.called.once;
    });

    it('can use an absent command', function () {
      var program = electron('test')
        , spy = chai.spy(function (args) {
            args.should.be.instanceof(Args);
          });

      program
        .command('absent')
        .action(spy);

      var subject = 'node test.js hello'.split(' ');
      program.parse(subject);
      spy.should.have.been.called.once;
    });

    it('can use a custom command', function () {
      var program = electron('test')
        , spy = chai.spy(function (args) {
            args.should.be.instanceof(Args);
          });

      program
        .command('hello')
        .action(spy);

      var subject = 'node test.js hello'.split(' ');
      program.parse(subject);
      spy.should.have.been.called.once;
    });

    it('can use a wildcard command', function () {
      var program = electron('test')
        , spy = chai.spy(function (args) {
            args.should.be.instanceof(Args);
            args.commands[1].should.equal('universe');
          });

      program
        .command('hello *')
        .action(spy);

      var subject = 'node test.js hello universe'.split(' ');
      program.parse(subject);
      spy.should.have.been.called.once;
    });
  });

  describe('help', function () {
    it('can use a custom help function', function () {
      var program = electron('test')
        , theme = chai.spy(function () {
            program.colorize(true);
            ('hello'.green).should.equal('hello');
          });

      program.theme(theme);

      var subject = 'node test.js --help'.split(' ');
      program.parse(subject);
      theme.should.have.been.called.once;
    });
  });
});
