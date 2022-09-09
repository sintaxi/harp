var should      = require("should")
var axios       = require('axios')
var path        = require("path")
var fs          = require("fs")
var exec        = require("child_process").exec
var harp        = require("../")

describe("basic", function(){
  var projectPath = path.join(__dirname, "apps/basic")
  var outputPath  = path.join(__dirname, "out/basic")
  var config;
  var server;

  before(function(done){
    harp.compile(projectPath, outputPath, function(errors, output){
      config = output.config
      server = harp.server(projectPath).listen(8100, done)
    })
  })

  it("should have harp version in config", function(done){
    config.should.have.property("harp_version")
    done()
  })

  it("should have global vars", function(done){
    var staticGlobals = require(path.join(outputPath, "globals.json"))
    staticGlobals.should.have.property("environment", "production")
    staticGlobals.should.have.property("public")
    axios.get('http://localhost:8100/globals.json').then(function(r){
      r.status.should.eql(200)
      r.data.should.have.property("environment", "development")
      r.data.should.have.property("public")
      done()
    })
  })

  it("should have current vars", function(done){
    var staticCurrent = require(path.join(outputPath, "current.json"))
    staticCurrent.should.have.property("path")
    staticCurrent.should.have.property("source", "current.json")
    axios.get('http://localhost:8100/current.json').then(function(r){
      r.status.should.eql(200)
      r.data.should.have.property("path")
      r.data.should.have.property("source", "current.json")
      done()
    })
  })

  it("should have index file that uses the layout", function(done){
    fs.readFile(path.join(outputPath, "index.html"), function(err, contents){
      contents.toString().should.include("Kitchen Sink")
      contents.toString().should.include("Home")
      axios.get('http://localhost:8100/').then(function(r){
        r.status.should.eql(200)
        r.data.should.include("Kitchen Sink")
        r.data.should.include("Home")
        done()
      })
    })
  })

  it("should have custom 404 page that does not use layout", function(done){
    fs.readFile(path.join(outputPath, "404.html"), function(err, contents){
      contents.toString().should.not.include("Kitchen Sink")
      contents.toString().should.include("Custom, Page Not Found")
      axios.get('http://localhost:8100/some/missing/path').catch(function(e){
        e.response.status.should.eql(404)
        e.response.headers.should.have.property("content-type", "text/html; charset=UTF-8")
        e.response.data.should.not.include("Kitchen Sink")
        e.response.data.should.include("Custom, Page Not Found")
        e.response.data.should.eql(contents.toString())
        done()
      })
    })
  })

  it("should return CSS file", function(done){
    fs.readFile(path.join(outputPath, "css", "main.css"), function(err, contents){
      contents.toString().should.include("background")
      axios.get('http://localhost:8100/css/main.css').then(function(r){
        r.status.should.eql(200)
        r.data.should.include("background")
        r.data.should.eql(contents.toString())
        done()
      })
    })
  })

  it("should return proper mime type on 404 page", function(done){
    axios.get('http://localhost:8100/some/missing/path.css').catch(function(e){
      e.response.status.should.eql(404)
      e.response.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      done()
    })
  })

  it("should render HTML page without requiring extension", function(done){
    fs.readFile(path.join(outputPath, "basic.html"), function(err, contents){
      contents.toString().should.not.include("Kitchen Sink")
      contents.toString().should.include("<h1>Basic HTML Page</h1>")
      axios.get('http://localhost:8100/basic').then(function(r){
        r.status.should.eql(200)
        r.data.should.not.include("Kitchen Sink")
        r.data.should.include("<h1>Basic HTML Page</h1>")
        r.data.should.eql(contents.toString())
        done()
      })
    })
  })

  it("should not return file starting with underscore", function(done){
    axios.get('http://localhost:8100/shared/_nav.jade').catch(function(e){
      e.response.status.should.eql(404)
      done()
    })
  })

  it("should render HTML page with spaces in the file name", function(done){
    axios.get('http://localhost:8100/articles/with%20spaces').then(function(r){
      r.status.should.eql(200)
      r.data.should.include("foo article")
      done()
    })
  })

  after(function(done){
    exec("rm -rf " + outputPath, function(){
      server.close(done)
    })
  })

})
