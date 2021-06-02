var should      = require("should")
var request     = require('request')
var path        = require("path")
var fs          = require("fs")
var exec        = require("child_process").exec
var harp        = require("../")

describe("security", function(){
  var projectPath = path.join(__dirname, "apps/security")
  var outputPath  = path.join(__dirname, "out/security")

  var config;

  before(function(done){
    harp.compile(projectPath, outputPath, function(errors, output){
      config = output
      var server = harp.server(projectPath)
      server.listen(8101, done)
    })
  })

  it("should not serve file starting with underscore", function(done){
    request('http://localhost:8101/_secret.txt', function (e, r, b) {
      r.statusCode.should.eql(404)
      done()
    })
  })

  it("should not serve file starting with encoded underscore", function(done){
    request('http://localhost:8101/%5fsecret.txt', function (e, r, b) {
      r.statusCode.should.eql(404)
      done()
    })
  })

  after(function(done){
    exec("rm -rf " + outputPath, function(){
      done()
    })
  })

})
