var should      = require("should")
var harp = require('../lib');
var middleware = require('../lib/middleware');

describe("harp as a library", function() {

  it("should expose a mount function", function() {
    should(harp.mount).be.type('function');
  });

  it("should expose the middleware", function() {
    should(harp.middleware).be.equal(middleware);
  });

});
