var should      = require("should")
var axios       = require('axios')
var path        = require('path')
var harp        = require('../')



describe("headers", function(){
  var projectPath = path.join(__dirname, "apps/err-invalid-source-files")
  var port        = 8801
  var server;

  before(function(done){
    server = harp.server(projectPath).listen(port, done)
  })

  it("should return correct mime type for css files", function(done){
    axios.get("http://localhost:" + port + "/invalid-jade.html").catch(function(e){
      e.response.status.should.eql(500)
      e.response.data.should.include(harp.pkg.version)
      done()
    })
  })

  after(function(done){
    server.close(done)
  })

})