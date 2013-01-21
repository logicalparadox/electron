describe('argv parsing', function () {
  describe('modes', function () {
    it('can parse long form modes', function () {
      var subject = 'node test.js --subject --noun'.split(' ')
        , argv = electron.argv(subject);
      argv.modes.should.be.an('array');
      argv.modes.should.have.length(2);
      argv.modes.should.include('subject', 'noun');
    });

    it('can parse short form combined modes', function () {
      var subject = 'node test.js -sn'.split(' ')
        , argv = electron.argv(subject);
      argv.modes.should.be.an('array');
      argv.modes.should.have.length(2);
      argv.modes.should.include('s', 'n');
    });

    it('can parse short form seperate modes', function () {
      var subject = 'node test.js -s -n'.split(' ')
        , argv = electron.argv(subject);
      argv.modes.should.be.an('array');
      argv.modes.should.have.length(2);
      argv.modes.should.include('s', 'n');
    });

    it('can use the #mode helper', function () {
      var subject = 'node test.js --subject -n'.split(' ')
        , argv = electron.argv(subject);

      argv.modes.should.be.an('array');
      argv.modes.should.have.length(2);
      argv.modes.should.include('subject', 'n');

      argv.should.respondTo('mode');
      argv.mode('subject', 's').should.be.true;
      argv.mode('noun', 'n').should.be.true;
      argv.mode('verb', 'v').should.be.false;
    });
  });

  describe('params', function () {
    it('can parse long form `=` params', function () {
      var subject = 'node test.js --hello=universe'.split(' ')
        , argv = electron.argv(subject);
      argv.params.should.be.an('object');
      argv.params.should.have.keys('hello');
      argv.params.should.have.property('hello', 'universe');
    });

    it('can parse long form spaced params', function () {
      var subject = 'node test.js --hello universe'.split(' ')
        , argv = electron.argv(subject);
      argv.params.should.be.an('object');
      argv.params.should.have.keys('hello');
      argv.params.should.have.property('hello', 'universe');
    });

    it('can parse short form `=` params', function () {
      var subject = 'node test.js -h=universe'.split(' ')
        , argv = electron.argv(subject);
      argv.params.should.be.an('object');
      argv.params.should.have.keys('h');
      argv.params.should.have.property('h', 'universe');
    });

    it('can parse short form spaced params', function () {
      var subject = 'node test.js -h universe'.split(' ')
        , argv = electron.argv(subject);
      argv.params.should.be.an('object');
      argv.params.should.have.keys('h');
      argv.params.should.have.property('h', 'universe');
    });

    it('can use the #param helper', function () {
      var subject = 'node test.js --subject hello -n universe --verb=say -a=hi'.split(' ')
        , argv = electron.argv(subject);
      argv.params.should.be.an('object');
      argv.params.should.have.keys('subject', 'n', 'verb', 'a');

      argv.should.respondTo('param');
      argv.param('subject', 's').should.equal('hello');
      argv.param('noun', 'n').should.equal('universe');
      argv.param('verb', 'v').should.equal('say');
      argv.param('action', 'a').should.equal('hi');
      should.not.exist(argv.param('bye', 'b'));
    });

    it('can parse a multiword string', function () {
      var subject = 'node test.js --subject "hello universe" -h "are you"'.split(' ')
        , argv = electron.argv(subject);

      argv.params.should.be.an('object');
      argv.params.should.have.keys('subject', 'h');

      argv.should.respondTo('param');
      argv.param('subject').should.equal('hello universe');
      argv.param('h').should.equal('are you');
    });
  });

  describe('commands', function () {
    it('can parse single commands', function () {
      var subject = 'node test.js hello'.split(' ')
        , argv = electron.argv(subject);
      argv.commands.should.be.an('array');
      argv.commands.should.have.length(1);
      argv.commands.should.include('hello');
    });

    it('can parse multiple commands', function () {
      var subject = 'node test.js one two'.split(' ')
        , argv = electron.argv(subject);
      argv.commands.should.be.an('array');
      argv.commands.should.have.length(2);
      argv.commands.should.include('one', 'two');
    });

    it('can user the #command helper', function () {
      var subject = 'node test.js o two'.split(' ')
        , argv = electron.argv(subject);
      argv.commands.should.be.an('array');
      argv.commands.should.have.length(2);
      argv.commands.should.include('o', 'two');

      argv.should.respondTo('command');
      argv.command('one', 'o').should.be.true;
      argv.command('two', 't').should.be.true;
      argv.command('four', 'f').should.be.false;
    });
  });

  describe('mixed', function () {
    it('can parse sane mixed set of args', function () {
      var subject = 'node test.js command subcommand -rgb --hello universe --say=goodday'.split(' ')
        , argv = electron.argv(subject);

      argv._raw.should.be.an('array')
        .and.deep.equal(subject);

      argv.mode('r').should.be.true;
      argv.mode('g').should.be.true;
      argv.mode('b').should.be.true;

      argv.param('hello').should.equal('universe');
      argv.param('say').should.equal('goodday');

      argv.command('command').should.be.true;
      argv.command('subcommand').should.be.true;

      argv.modes.should.be.an('array')
        .and.include('r', 'g', 'b');
      argv.commands.should.be.an('array')
        .and.include('command', 'subcommand');
      argv.params.should.be.an('object')
        .and.deep.equal({ hello: 'universe', say: 'goodday' });

    });

    it('can parse unsane mixed set of args', function () {
      var subject = 'node test.js -rgb command --hello universe subcommand --say=goodday'.split(' ')
        , argv = electron.argv(subject);

      argv._raw.should.be.an('array')
        .and.deep.equal(subject);

      argv.mode('r').should.be.true;
      argv.mode('g').should.be.true;
      argv.mode('b').should.be.true;

      argv.param('hello').should.equal('universe');
      argv.param('say').should.equal('goodday');

      argv.command('command').should.be.true;
      argv.command('subcommand').should.be.true;

      argv.modes.should.be.an('array')
        .and.include('r', 'g', 'b');
      argv.commands.should.be.an('array')
        .and.include('command', 'subcommand');
      argv.params.should.be.an('object')
        .and.deep.equal({ hello: 'universe', say: 'goodday' });
    });
  });
});
