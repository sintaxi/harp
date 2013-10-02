var should      = require("should")
var superagent  = require('superagent')
var path        = require('path')
var harp        = require('../')



describe("invalid", function(){
  var projectPath = path.join(__dirname, "apps/err-invalid-source-files")
  var port        = 8801

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