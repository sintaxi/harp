var should      = require("should")
var superagent  = require('superagent')
var path        = require("path")
var fs          = require("fs")
var exec        = require("child_process").exec
var harp        = require("../")

describe("basic", function(){
  var projectPath = path.join(__dirname, "apps/plain")
  var outputPath  = path.join(__dirname, "out/plain")

  var config;

  before(function(done){
    harp.compile(projectPath, outputPath, function(errors, output){
      config = output
      harp.server(projectPath, { port: 8102 }, done)
    })
  })

  it("should have node version in config", function(done){
    config.should.have.property("harp_version")
    done()
  })

  after(function(done){
    exec("rm -rf " + outputPath, function(){
      done()
    })
  })

})
