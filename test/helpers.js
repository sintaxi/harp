var should = require("should")
var helpers = require("../lib/helpers")

describe("helpers", function(){

  describe("willCollide(projectPath, outputPath)", function(){
    it("should collide if output path is /", function(done){
      helpers.willCollide("/foo/bar/myproject", "/").should.be.true
      done()
    })

    it("should not collide if output path is /output", function(done){
      helpers.willCollide("/foo/bar/myproject", "/output").should.be.false
      done()
    })
  })

})