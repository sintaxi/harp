var should = require("should")
var path   = require("path")
var fs     = require("fs")
var exec   = require("child_process").exec
var harp   = require("../")

describe("basic", function(){
  var projectPath = path.join(__dirname, "apps/basic")
  var outputPath  = path.join(__dirname, "out/basic")
    
  before(function(done){
    harp.compile(projectPath, outputPath, function(){
      harp.server(projectPath, { port: 8100 }, function(){
        done()
      })
    })
  })  
  
  it("should have global vars", function(done){
    var globals = require(path.join(outputPath, "globals.json"))
    globals.should.have.property("environment", "production")
    globals.should.have.property("public")
    done()
  })
  
  it("should have current vars", function(done){
    var globals = require(path.join(outputPath, "current.json"))
    globals.should.have.property("path")
    globals.should.have.property("source")
    done()
  })
  
  after(function(done){
    exec("rm -rf " + outputPath, function(){
      done()
    })
  })
  
})
