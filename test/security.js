var should      = require("should")
var axios       = require('axios')
var path        = require("path")
var fs          = require("fs")
var exec        = require("child_process").exec
var harp        = require("../")

describe("security", function(){
  var projectPath = path.join(__dirname, "apps/security")
  var outputPath  = path.join(__dirname, "out/security")
  var config;
  var server;

  before(function(done){
    harp.compile(projectPath, outputPath, function(errors, output){
      config = output
      server = harp.server(projectPath).listen(8101, done)
    })
  })

  it("should not serve file starting with underscore", function(done){
    axios.get('http://localhost:8101/_secret.txt').catch(function(e){
      e.response.status.should.eql(404)
      done()
    })
  })

  it("should not serve file starting with encoded underscore", function(done){
    axios.get('http://localhost:8101/%5fsecret.txt').catch(function(e){
      e.response.status.should.eql(404)
      done()
    })
  })

  after(function(done){
    exec("rm -rf " + outputPath, function(){
      server.close(done)
    })
  })

})
