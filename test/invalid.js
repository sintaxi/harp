var should      = require("should")
var request     = require('request')
var path        = require('path')
var harp        = require('../')



describe("headers", function(){
  var projectPath = path.join(__dirname, "apps/err-invalid-source-files")
  var port        = 8801

  before(function(done){
    harp.server(projectPath, { port: port }, done)
  })

  it("should return correct mime type for css files", function(done){
    request("http://localhost:" + port + "/invalid-jade.html", function(e,r,b){
      r.statusCode.should.eql(500)
      b.should.include(harp.pkg.version)
      done()
    })
  })

})