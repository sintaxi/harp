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
      done()
    })
  })
  
  it("should have global vars", function(done){
    var index   = fs.readFileSync(path.join(outputPath, "index.html"))
    var globals = JSON.parse(index)
    globals.should.have.property("environment", "production")
    globals.should.have.property("public")
    done()
  })
  
  after(function(done){
    exec("rm -rf " + outputPath, function(){
      done()
    })
  })
  
})
