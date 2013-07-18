var should  = require("should")
var helpers = require("../lib/helpers")
var fse     = require("fs-extra")
var path    = require("path")

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
      helpers.willCollide("/foo/bar/myproject/", "/foo/bar/").should.be.true
      helpers.willCollide("/foo/bar/myproject", "/foo/bar/").should.be.true
      helpers.willCollide("/foo/bar/myproject/", "/foo/bar").should.be.true
      done()
    })
  })

  describe("willAllow(projectPath, outputPath)", function(){
    it("should not allow project to compile one directory back if source not starting with underscore", function(done){
      helpers.willAllow("/foo/bar/myproject", "/foo/bar").should.be.false
      helpers.willAllow("/foo/bar/myproject/", "/foo/bar/").should.be.false
      helpers.willAllow("/foo/bar/myproject", "/foo/bar/").should.be.false
      helpers.willAllow("/foo/bar/myproject/", "/foo/bar").should.be.false
      done()
    })

    it("should allow project to compile one directory back if source directory starts with underscore", function(done){
      helpers.willAllow("/foo/bar/_myproject", "/foo/bar").should.be.true
      helpers.willAllow("/foo/bar/_myproject/", "/foo/bar/").should.be.true
      helpers.willAllow("/foo/bar/_myproject", "/foo/bar/").should.be.true
      helpers.willAllow("/foo/bar/_myproject/", "/foo/bar").should.be.true
      done()
    })

    it("should not allow project to compile one directory back if source directory starts with underscore", function(done){
      helpers.willAllow("/foo/bar/_myproject", "/foo").should.be.false
      helpers.willAllow("/foo/_bar/myproject", "/foo").should.be.false
      helpers.willAllow("/foo/_bar/_myproject", "/foo").should.be.false
      done()
    })
  })

  describe("prime(outputPath)", function(){
    before(function(done){
      fse.mkdirp(path.join(__dirname, "temp"), done)
    })

    before(function(done){
      fse.mkdirSync(path.join(__dirname, "temp", "myproj"))
      fse.mkdirSync(path.join(__dirname, "temp", "foo"))
      fse.writeFileSync(path.join(__dirname, "temp", "bar"), "hello bar")
      done()
    })

    it("should only remove directories that do not begin with underscore", function(done){
      helpers.prime(path.join(__dirname, "temp"), { ignore: "myproj" }, function(error){
        fse.existsSync(path.join(__dirname, "temp", "myproj")).should.be.true
        fse.existsSync(path.join(__dirname, "temp", "foo")).should.be.false
        fse.existsSync(path.join(__dirname, "temp", "bar")).should.be.false
        done()
      })
    })

    after(function(done){
      fse.remove(path.join(__dirname, "temp"), done)
    })
  })

})