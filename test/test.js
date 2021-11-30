var assert = require('assert');
const data = require("../data")

describe('test logout', function() {
  it('Should set global variable to empty string', function() {
    const loggedIn = data.isLoggedIn();
    assert.equal(loggedIn, false);
  })
})

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});