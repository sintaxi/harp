var should      = require("should")
var axios       = require('axios')
var path        = require("path")
var fs          = require("fs")
var exec        = require("child_process").exec
var harp        = require("../")

describe("errors", function(){

  describe("err-invalid-config", function(){
    var projectPath = path.join(__dirname, "apps/err-invalid-config")
    var outputPath  = path.join(__dirname, "out/err-invalid-config")
    var port        = 8111
    var server;

    before(function(done){
      server = harp.server(projectPath).listen(port, done)
    })

    it("should get error message for invalid harp.json", function(done){
      axios.get('http://localhost:'+ port +'/').catch(function(e){
        e.response.status.should.eql(500)
        e.response.data.should.include(harp.pkg.version)
        harp.compile(projectPath, outputPath, function(error){
          should.exist(error)
          error.should.have.property("source")
          error.should.have.property("dest")
          error.should.have.property("filename")
          error.should.have.property("message")
          error.should.have.property("stack")
          error.should.have.property("lineno")
          done()
        })
      })
    })

    after(function(done){
      server.close(done)
    })
  })

  describe("err-invalid-data", function(){
    var projectPath = path.join(__dirname, "apps/err-invalid-data")
    var outputPath  = path.join(__dirname, "out/err-invalid-data")
    var port        = 8112
    var server;

    before(function(done){
      server = harp.server(projectPath).listen(port, done)
    })

    it("should get error message for invalid _data.json", function(done){
      axios.get('http://localhost:'+ port +'/').catch(function(e){
        e.response.status.should.eql(500)
        e.response.data.should.include(harp.pkg.version)
        harp.compile(projectPath, outputPath, function(error){
          should.exist(error)
          error.should.have.property("source")
          error.should.have.property("dest")
          error.should.have.property("filename")
          error.should.have.property("message")
          error.should.have.property("stack")
          error.should.have.property("lineno")
          done()
        })
      })
    })

    after(function(done){
      server.close(done)
    })
  })

  describe("err-missing-public", function(){
    var projectPath = path.join(__dirname, "apps/err-missing-public")
    var outputPath  = path.join(__dirname, "out/err-missing-public")
    var port        = 8113
    var server;

    before(function(done){
      server = harp.server(projectPath).listen(port, done)
    })

    it("should get error message for invalid _data.json", function(done){
      axios.get('http://localhost:'+ port +'/').catch(function(e){
        e.response.status.should.eql(500)
        e.response.data.should.include(harp.pkg.version)
        harp.compile(projectPath, outputPath, function(error){
          should.exist(error)
          error.should.have.property("source")
          error.should.have.property("dest")
          error.should.have.property("filename")
          error.should.have.property("message")
          error.should.have.property("stack")
          error.should.have.property("lineno")
          done()
        })
      })
    })

    after(function(done){
      server.close(done)
    })
  })

  describe("err-missing-public", function(){
    var projectPath = path.join(__dirname, "apps/err-missing-404")
    var outputPath  = path.join(__dirname, "out/err-missing-404")
    var port        = 8114
    var server;

    before(function(done){
      server = harp.server(projectPath).listen(port, done)
    })

    it("should return proper mime type on 404 page", function(done){
      axios.get('http://localhost:'+ port +'/some/missing/path.css').catch(function(e){
        e.response.status.should.eql(404)
        e.response.data.should.include(harp.pkg.version)
        e.response.headers.should.have.property("content-type", "text/html; charset=UTF-8")
        done()
      })
    })

    after(function(done){
      server.close(done)
    })
  })

  after(function(done){
    exec("rm -rf " + path.join(__dirname, "out"), function(){
      done()
    })
  })

})
