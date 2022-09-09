var should      = require("should")
var axios       = require('axios')
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
    var server;

    before(function(done){
      harp.compile(projectPath, outputPath, function(errors, output){
        config = output.config
        server = harp.server(projectPath).listen(8102, done)
      })
    })

    it("should have harp version in config", function(done){
      config.should.have.property("harp_version")
      done()
    })

    it("should serve index file", function(done){
      fs.readFile(path.join(outputPath, "index.html"), function(err, contents){
        axios.get('http://localhost:8102/').then(function(r){
          r.status.should.eql(200)
          r.data.should.eql(contents.toString())
          done()
        })
      })
    })

    it("should serve text file", function(done){
      fs.readFile(path.join(outputPath, "hello.txt"), function(err, contents){
        contents.toString().should.eql("text files are wonderful")
        axios.get('http://localhost:8102/hello.txt').then(function(r){
          r.status.should.eql(200)
          r.data.should.eql(contents.toString())
          done()
        })
      })
    })

    it("should have custom 404 page that is raw HTML", function(done){
      fs.readFile(path.join(outputPath, "404.html"), function(err, contents){
        axios.get('http://localhost:8102/404.html').then(function(r){
          r.status.should.eql(200)
          r.data.should.eql(contents.toString())
          axios.get('http://localhost:8102/missing/path').catch(function(e){
            e.response.status.should.eql(404)
            e.response.data.should.eql(contents.toString())
            done()
          })
        })
      })
    })

    after(function(done){
      server.close(done)
    })

  })

  describe("root-style", function(){
    var projectPath = path.join(__dirname, "apps/plain/root-style")
    var outputPath  = path.join(__dirname, "out/plain/root-style")
    var config;
    var server;

    before(function(done){
      harp.compile(projectPath, outputPath, function(errors, output){
        config = output.config
        server = harp.server(projectPath).listen(8103, done)
      })
    })

    it("should have harp version in config", function(done){
      config.should.have.property("harp_version")
      done()
    })

    it("should serve index file", function(done){
      fs.readFile(path.join(outputPath, "index.html"), function(err, contents){
        axios.get('http://localhost:8103/').then(function(r){
          r.status.should.eql(200)
          r.data.should.eql(contents.toString())
          done()
        })
      })
    })

    it("should serve text file", function(done){
      fs.readFile(path.join(outputPath, "hello.txt"), function(err, contents){
        contents.toString().should.eql("text files are wonderful")
        axios.get('http://localhost:8103/hello.txt').then(function(r){
          r.status.should.eql(200)
          r.data.should.eql(contents.toString())
          done()
        })
      })
    })

    it("should have custom 404 page that is raw HTML", function(done){
      fs.readFile(path.join(outputPath, "404.html"), function(err, contents){
        axios.get('http://localhost:8103/404.html').then(function(r){
          r.status.should.eql(200)
          r.data.should.eql(contents.toString())
          axios.get('http://localhost:8103/missing/path').catch(function(e){
            e.response.status.should.eql(404)
            e.response.data.should.eql(contents.toString())
            done()
          })
        })
      })
    })

    after(function(done){
      server.close(done)
    })

  })

  after(function(done){
    exec("rm -rf " + output, function(){
      done()
    })
  })

})
