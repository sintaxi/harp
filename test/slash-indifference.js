var should      = require("should")
var axios       = require('axios')
var path        = require("path")
var fs          = require("fs")
var exec        = require("child_process").exec
var harp        = require("../")

describe("slash-indifference", function(){
  var projectPath = path.join(__dirname, "apps/slash-indifference")
  var server;

  before(function(done){
    server = harp.server(projectPath).listen(8119, done)
  })

  describe("file", function(){
    it("should get 200 without slash", function(done){
      axios.get('http://localhost:8119/file', { maxRedirects: 0 }).then(function(r){
        r.status.should.eql(200)
        r.data.should.eql("<h1>file contents</h1>")
        done()
      })
    })

    it("should get redirected when slash present", function(done){
      axios.get('http://localhost:8119/file/', { maxRedirects: 0 }).catch(function(e){
        e.response.status.should.eql(301)
        e.response.headers["location"].should.eql("/file")
        done()
      })
    })
  })

  describe("directory", function(){
    it("should get 200 with slash", function(done){
      axios.get('http://localhost:8119/directory/', { maxRedirects: 0 }).then(function(r){
        r.status.should.eql(200)
        r.data.should.eql("<h1>file in directory contents</h1>")
        done()
      })
    })

    it("should get redirected when slash absent", function(done){
      axios.get('http://localhost:8119/directory', { maxRedirects: 0 }).catch(function(e){
        e.response.status.should.eql(301)
        e.response.headers["location"].should.eql("/directory/")
        done()
      })
    })
  })

  after(function(done){
    server.close(done)
  })

})
