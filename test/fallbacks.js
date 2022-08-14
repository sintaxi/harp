var should      = require("should")
var axios       = require('axios')
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
      axios.get('http://localhost:'+ port +'/some/fallback/path').then(function(r){
        r.status.should.eql(200)
        r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
        done()
      })
    })

    it("should have custom 200 page", function(done){
      fs.readFile(path.join(outputPath, "200.html"), function(err, contents){
        should.not.exist(err)
        axios.get('http://localhost:'+ port +'/some/missing/path').then(function(r){
          r.status.should.eql(200)
          r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
          r.data.should.eql(contents.toString())
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
      axios.get('http://localhost:'+ port +'/some/fallback/path').then(function(r){
        r.status.should.eql(200)
        r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
        done()
      })
    })

    it("should have custom 200 page", function(done){
      fs.readFile(path.join(outputPath, "200.html"), function(err, contents){
        should.not.exist(err)
        axios.get('http://localhost:'+ port +'/some/missing/path').then(function(r){
          r.status.should.eql(200)
          r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
          r.data.should.eql(contents.toString())
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
      axios.get('http://localhost:'+ port +'/some/fallback/path').catch(function(e){
        e.response.status.should.eql(404)
        e.response.headers.should.have.property("content-type", "text/html; charset=UTF-8")
        done()
      })
    })

    it("should have fallback 404 page", function(done){
      axios.get('http://localhost:'+ port +'/some/missing/path').catch(function(e){
        e.response.status.should.eql(404)
        e.response.headers.should.have.property("content-type", "text/html; charset=UTF-8")
        done()
      })
    })

    it("should return custom 200 page on nested path", function(done){
      fs.readFile(path.join(outputPath, "app/200.html"), function(err, contents){
        should.not.exist(err)
        axios.get('http://localhost:'+ port +'/app/missing/path').then(function(r){
          r.status.should.eql(200)
          r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
          r.data.should.eql(contents.toString())
          done()
        })
      })
    })

    it("should return 200 on /app/", function(done){
      fs.readFile(path.join(outputPath, "app/200.html"), function(err, contents){
        should.not.exist(err)
        axios.get('http://localhost:'+ port +'/app/').then(function(r){
          r.status.should.eql(200)
          r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
          r.data.should.eql(contents.toString())
          done()
        })
      })
    })

    it("should return 301 on /app to redirect to /app/", function(done){
      axios.get('http://localhost:'+ port +'/app', { maxRedirects: 0 }).catch(function(e){
        e.response.status.should.eql(301)
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