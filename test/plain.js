var should      = require("should")
var superagent  = require('superagent')
var path        = require("path")
var fs          = require("fs")
var exec        = require("child_process").exec
var harp        = require("../")

describe("plain", function(){
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

  it("should have custom 404 page that is raw HTML", function(done){
    fs.readFile(path.join(outputPath, "404.html"), function(err, contents){
      var agent = superagent.agent()
      agent.get('http://localhost:8102/404.html').end(function(err, rsp){
        rsp.should.have.status(200)
        rsp.text.should.eql(contents.toString())
        agent.get('http://localhost:8102/missing/path').end(function(err, rsp){
          rsp.should.have.status(404)
          rsp.text.should.eql(contents.toString())
          done()
        })
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
