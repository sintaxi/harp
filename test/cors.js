var should      = require("should")
var request     = require('request')
var path        = require("path")
var harp        = require("../")

describe("cors", function(){

  describe("no-cors", function(){
    var projectPath = path.join(__dirname, "apps/cors")
    var port        = 8120

    before(function(done){
      harp.server(projectPath, { port: port }, done);
    })

    it("should not allow access at all", function(done){
      request('http://localhost:'+ port +'/cors.txt', function (e, r, b) {
        r.statusCode.should.eql(200)
        r.headers.should.not.have.property("access-control-allow-origin")
        done()
      })
    })
  })

  describe("wildcard", function(){
    var projectPath = path.join(__dirname, "apps/cors")
    var port        = 8121
    var cors        = true

    before(function(done){
      harp.server(projectPath, { port: port, cors: cors }, done);
    })

    it("should allow access from every origin", function(done){
      var options = {
        url: 'http://localhost:'+ port +'/cors.txt',
        headers: {
          Origin: 'http://some.random.origin'
        }
      }

      request(options, function (e, r, b) {
        r.statusCode.should.eql(200)
        r.headers.should.have.property("access-control-allow-origin", "http://some.random.origin")
        done()
      })
    })
  })

  describe("specific-domains", function(){
    var projectPath = path.join(__dirname, "apps/cors")
    var port        = 8122
    var cors        = ["http://first.allowed.origin", "http://second.allowed.origin"]

    before(function(done){
      harp.server(projectPath, { port: port, cors: cors }, done);
    })

    it("should allow access from origin http://first.allowed.origin", function(done){
      var options = {
        url: 'http://localhost:'+ port +'/cors.txt',
        headers: {
          Origin: 'http://first.allowed.origin'
        }
      }

      request(options, function (e, r, b) {
        r.statusCode.should.eql(200)
        r.headers.should.have.property("access-control-allow-origin", "http://first.allowed.origin")
        done()
      })
    })

    it("should allow access from origin http://second.allowed.origin", function(done){
      var options = {
        url: 'http://localhost:'+ port +'/cors.txt',
        headers: {
          Origin: 'http://second.allowed.origin'
        }
      }

      request(options, function (e, r, b) {
        r.statusCode.should.eql(200)
        r.headers.should.have.property("access-control-allow-origin", "http://second.allowed.origin")
        done()
      })
    })

    it("should prevent access from http://evil.origin", function(done){
      var options = {
        url: 'http://localhost:'+ port +'/cors.txt',
        headers: {
          Origin: 'http://evil.origin'
        }
      }

      request(options, function (e, r, b) {
        r.statusCode.should.eql(200)
        r.headers.should.not.have.property("access-control-allow-origin")
        done()
      })
    })
  })

})
