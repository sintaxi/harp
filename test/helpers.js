var should  = require("should")
var helpers = require("../lib/helpers")
var fse     = require("fs-extra")
var path    = require("path")

describe("helpers", function(){

  describe("buildFallbackPriorityList", function(){
    it("should build priority list", function(done){
      var list = helpers.buildFallbackPriorityList("/foo/bar/baz")
      list.should.eql([ 
        'foo/bar/200.jade',
        'foo/bar/200.ejs',
        'foo/bar/200.md',
        'foo/bar/200.html.jade',
        'foo/bar/200.html.ejs',
        'foo/bar/200.html.md',
        'foo/bar/404.jade',
        'foo/bar/404.ejs',
        'foo/bar/404.md',
        'foo/bar/404.html.jade',
        'foo/bar/404.html.ejs',
        'foo/bar/404.html.md',
        'foo/200.jade',
        'foo/200.ejs',
        'foo/200.md',
        'foo/200.html.jade',
        'foo/200.html.ejs',
        'foo/200.html.md',
        'foo/404.jade',
        'foo/404.ejs',
        'foo/404.md',
        'foo/404.html.jade',
        'foo/404.html.ejs',
        'foo/404.html.md',
        "200.jade",
        "200.ejs",
        "200.md",
        "200.html.jade",
        "200.html.ejs",
        "200.html.md",
        "404.jade",
        "404.ejs",
        "404.md",
        "404.html.jade",
        "404.html.ejs",
        "404.html.md"
      ])
      return done()
    })
  })

  describe("willCollide(projectPath, outputPath)", function(){
    it("should collide if output path is /", function(done){
      helpers.willCollide("/", "/").should.be.true
      helpers.willCollide("/foo/bar/myproject", "/").should.be.true
      helpers.willCollide("/foo/bar/myproject/", "/").should.be.true
      done()
    })

    it("should collide if output path is the root of the source directory", function(done) {
      helpers.willCollide("/foo/bar/myproject", "/foo/bar/myproject").should.be.true
      helpers.willCollide("./", "./").should.be.true
      done()
    })

    it("should not collide if output path is /output", function(done){
      helpers.willCollide("/foo/bar/myproject", "/output").should.be.false
      helpers.willCollide("/foo/bar/myproject", "/output/").should.be.false
      helpers.willCollide("/foo/bar/myproject/", "/output/").should.be.false
      helpers.willCollide("/foo/bar/myproject/", "/output").should.be.false
      done()
    })

    it("should not collide if output path is in projectPath", function(done){
      helpers.willCollide("/foo/bar/myproject", "/foo/bar/myproject/www").should.be.false
      helpers.willCollide("/foo/bar/myproject/", "/foo/bar/myproject/www").should.be.false
      helpers.willCollide("/foo/bar/myproject", "/foo/bar/myproject/www/").should.be.false
      helpers.willCollide("/foo/bar/myproject/", "/foo/bar/myproject/www/").should.be.false
      done()
    })

    it("should not collide if project path is one back and begins with underscore", function(done){
      helpers.willCollide("/foo/bar/myproject", "/foo/bar").should.be.true
      helpers.willCollide("/foo/bar/myproject/", "/foo/bar/").should.be.true
      helpers.willCollide("/foo/bar/myproject", "/foo/bar/").should.be.true
      helpers.willCollide("/foo/bar/myproject/", "/foo/bar").should.be.true
      done()
    })
  })

  describe("willAllow(projectPath, outputPath)", function(){
    it("should not allow project to compile one directory back if source not starting with underscore", function(done){
      helpers.willAllow("/foo/bar/myproject", "/foo/bar").should.be.false
      helpers.willAllow("/foo/bar/myproject/", "/foo/bar/").should.be.false
      helpers.willAllow("/foo/bar/myproject", "/foo/bar/").should.be.false
      helpers.willAllow("/foo/bar/myproject/", "/foo/bar").should.be.false
      done()
    })

    it("should not allow project to compile into the source directory when no name is specified", function(done) {
      helpers.willAllow("/foo/bar/myproject", "/foo/bar/myproject").should.be.false
      helpers.willAllow("./", "./").should.be.false
      done()
    })

    it("should allow project to compile one directory back if source directory starts with underscore", function(done){
      helpers.willAllow("/foo/bar/_myproject", "/foo/bar").should.be.true
      helpers.willAllow("/foo/bar/_myproject/", "/foo/bar/").should.be.true
      helpers.willAllow("/foo/bar/_myproject", "/foo/bar/").should.be.true
      helpers.willAllow("/foo/bar/_myproject/", "/foo/bar").should.be.true
      done()
    })

    it("should not allow project to compile one directory back if source directory starts with underscore", function(done){
      helpers.willAllow("/foo/bar/_myproject", "/foo").should.be.false
      helpers.willAllow("/foo/_bar/myproject", "/foo").should.be.false
      helpers.willAllow("/foo/_bar/_myproject", "/foo").should.be.false
      done()
    })
  })

  describe("setup(projectPath)", function(){

    it("should detect framework style", function(done){
      var cfg = helpers.setup(path.join(__dirname, "apps", "app-style-framework"))
      cfg.should.have.property("config")
      cfg.should.have.property("projectPath")
      cfg.should.have.property("publicPath")
      done()
    })

    it("should detect root style", function(done){
      var cfg = helpers.setup(path.join(__dirname, "apps", "app-style-root"))
      cfg.should.have.property("config")
      cfg.should.have.property("projectPath")
      cfg.should.have.property("publicPath")
      cfg.publicPath.should.eql(cfg.projectPath)
      done()
    })

    it("should default to root style", function(done){
      var cfg = helpers.setup(path.join(__dirname, "apps", "app-style-implicit"))
      cfg.should.have.property("config")
      cfg.should.have.property("projectPath")
      cfg.should.have.property("publicPath")
      cfg.publicPath.should.eql(cfg.projectPath)
      done()
    })

    it("should replace values like $foo with process.env.foo", function(done){
      process.env.HARP_BASIC_AUTH = "jabberwocky:skrillex"
      var cfg = helpers.setup(path.join(__dirname, "apps", "envy"))
      cfg.should.have.property("config")
      cfg.should.have.property("projectPath")
      cfg.should.have.property("publicPath")
      cfg.config.should.have.property("basicAuth", "jabberwocky:skrillex")
      cfg.config.should.not.have.property("optionalThing")
      done()
    })

  })

  describe("prime(outputPath)", function(){
    before(function(done){
      fse.mkdirp(path.join(__dirname, "temp"), function(){
        fse.mkdirSync(path.join(__dirname, "temp", "myproj"))
        fse.mkdirSync(path.join(__dirname, "temp", "foo"))
        fse.writeFileSync(path.join(__dirname, "temp", "bar"), "hello bar")
        done()
      })
    })

    it("should only remove directories that do not begin with underscore", function(done){
      helpers.prime(path.join(__dirname, "temp"), { ignore: "myproj" }, function(error){
        fse.existsSync(path.join(__dirname, "temp", "myproj")).should.be.true
        fse.existsSync(path.join(__dirname, "temp", "foo")).should.be.false
        fse.existsSync(path.join(__dirname, "temp", "bar")).should.be.false
        done()
      })
    })

    after(function(done){
      fse.remove(path.join(__dirname, "temp"), done)
    })
  })

})
