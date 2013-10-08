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

  it("should be correct invalid jade file", function(done){
    superagent.agent().get("http://localhost:" + port + "/invalid-jade.html").end(function(err, rsp){
      rsp.should.have.status(500)
      rsp.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      rsp.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct invalid less file", function(done){
    superagent.agent().get("http://localhost:" + port + "/invalid-less.css").end(function(err, rsp){
      rsp.should.have.status(500)
      rsp.headers.should.have.property("content-type", "text/css; charset=UTF-8")
      rsp.headers.should.have.property("content-length")
      done()
    })
  })

})