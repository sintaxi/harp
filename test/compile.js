var should      = require("should")
var request     = require('request')
var path        = require("path")
var fs          = require("fs")
var exec        = require("child_process").exec
var harp        = require("../");

describe("compile", function(){

  describe("basic app", function(){
    var projectPath = path.join(__dirname, "apps/compile/basic")
    var outputPath  = path.join(__dirname, "out/compile-basic")

    it("should compile", function(done){
      harp.compile(projectPath, outputPath, function(error){
        should.not.exist(error)
        done()
      })
    })

    it("compile should not include folders named with underscores", function(done) {
      var cssOutputPath = path.join(outputPath, "/css")

      var rsp = fs.existsSync(path.join(cssOutputPath, "/_partials/some.css"))
      rsp.should.be.false

      var rsp = fs.existsSync(path.join(cssOutputPath, "/_partials/_more.css"))
      rsp.should.be.false

      done()

    })

    it("compile should not include files named with underscores", function(done) {
      var cssOutputPath = path.join(outputPath, "/css")

      var rsp = fs.existsSync(path.join(cssOutputPath, "/one/two/three/_four.css"))
      rsp.should.be.false

      var rsp = fs.existsSync(path.join(cssOutputPath, "/one/two/three/_five.css"))
      rsp.should.be.false

      var rsp = fs.existsSync(path.join(cssOutputPath, "/_nav.css"))
      rsp.should.be.false

      done()
    })

    after(function(done){
      exec("rm -rf " + outputPath, function() {
        done();
      })
    })

  })

  describe("root app with .git dir", function(){
    var projectPath = path.join(__dirname, "apps","compile","root")
    var outputPath  = path.join(__dirname, "out","compile-root")
    var gitPath = path.join(projectPath, ".git")

    // Make at runtime since git refuses to store .git dirs
    if (!fs.existsSync(gitPath)) {
      fs.mkdirSync(gitPath);
      fs.openSync(path.join(gitPath, "foo"), 'a')
    }


    it("should compile", function(done){
      harp.compile(projectPath, outputPath, function(error){
        should.not.exist(error)
        done()
      })
    })

    it("should not include .git in output", function(done) {
      var rsp = fs.existsSync(path.join(projectPath, ".git", "foo"))
      rsp.should.be.true

      var rsp = fs.existsSync(path.join(outputPath, ".git"))
      rsp.should.be.false

      done()
    })

    after(function(done){
      exec("rm -rf " + outputPath + " " + gitPath, function() {
        done();
      })
    })

  })

  describe("root app with output dir containing .git in project dir", function(){
    var projectPath = path.join(__dirname, "apps","compile","root")
    var outputPath  = path.join(projectPath, "out")
    var gitPath = path.join(outputPath, ".git")

    // Making this at runtime since git refuses to store .git dirs
    if (!fs.existsSync(gitPath)) {
      fs.mkdirSync(outputPath);
      fs.mkdirSync(gitPath);
      fs.openSync(path.join(gitPath, "foo"), 'a')
    }


    it("should compile", function(done){
      harp.compile(projectPath, outputPath, function(error){
        should.not.exist(error)
        done()
      })
    })

    it("should not include a copy of the output subpath in output", function(done) {
      var rsp = fs.existsSync(path.join(outputPath, "out"))
      rsp.should.be.false

      done();
    })

    after(function(done){
      exec("rm -rf " + outputPath, function() {
        done();
      })
    })
  })

})
