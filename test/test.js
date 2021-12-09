var assert = require('assert');
const data = require("../data")

describe('test logout', function() {
  it('Should set global variable to empty string', function() {
    const loggedIn = data.isLoggedIn();
    // Har sat loggedIn skal være med lige false
    assert.equal(loggedIn, false);
  }) 
})