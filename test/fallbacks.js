var should      = require("should")
var request     = require('request')
var path        = require("path")
var fs          = require("fs")
var exec        = require("child_process").exec
var harp        = require("../")

describe("fallbacks", function(){

  describe("plain 200 file", function(){
    var projectPath = path.join(__dirname, "apps/fallbacks/two-hundy/plain")
    var outputPath  = path.join(__dirname, "out/fallbacks-two-hundy-plain")
    var port        = 8115
    var server;

    before(function(done){
      harp.compile(projectPath, outputPath, function(errors, output){
        server = harp.server(projectPath).listen(port, done)
      })
    })

    it("should return proper mime type on 200 page", function(done){
      request('http://localhost:'+ port +'/some/fallback/path', function(e,r,b){
        r.statusCode.should.eql(200)
        r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
        done()
      })
    })

    it("should have custom 200 page", function(done){
      fs.readFile(path.join(outputPath, "200.html"), function(err, contents){
        should.not.exist(err)
        request('http://localhost:'+ port +'/some/missing/path', function(e,r,b){
          r.statusCode.should.eql(200)
          r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
          b.should.eql(contents.toString())
          done()
        })
      })
    })

    after(function(done){
      server.close(done)
    })

  })

  describe("processed 200 file", function(){
    var projectPath = path.join(__dirname, "apps/fallbacks/two-hundy/processed")
    var outputPath  = path.join(__dirname, "out/fallbacks-two-hundy-processed")
    var port        = 8116
    var server;

    before(function(done){
      harp.compile(projectPath, outputPath, function(errors, output){
        server = harp.server(projectPath).listen(port, done)
      })
    })

    it("should return proper mime type on 200 page", function(done){
      request('http://localhost:'+ port +'/some/fallback/path', function(e, r, b){
        r.statusCode.should.eql(200)
        r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
        done()
      })
    })

    it("should have custom 200 page", function(done){
      fs.readFile(path.join(outputPath, "200.html"), function(err, contents){
        should.not.exist(err)
        request('http://localhost:'+ port +'/some/missing/path', function(e,r,b){
          r.statusCode.should.eql(200)
          r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
          b.should.eql(contents.toString())
          done()
        })
      })
    })

    after(function(done){
      server.close(done)
    })
  })


  describe("nested 200 file", function(){
    var projectPath = path.join(__dirname, "apps/fallbacks/two-hundy/nested")
    var outputPath  = path.join(__dirname, "out/fallbacks-two-hundy-nested")
    var port        = 8117
    var server;

    before(function(done){
      harp.compile(projectPath, outputPath, function(errors, output){
        server = harp.server(projectPath).listen(port, done)
      })
    })

    it("should return 404 on missing path", function(done){
      request('http://localhost:'+ port +'/some/fallback/path', function(e, r, b){
        r.statusCode.should.eql(404)
        r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
        done()
      })
    })

    it("should have fallback 404 page", function(done){
      request('http://localhost:'+ port +'/some/missing/path', function(e,r,b){
        r.statusCode.should.eql(404)
        r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
        done()
      })
    })

    it("should return custom 200 page on nested path", function(done){
      fs.readFile(path.join(outputPath, "app/200.html"), function(err, contents){
        should.not.exist(err)
        request('http://localhost:'+ port +'/app/missing/path', function(e,r,b){
          r.statusCode.should.eql(200)
          r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
          b.should.eql(contents.toString())
          done()
        })
      })
    })

    it("should return 200 on /app/", function(done){
      fs.readFile(path.join(outputPath, "app/200.html"), function(err, contents){
        should.not.exist(err)
        request('http://localhost:'+ port +'/app/', function(e,r,b){
          r.statusCode.should.eql(200)
          r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
          b.should.eql(contents.toString())
          done()
        })
      })
    })

    it("should return 301 on /app to redirect to /app/", function(done){
      request('http://localhost:'+ port +'/app', { followRedirect: false }, function(e,r,b){
        r.statusCode.should.eql(301)
        //r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
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