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

    it("compile should not include files named with underscores", function(done) {
      var cssOutputPath = path.join(outputPath, "public/css")
      fs.readFile(path.join(cssOutputPath, "/_partials/some.css"), function(err, contents){
        should.not.exist(contents)
      })
      fs.readFile(path.join(cssOutputPath, "/_partials/_more.css"), function(err, contents){
        should.not.exist(contents)
      })
      fs.readFile(path.join(cssOutputPath, "/_nav.css"), function(err, contents){
        should.not.exist(contents)
      })
      done()
    })

  })

  after(function(done){
    exec("rm -rf " + path.join(__dirname, "out"), function(){
      done()
    })
  })

})