var should      = require("should")
var request     = require('request')
var path        = require("path")
var fs          = require("fs")
var exec        = require("child_process").exec
var harp        = require("../")

describe("slash-indifference", function(){
  var projectPath = path.join(__dirname, "apps/slash-indifference")

  before(function(done){
    harp.server(projectPath, { port: 8119 }, done)
  })

  describe("file", function(){
    it("should get 200 without slash", function(done){
      request('http://localhost:8119/file', { followRedirect: false }, function(e, r, b){
        r.statusCode.should.eql(200)
        b.should.eql("<h1>file contents</h1>")
        done()
      })
    })

    it("should get redirected when slash present", function(done){
      request('http://localhost:8119/file/', { followRedirect: false }, function(e, r, b){
        r.statusCode.should.eql(301)
        r.headers["location"].should.eql("/file")
        done()
      })
    })
  })

  describe("directory", function(){
    it("should get 200 with slash", function(done){
      request('http://localhost:8119/directory/', { followRedirect: false }, function(e, r, b){
        r.statusCode.should.eql(200)
        b.should.eql("<h1>file in directory contents</h1>")
        done()
      })
    })

    it("should get redirected when slash absent", function(done){
      request('http://localhost:8119/directory', { followRedirect: false }, function(e, r, b){
        r.statusCode.should.eql(301)
        r.headers["location"].should.eql("/directory/")
        done()
      })
    })
  })

})
