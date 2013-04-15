var should      = require("should")
var superagent  = require('superagent')
var path        = require("path")
var fs          = require("fs")
var exec        = require("child_process").exec
var harp        = require("../")

describe("errors", function(){
  var projectPath = path.join(__dirname, "apps/err-invalid-config")
  var outputPath  = path.join(__dirname, "out/err-invalid-config")
    
  before(function(done){
    harp.server(projectPath, { port: 8101 }, function(){
      done()
    })
  })  
  
  it("should get error message for invalid harp.json", function(done){
    var agent = superagent.agent()
    agent.get('http://localhost:8101/').end(function(err, rsp){
      rsp.should.have.status(500)
      harp.compile(projectPath, outputPath, function(error){
        should.exist(error)
        done()
      })
    })
  })
  
  after(function(done){
    exec("rm -rf " + outputPath, function(){
      done()
    })
  })
  
})
