var should      = require("should")
var superagent  = require('superagent')
var path        = require("path")
var fs          = require("fs")
var exec        = require("child_process").exec
var harp        = require("../")

describe("basic", function(){
  var projectPath = path.join(__dirname, "apps/basic")
  var outputPath  = path.join(__dirname, "out/basic")

  var config;

  before(function(done){
    harp.compile(projectPath, outputPath, function(errors, output){
      config = output
      harp.server(projectPath, { port: 8100 }, done)
    })
  })

  it("should have node version in config", function(done){
    config.should.have.property("harp_version")
    done()
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

  it("should have custom 404 page that does not use layout", function(done){
    fs.readFile(path.join(outputPath, "404.html"), function(err, contents){
      contents.toString().should.not.include("Kitchen Sink")
      contents.toString().should.include("Custom, Page Not Found")
      var agent = superagent.agent()
      agent.get('http://localhost:8100/some/missing/path').end(function(err, rsp){
        rsp.should.have.status(404)
        rsp.text.should.not.include("Kitchen Sink")
        rsp.text.should.include("Custom, Page Not Found")
        rsp.text.should.eql(contents.toString())
        done()
      })
    })
  })

  it("should render HTML page without requiring extension", function(done){
    fs.readFile(path.join(outputPath, "basic.html"), function(err, contents){
      contents.toString().should.not.include("Kitchen Sink")
      contents.toString().should.include("<h1>Basic HTML Page</h1>")
      var agent = superagent.agent()
      agent.get('http://localhost:8100/basic').end(function(err, rsp){
        rsp.should.have.status(200)
        rsp.text.should.not.include("Kitchen Sink")
        rsp.text.should.include("<h1>Basic HTML Page</h1>")
        rsp.text.should.eql(contents.toString())
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
