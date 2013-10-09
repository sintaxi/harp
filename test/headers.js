var should      = require("should")
var superagent  = require('superagent')
var path        = require('path')
var harp        = require('../')



describe("headers", function(){
  var projectPath = path.join(__dirname, "apps/headers")
  var port        = 8901

  before(function(done){
    harp.server(projectPath, { port: port }, done)
  })

  // valid

  it("should be correct with a valid Jade file", function(done){
    superagent.agent().get("http://localhost:" + port + "/valid-jade.html").end(function(err, rsp){
      rsp.should.have.status(200)
      rsp.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      rsp.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct with a valid EJS file", function(done){
    superagent.agent().get("http://localhost:" + port + "/valid-ejs.html").end(function(err, rsp){
      rsp.should.have.status(200)
      rsp.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      rsp.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct with a valid Markdown file", function(done){
    superagent.agent().get("http://localhost:" + port + "/valid-markdown.html").end(function(err, rsp){
      rsp.should.have.status(200)
      rsp.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      rsp.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct with a valid CoffeeScript file", function(done){
    superagent.agent().get("http://localhost:" + port + "/valid-coffee.js").end(function(err, rsp){
      rsp.should.have.status(200)
      rsp.headers.should.have.property("content-type", "application/javascript")
      rsp.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct with a valid LESS file", function(done){
    superagent.agent().get("http://localhost:" + port + "/valid-less.css").end(function(err, rsp){
      rsp.should.have.status(200)
      rsp.headers.should.have.property("content-type", "text/css; charset=UTF-8")
      rsp.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct with a valid Stylus file", function(done){
    superagent.agent().get("http://localhost:" + port + "/valid-styl.css").end(function(err, rsp){
      rsp.should.have.status(200)
      rsp.headers.should.have.property("content-type", "text/css; charset=UTF-8")
      rsp.headers.should.have.property("content-length")
      done()
    })
  })

  // invalid

  it("should be correct with an invalid EJS file", function(done){
    superagent.agent().get("http://localhost:" + port + "/invalid-ejs.html").end(function(err, rsp){
      rsp.should.have.status(500)
      rsp.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      rsp.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct with an invalid Jade file", function(done){
    superagent.agent().get("http://localhost:" + port + "/invalid-jade.html").end(function(err, rsp){
      rsp.should.have.status(500)
      rsp.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      rsp.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct with an invalid LESS file", function(done){
    superagent.agent().get("http://localhost:" + port + "/invalid-less.css").end(function(err, rsp){
      rsp.should.have.status(500)
      rsp.headers.should.have.property("content-type", "text/css; charset=UTF-8")
      rsp.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct with an invalid Stylus file", function(done){
    superagent.agent().get("http://localhost:" + port + "/invalid-styl.css").end(function(err, rsp){
      rsp.should.have.status(500)
      rsp.headers.should.have.property("content-type", "text/css; charset=UTF-8")
      rsp.headers.should.have.property("content-length")
      done()
    })
  })

  // TODO: This should change to javascript error file.
  it("should be correct with an invalid CoffeeScript file", function(done){
    superagent.agent().get("http://localhost:" + port + "/invalid-coffee.js").end(function(err, rsp){
      rsp.should.have.status(500)
      rsp.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      rsp.headers.should.have.property("content-length")
      done()
    })
  })

  // direct

  it("should be correct when Jade file requested", function(done){
    superagent.agent().get("http://localhost:" + port + "/valid-jade.jade").end(function(err, rsp){
      rsp.should.have.status(404)
      rsp.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      rsp.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct when EJS file requested", function(done){
    superagent.agent().get("http://localhost:" + port + "/valid-ejs.ejs").end(function(err, rsp){
      rsp.should.have.status(404)
      rsp.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      rsp.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct when Markdown file requested", function(done){
    superagent.agent().get("http://localhost:" + port + "/valid-markdown.md").end(function(err, rsp){
      rsp.should.have.status(404)
      rsp.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      rsp.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct when CoffeeScript file requested", function(done){
    superagent.agent().get("http://localhost:" + port + "/valid-coffee.coffee").end(function(err, rsp){
      rsp.should.have.status(404)
      rsp.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      rsp.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct when LESS file requested", function(done){
    superagent.agent().get("http://localhost:" + port + "/valid-less.less").end(function(err, rsp){
      rsp.should.have.status(404)
      rsp.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      rsp.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct when Stylus file requested", function(done){
    superagent.agent().get("http://localhost:" + port + "/valid-styl.styl").end(function(err, rsp){
      rsp.should.have.status(404)
      rsp.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      rsp.headers.should.have.property("content-length")
      done()
    })
  })

  // missing pages

  it("should be correct when missing css file", function(done){
    superagent.agent().get("http://localhost:" + port + "/missing.css").end(function(err, rsp){
      rsp.should.have.status(404)
      rsp.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      rsp.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct when missing html file", function(done){
    superagent.agent().get("http://localhost:" + port + "/missing.html").end(function(err, rsp){
      rsp.should.have.status(404)
      rsp.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      rsp.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct when missing js file", function(done){
    superagent.agent().get("http://localhost:" + port + "/missing.js").end(function(err, rsp){
      rsp.should.have.status(404)
      rsp.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      rsp.headers.should.have.property("content-length")
      done()
    })
  })

})