/*!
 * Attach chai to global should
 */

global.chai = require('chai');
global.should = global.chai.should();

/*!
 * Chai Plugins
 */

global.chai.use(require('chai-spies'));
//global.chai.use(require('chai-http'));

/*!
 * Import project
 */

global.electron = require('../..');

/*!
 * Helper to load internals for cov unit tests
 */

function req (name) {
  return process.env.apollo_COV
    ? require('../../lib-cov/electron/' + name)
    : require('../../lib/electron/' + name);
}

/*!
 * Load unexposed modules for unit tests
 */

global.__electron = {
    Args: req('args')
  , Command: req('command')
  , Program: req('program')
};
