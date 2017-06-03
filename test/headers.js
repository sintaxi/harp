var should      = require("should")
var request     = require('request')
var path        = require('path')
var harp        = require('../')



describe("headers", function(){
  var projectPath = path.join(__dirname, "apps/headers")
  var port        = 8901

  before(function(done){
    harp.server(projectPath, { port: port }, done)
  })

  // static

  it("should be correct with a valid CSS file", function(done){
    request("http://localhost:" + port + "/valid-css.css", function(e,r,b){
      r.statusCode.should.eql(200)
      r.headers.should.have.property("content-type", "text/css; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct with a valid HTML file", function(done){
    request("http://localhost:" + port + "/valid-html.html", function(e, r, b){
      r.statusCode.should.eql(200)
      r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct with a valid JS file", function(done){
    request("http://localhost:" + port + "/valid-js.js", function(e, r, b){
      r.statusCode.should.eql(200)
      r.headers.should.have.property("content-type", "application/javascript")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  // valid

  it("should be correct with a valid Jade file", function(done){
    request("http://localhost:" + port + "/valid-jade.html", function(e, r, b){
      r.statusCode.should.eql(200)
      r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct with a valid EJS file", function(done){
    request("http://localhost:" + port + "/valid-ejs.html", function(e, r, b){
      r.statusCode.should.eql(200)
      r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct with a valid Markdown file", function(done){
    request("http://localhost:" + port + "/valid-markdown.html", function(e, r, b){
      r.statusCode.should.eql(200)
      r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct with a valid CoffeeScript file", function(done){
    request("http://localhost:" + port + "/valid-coffee.js", function(e, r, b){
      r.statusCode.should.eql(200)
      r.headers.should.have.property("content-type", "application/javascript; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct with a valid LESS file", function(done){
    request("http://localhost:" + port + "/valid-less.css", function(e, r, b){
      r.statusCode.should.eql(200)
      r.headers.should.have.property("content-type", "text/css; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct with a valid Stylus file", function(done){
    request("http://localhost:" + port + "/valid-styl.css", function(e, r, b){
      r.statusCode.should.eql(200)
      r.headers.should.have.property("content-type", "text/css; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct with a valid SCSS file", function(done){
    request("http://localhost:" + port + "/valid-scss.css", function(e, r, b){
      r.statusCode.should.eql(200)
      r.headers.should.have.property("content-type", "text/css; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct with a valid Sass file", function(done){
    request("http://localhost:" + port + "/valid-sass.css", function(e, r, b){
      r.statusCode.should.eql(200)
      r.headers.should.have.property("content-type", "text/css; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  // invalid

  it("should be correct with an invalid EJS file", function(done){
    request("http://localhost:" + port + "/invalid-ejs.html", function(e, r, b){
      r.statusCode.should.eql(500)
      r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct with an invalid Jade file", function(done){
    request("http://localhost:" + port + "/invalid-jade.html", function(e, r, b){
      r.statusCode.should.eql(500)
      r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct with an invalid LESS file", function(done){
    request("http://localhost:" + port + "/invalid-less.css", function(e, r, b){
      r.statusCode.should.eql(200)
      r.headers.should.have.property("content-type", "text/css; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct with an invalid Stylus file", function(done){
    request("http://localhost:" + port + "/invalid-styl.css", function(e, r, b){
      r.statusCode.should.eql(200)
      r.headers.should.have.property("content-type", "text/css; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct with an invalid SCSS file", function(done){
    request("http://localhost:" + port + "/invalid-scss.css", function(e, r, b){
      r.statusCode.should.eql(200)
      r.headers.should.have.property("content-type", "text/css; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct with an invalid Sass file", function(done){
    request("http://localhost:" + port + "/invalid-sass.css", function(e, r, b){
      r.statusCode.should.eql(200)
      r.headers.should.have.property("content-type", "text/css; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  // TODO: This should change to javascript error file.
  it("should be correct with an invalid CoffeeScript file", function(done){
    request("http://localhost:" + port + "/invalid-coffee.js", function(e, r, b){
      r.statusCode.should.eql(500)
      r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  // direct

  it("should be correct when Jade file requested", function(done){
    request("http://localhost:" + port + "/valid-jade.jade", function(e, r, b){
      r.statusCode.should.eql(404)
      r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct when EJS file requested", function(done){
    request("http://localhost:" + port + "/valid-ejs.ejs", function(e, r, b){
      r.statusCode.should.eql(404)
      r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct when Markdown file requested", function(done){
    request("http://localhost:" + port + "/valid-markdown.md", function(e, r, b){
      r.statusCode.should.eql(404)
      r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct when CoffeeScript file requested", function(done){
    request("http://localhost:" + port + "/valid-coffee.coffee", function(e, r, b){
      r.statusCode.should.eql(404)
      r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct when LESS file requested", function(done){
    request("http://localhost:" + port + "/valid-less.less", function(e, r, b){
      r.statusCode.should.eql(404)
      r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct when Stylus file requested", function(done){
    request("http://localhost:" + port + "/valid-styl.styl", function(e, r, b){
      r.statusCode.should.eql(404)
      r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct when SCSS file requested", function(done){
    request("http://localhost:" + port + "/valid-scss.scss", function(e, r, b){
      r.statusCode.should.eql(404)
      r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  // missing pages

  it("should be correct when missing css file", function(done){
    request("http://localhost:" + port + "/missing.css", function(e, r, b){
      r.statusCode.should.eql(404)
      r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct when missing html file", function(done){
    request("http://localhost:" + port + "/missing.html", function(e, r, b){
      r.statusCode.should.eql(404)
      r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

  it("should be correct when missing js file", function(done){
    request("http://localhost:" + port + "/missing.js", function(e, r, b){
      r.statusCode.should.eql(404)
      r.headers.should.have.property("content-type", "text/html; charset=UTF-8")
      r.headers.should.have.property("content-length")
      done()
    })
  })

})
