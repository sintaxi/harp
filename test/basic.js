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
    var current = require(path.join(outputPath, "current.json"))
    current.should.have.property("path")
    current.should.have.property("source")
    done()
  })
  
  it("should have index file that uses the layout", function(done){
    var index = fs.readFile(path.join(outputPath, "index.html"), function(err, contents){
      contents.toString().should.include("MyHarpApp")
      contents.toString().should.include("Home")
      done()
    })
  })
  
  it("should have 404 page that does not use layout", function(done){
    var index = fs.readFile(path.join(outputPath, "404.html"), function(err, contents){
      contents.toString().should.not.include("MyHarpApp")
      contents.toString().should.include("My404Page")
      done()
    })
  })
  
  after(function(done){
    exec("rm -rf " + outputPath, function(){
      done()
    })
  })
  
})
