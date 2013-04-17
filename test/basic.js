var should      = require("should")
var superagent  = require('superagent')
var path        = require("path")
var fs          = require("fs")
var exec        = require("child_process").exec
var harp        = require("../")

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
    var staticGlobals = require(path.join(outputPath, "globals.json"))
    staticGlobals.should.have.property("environment", "production")
    staticGlobals.should.have.property("public")
    var agent = superagent.agent()
    agent.get('http://localhost:8100/globals.json').end(function(err, rsp){
      rsp.should.have.status(200)
      var dynamicGlobals = JSON.parse(rsp.text)
      dynamicGlobals.should.have.property("environment", "development")
      dynamicGlobals.should.have.property("public")
      done()
    })
  })

  it("should have current vars", function(done){
    var staticCurrent = require(path.join(outputPath, "current.json"))
    staticCurrent.should.have.property("path")
    staticCurrent.should.have.property("source", "current")
    var agent = superagent.agent()
    agent.get('http://localhost:8100/current.json').end(function(err, rsp){
      rsp.should.have.status(200)
      var dynamicCurrent = JSON.parse(rsp.text)
      dynamicCurrent.should.have.property("path")
      dynamicCurrent.should.have.property("source", "current")
      done()
    })
  })

  it("should have index file that uses the layout", function(done){
    fs.readFile(path.join(outputPath, "index.html"), function(err, contents){
      contents.toString().should.include("Kitchen Sink")
      contents.toString().should.include("Home")
      var agent = superagent.agent()
      agent.get('http://localhost:8100/').end(function(err, rsp){
        rsp.should.have.status(200)
        rsp.text.should.include("Kitchen Sink")
        rsp.text.should.include("Home")
        done()
      })
    })
  })

  it("should have 404 page that does not use layout", function(done){
    fs.readFile(path.join(outputPath, "404.html"), function(err, contents){
      contents.toString().should.not.include("Kitchen Sink")
      contents.toString().should.include("404")
      console.log(contents.toString())
      var agent = superagent.agent()
      agent.get('http://localhost:8100/some-missing-path').end(function(err, rsp){
        rsp.should.have.status(404)
        rsp.text.should.not.include("Kitchen Sink")
        rsp.text.should.include("404")
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
