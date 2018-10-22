var should      = require("should")
var request     = require('request')
var path        = require("path")
var fs          = require("fs")
var exec        = require("child_process").exec
var harp        = require("../");

describe("cjs", function(){

  describe("basic root project", function(){
    var projectPath = path.join(__dirname, "apps/cjs/root")
    var outputPath  = path.join(__dirname, "out/cjs-root")

    it("should compile", function(done){
      harp.compile(projectPath, outputPath, function(error){
        should.not.exist(error)
        done()
      })
    })

    it("compile should not include bundle.cjs", function(done) {

      var rsp = fs.existsSync(path.join(outputPath, "/bundle.cjs"))
      rsp.should.be.false

      var rsp = fs.existsSync(path.join(outputPath, "/bundle.js"))
      rsp.should.be.true

      done()

    })

    after(function(done){
      exec("rm -rf " + outputPath, function() {
        done();
      })
    })

  })

  describe("basic framework project", function(){
    var projectPath = path.join(__dirname, "apps/cjs/framework")
    var outputPath  = path.join(__dirname, "out/cjs-framework")

    it("should compile", function(done){
      harp.compile(projectPath, outputPath, function(error){
        should.not.exist(error)
        done()
      })
    })

    it("compile should not include bundle.cjs", function(done) {

      var rsp = fs.existsSync(path.join(outputPath, "/bundle.cjs"))
      rsp.should.be.false

      var rsp = fs.existsSync(path.join(outputPath, "/bundle.js"))
      rsp.should.be.true

      done()

    })

    after(function(done){
      exec("rm -rf " + outputPath, function() {
        done();
      })
    })

  })


})
