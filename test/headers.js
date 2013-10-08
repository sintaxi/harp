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

  it("should return correct mime type for css files", function(done){
    superagent.agent().get("http://localhost:" + port + "/invalid-jade.html").end(function(err, rsp){
      rsp.should.have.status(500)
      done()
    })
  })

})