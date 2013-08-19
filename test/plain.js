var should      = require("should")
var superagent  = require('superagent')
var path        = require("path")
var fs          = require("fs")
var exec        = require("child_process").exec
var harp        = require("../")

describe("plain", function(){
  var output = path.join(__dirname, "out/plain")

  describe("framework-style", function(){
    var projectPath = path.join(__dirname, "apps/plain/framework-style")
    var outputPath  = path.join(__dirname, "out/plain/framework-style")

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

    it("should serve index file", function(done){
      fs.readFile(path.join(outputPath, "index.html"), function(err, contents){
        var agent = superagent.agent()
        agent.get('http://localhost:8102/').end(function(err, rsp){
          rsp.should.have.status(200)
          rsp.text.should.eql(contents.toString())
          done()
        })
      })
    })

    it("should serve text file", function(done){
      fs.readFile(path.join(outputPath, "hello.txt"), function(err, contents){
        var agent = superagent.agent()
        contents.toString().should.eql("text files are wonderful")
        agent.get('http://localhost:8102/hello.txt').end(function(err, rsp){
          rsp.should.have.status(200)
          rsp.text.should.eql(contents.toString())
          done()
        })
      })
    })

    it("should have custom 404 page that is raw HTML", function(done){
      fs.readFile(path.join(outputPath, "404.html"), function(err, contents){
        var agent = superagent.agent()
        agent.get('http://localhost:8102/404.html').end(function(err, rsp){
          rsp.should.have.status(200)
          rsp.text.should.eql(contents.toString())
          var agent = superagent.agent()
          agent.get('http://localhost:8102/missing/path').end(function(err, rsp){
            rsp.should.have.status(404)
            rsp.text.should.eql(contents.toString())
            done()
          })
        })
      })
    })

  })

  describe("root-style", function(){
    var projectPath = path.join(__dirname, "apps/plain/root-style")
    var outputPath  = path.join(__dirname, "out/plain/root-style")

    var config;

    before(function(done){
      harp.compile(projectPath, outputPath, function(errors, output){
        config = output
        harp.server(projectPath, { port: 8103 }, done)
      })
    })

    it("should have node version in config", function(done){
      config.should.have.property("harp_version")
      done()
    })

    it("should serve index file", function(done){
      fs.readFile(path.join(outputPath, "index.html"), function(err, contents){
        var agent = superagent.agent()
        agent.get('http://localhost:8103/').end(function(err, rsp){
          rsp.should.have.status(200)
          rsp.text.should.eql(contents.toString())
          done()
        })
      })
    })

    it("should serve text file", function(done){
      fs.readFile(path.join(outputPath, "hello.txt"), function(err, contents){
        var agent = superagent.agent()
        contents.toString().should.eql("text files are wonderful")
        agent.get('http://localhost:8103/hello.txt').end(function(err, rsp){
          rsp.should.have.status(200)
          rsp.text.should.eql(contents.toString())
          done()
        })
      })
    })

    it("should have custom 404 page that is raw HTML", function(done){
      fs.readFile(path.join(outputPath, "404.html"), function(err, contents){
        var agent = superagent.agent()
        agent.get('http://localhost:8103/404.html').end(function(err, rsp){
          rsp.should.have.status(200)
          rsp.text.should.eql(contents.toString())
          var agent = superagent.agent()
          agent.get('http://localhost:8103/missing/path').end(function(err, rsp){
            rsp.should.have.status(404)
            rsp.text.should.eql(contents.toString())
            done()
          })
        })
      })
    })

  })

  after(function(done){
    exec("rm -rf " + output, function(){
      done()
    })
  })

})
