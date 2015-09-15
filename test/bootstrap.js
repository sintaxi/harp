var should      = require("should")
var request     = require('request')
var path        = require("path")
var fs          = require("fs")
var exec        = require("child_process").exec
var harp        = require("../");

describe("bootstrap", function(){

  describe("bootstrap in public directory", function(){
    var projectPath = path.join(__dirname, "apps/bootstrap")
    var outputPath  = path.join(__dirname, "out/bootstrap")

    it("should compile without errors", function(done){
      harp.compile(projectPath, outputPath, function(error){
        should.not.exist(error)
        done()
      })
    })

    after(function(done){
      exec("rm -rf " + outputPath, function() {
        done();
      })
    })

  })

})
