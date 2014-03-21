var should      = require("should")
var request     = require('request')
var path        = require("path")
var fs          = require("fs")
var exec        = require("child_process").exec
var harp        = require("../");

describe("compile", function(){

  describe("gh-pages app", function(){
    var projectPath = path.join(__dirname, "apps/compile/gh-pages/_harp")
    var outputPath  = path.join(__dirname, "out/compile-ghpages/")

    it("should compile", function(done){
      harp.compile(projectPath, outputPath, function(err){
        should.not.exist(err)
        done()
      })
    })

    it("should leave the CNAME file intact", function(done) {
      fs.readFile(path.join(outputPath, "CNAME"), function(err, contents){
        should.not.exist(err)
        contents.toString().should.include("webty.pe")
        done()
      })
    })
    it("should leave the README file intact", function(done) {
      fs.readFile(path.join(outputPath, "README.md"), function(err, contents){
        should.not.exist(err)
        contents.toString().should.include("# Example Harp App")
        done()
      })

    })

    after(function(done){
      exec("rm -rf " + path.join(__dirname, "out"), function(){
        done()
      })
    })


  })

})