var should  = require("should")
var axios   = require('axios')
var path    = require('path')
var harp    = require("../")

describe("basicAuth", function(){

  describe("single", function(done){
    var projectPath = path.join(__dirname, "apps/auth/single")
    var server;

    before(function(done){
      server = harp.server(projectPath).listen(8310, done)
    })

    it("should be a protected page", function(done){
      axios.get('http://localhost:8310/').catch(function(error) {
        error.response.status.should.eql(401)
        done()
      })
    })

    it("should fetch protected resource with correct creds", function(done){
      axios({
        method: "GET",
        url: 'http://localhost:8310/',
        auth: {
          username: 'foo',
          password: 'bar'
        }
      }).then(function(response){
        response.status.should.eql(200)
        done()
      })
    })

    after(function(done){
      server.close(done)
    })
  })

})