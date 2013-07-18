var should = require("should")
var helpers = require("../lib/helpers")

describe("helpers", function(){

  describe("willCollide(projectPath, outputPath)", function(){
    it("should collide if output path is /", function(done){
      helpers.willCollide("/", "/").should.be.true
      helpers.willCollide("/foo/bar/myproject", "/").should.be.true
      helpers.willCollide("/foo/bar/myproject/", "/").should.be.true
      done()
    })

    it("should not collide if output path is /output", function(done){
      helpers.willCollide("/foo/bar/myproject", "/output").should.be.false
      helpers.willCollide("/foo/bar/myproject", "/output/").should.be.false
      helpers.willCollide("/foo/bar/myproject/", "/output/").should.be.false
      helpers.willCollide("/foo/bar/myproject/", "/output").should.be.false
      done()
    })

    it("should not collide if output path is in projectPath", function(done){
      helpers.willCollide("/foo/bar/myproject", "/foo/bar/myproject/www").should.be.false
      helpers.willCollide("/foo/bar/myproject/", "/foo/bar/myproject/www").should.be.false
      helpers.willCollide("/foo/bar/myproject", "/foo/bar/myproject/www/").should.be.false
      helpers.willCollide("/foo/bar/myproject/", "/foo/bar/myproject/www/").should.be.false
      done()
    })

    it("should not collide if project path is one back and begins with underscore", function(done){
      helpers.willCollide("/foo/bar/myproject", "/foo/bar").should.be.true
      done()
    })
  })

})