var should  = require("should")
var request = require('request')
var path    = require('path')
var harp    = require("../")

describe("basicAuth", function(){

  describe("single", function(done){
    var projectPath = path.join(__dirname, "apps/auth/single")

    before(function(done){
      harp.server(projectPath, { port: 8310 }, done)
    })

    it("should be a protected page", function(done){
      request('http://localhost:8310/', function (e, r, b) {
        r.statusCode.should.eql(401)
        done()
      })
    })

    it("should fetch protected resource with correct creds", function(done){
      request({
          method: "GET",
          url: 'http://localhost:8310/',
          auth: {
            'user': 'foo',
            'pass': 'bar'
          }
        }, function (e, r, b) {
          r.statusCode.should.eql(200)
          done()
      })
    })
  })

})