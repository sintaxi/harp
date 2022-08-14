var should      = require("should")
var axios       = require('axios')
var path        = require('path')
var harp        = require('../')



describe("headers", function(){
  var projectPath = path.join(__dirname, "apps/headers")
  var port        = 8901
  var server;

  before(function(done){
    server = harp.server(projectPath).listen(port, done)
  })

  // static

  it("should be correct with a valid CSS file", function(done){
    axios.get("http://localhost:" + port + "/valid-css.css").then(function(r){
      r.status.should.eql(200)
      r.headers.should.have.property("content-type", "text/css; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct with a valid HTML file", function(done){
    axios.get("http://localhost:" + port + "/valid-html.html").then(function(r){
      r.status.should.eql(200)
      r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct with a valid JS file", function(done){
    axios.get("http://localhost:" + port + "/valid-js.js").then(function(r){
      r.status.should.eql(200)
      r.headers.should.have.property("content-type", "application/javascript; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  // valid

  it("should be correct with a valid Jade file", function(done){
    axios.get("http://localhost:" + port + "/valid-jade.html").then(function(r){
      r.status.should.eql(200)
      r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct with a valid EJS file", function(done){
    axios.get("http://localhost:" + port + "/valid-ejs.html").then(function(r){
      r.status.should.eql(200)
      r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct with a valid Markdown file", function(done){
    axios.get("http://localhost:" + port + "/valid-markdown.html").then(function(r){
      r.status.should.eql(200)
      r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  // it("should be correct with a valid CoffeeScript file", function(done){
  //   request("http://localhost:" + port + "/valid-coffee.js", function(e, r, b){
  //     r.statusCode.should.eql(200)
  //     r.headers.should.have.property("content-type", "application/javascript; charset=UTF-8")
  //     r.headers.should.have.property("content-length")
  //     done()
  //   })
  // })

  // it("should be correct with a valid LESS file", function(done){
  //   request("http://localhost:" + port + "/valid-less.css", function(e, r, b){
  //     r.statusCode.should.eql(200)
  //     r.headers.should.have.property("content-type", "text/css; charset=UTF-8")
  //     r.headers.should.have.property("content-length")
  //     done()
  //   })
  // })

  // it("should be correct with a valid Stylus file", function(done){
  //   request("http://localhost:" + port + "/valid-styl.css", function(e, r, b){
  //     r.statusCode.should.eql(200)
  //     r.headers.should.have.property("content-type", "text/css; charset=UTF-8")
  //     r.headers.should.have.property("content-length")
  //     done()
  //   })
  // })

  it("should be correct with a valid SCSS file", function(done){
    axios.get("http://localhost:" + port + "/valid-scss.css").then(function(r){
      r.status.should.eql(200)
      r.headers.should.have.property("content-type", "text/css; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct with a valid Sass file", function(done){
    axios.get("http://localhost:" + port + "/valid-sass.css").then(function(r){
      r.status.should.eql(200)
      r.headers.should.have.property("content-type", "text/css; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  // invalid

  it("should be correct with an invalid EJS file", function(done){
    axios.get("http://localhost:" + port + "/invalid-ejs.html").catch(function(e){
      e.response.status.should.eql(500)
      e.response.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      e.response.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct with an invalid Jade file", function(done){
    axios.get("http://localhost:" + port + "/invalid-jade.html").catch(function(e){
      e.response.status.should.eql(500)
      e.response.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      e.response.headers.should.have.property("content-length")
      done()
    })
  })

  // it("should be correct with an invalid LESS file", function(done){
  //   request("http://localhost:" + port + "/invalid-less.css", function(e, r, b){
  //     r.statusCode.should.eql(200)
  //     r.headers.should.have.property("content-type", "text/css; charset=UTF-8")
  //     r.headers.should.have.property("content-length")
  //     done()
  //   })
  // })

  // it("should be correct with an invalid Stylus file", function(done){
  //   request("http://localhost:" + port + "/invalid-styl.css", function(e, r, b){
  //     r.statusCode.should.eql(200)
  //     r.headers.should.have.property("content-type", "text/css; charset=UTF-8")
  //     r.headers.should.have.property("content-length")
  //     done()
  //   })
  // })

  it("should be correct with an invalid SCSS file", function(done){
    axios.get("http://localhost:" + port + "/invalid-scss.css").then(function(r){
      r.status.should.eql(200)
      r.headers.should.have.property("content-type", "text/css; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct with an invalid Sass file", function(done){
    axios.get("http://localhost:" + port + "/invalid-sass.css").then(function(r){
      r.status.should.eql(200)
      r.headers.should.have.property("content-type", "text/css; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  // TODO: This should change to javascript error file.
  // it("should be correct with an invalid CoffeeScript file", function(done){
  //   request("http://localhost:" + port + "/invalid-coffee.js", function(e, r, b){
  //     r.statusCode.should.eql(500)
  //     r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
  //     r.headers.should.have.property("content-length")
  //     done()
  //   })
  // })

  // direct

  it("should be correct when Jade file requested", function(done){
    axios.get("http://localhost:" + port + "/valid-jade.jade").catch(function(e){
      e.response.status.should.eql(404)
      e.response.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      e.response.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct when EJS file requested", function(done){
    axios.get("http://localhost:" + port + "/valid-ejs.ejs").catch(function(e){
      e.response.status.should.eql(404)
      e.response.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      e.response.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct when Markdown file requested", function(done){
    axios.get("http://localhost:" + port + "/valid-markdown.md").catch(function(e){
      e.response.status.should.eql(404)
      e.response.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      e.response.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct when CoffeeScript file requested", function(done){
    axios.get("http://localhost:" + port + "/valid-coffee.coffee").catch(function(e){
      e.response.status.should.eql(404)
      e.response.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      e.response.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct when LESS file requested", function(done){
    axios.get("http://localhost:" + port + "/valid-less.less").catch(function(e){
      e.response.status.should.eql(404)
      e.response.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      e.response.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct when Stylus file requested", function(done){
    axios.get("http://localhost:" + port + "/valid-styl.styl").catch(function(e){
      e.response.status.should.eql(404)
      e.response.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      e.response.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct when SCSS file requested", function(done){
    axios.get("http://localhost:" + port + "/valid-scss.scss").catch(function(e){
      e.response.status.should.eql(404)
      e.response.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      e.response.headers.should.have.property("content-length")
      done()
    })
  })

  // missing pages

  it("should be correct when missing css file", function(done){
    axios.get("http://localhost:" + port + "/missing.css").catch(function(e){
      e.response.status.should.eql(404)
      e.response.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      e.response.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct when missing html file", function(done){
    axios.get("http://localhost:" + port + "/missing.html").catch(function(e){
      e.response.status.should.eql(404)
      e.response.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      e.response.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct when missing js file", function(done){
    axios.get("http://localhost:" + port + "/missing.js").catch(function(e){
      e.response.status.should.eql(404)
      e.response.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      e.response.headers.should.have.property("content-length")
      done()
    })
  })

  after(function(done){
    server.close(done)
  })

})
