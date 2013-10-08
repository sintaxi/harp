var should      = require("should")
var superagent  = require('superagent')
var path        = require('path')
var harp        = require('../')



describe("headers", function(){
  var projectPath = path.join(__dirname, "apps/headers")
  var port        = 8901

  before(function(done){
    harp.server(projectPath, { port: port }, done)
  })

  it("should be correct with an invalid ejs file", function(done){
    superagent.agent().get("http://localhost:" + port + "/invalid-ejs.html").end(function(err, rsp){
      rsp.should.have.status(500)
      rsp.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      rsp.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct with an invalid jade file", function(done){
    superagent.agent().get("http://localhost:" + port + "/invalid-jade.html").end(function(err, rsp){
      rsp.should.have.status(500)
      rsp.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      rsp.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct with an invalid less file", function(done){
    superagent.agent().get("http://localhost:" + port + "/invalid-less.css").end(function(err, rsp){
      rsp.should.have.status(500)
      rsp.headers.should.have.property("content-type", "text/css; charset=UTF-8")
      rsp.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct with an invalid stylus file", function(done){
    superagent.agent().get("http://localhost:" + port + "/invalid-styl.css").end(function(err, rsp){
      rsp.should.have.status(500)
      rsp.headers.should.have.property("content-type", "text/css; charset=UTF-8")
      rsp.headers.should.have.property("content-length")
      done()
    })
  })

  // TODO: This should change to javascript error file.
  //
  it("should be correct with an invalid CoffeeScript file", function(done){
    superagent.agent().get("http://localhost:" + port + "/invalid-coffee.js").end(function(err, rsp){
      rsp.should.have.status(500)
      rsp.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      rsp.headers.should.have.property("content-length")
      done()
    })
  })

})