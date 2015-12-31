var should      = require("should")
var request     = require('request')
var path        = require("path")
var fs          = require("fs")
var exec        = require("child_process").exec
var harp        = require("../")

describe("sourcemaps", function(){
  var projectPath = path.join(__dirname, "apps/sourcemaps")
  var outputPath  = path.join(__dirname, "out/sourcemaps")

  var config;
  var port = 8900;

  before(function(done){
    harp.compile(projectPath, outputPath, function(errors, output){
      config = output
      harp.server(projectPath, { port: port }, done)
    })
  })

  describe("LESS", function(){
    it("should be linked from harp server, not compiled", function(done){
      fs.readFile(path.join(outputPath, "css", "main-less.css"), function(err, contents){
        contents.toString().should.not.include("/*# sourceMappingURL=main-less.css.map */")
        request('http://localhost:' + port + '/css/main-less.css', function (e, r, b) {
          b.should.startWith(contents.toString())
          b.should.endWith('/*# sourceMappingURL=main-less.css.map */')
          done()
        })
      })
    })

    it("should be served from harp server, not compiled", function(done){
      var rsp = fs.existsSync(path.join(outputPath, "css", "main-less.css.map"))
      rsp.should.be.false
      request('http://localhost:' + port + '/css/main-less.css.map', function (e, r, b) {
        r.statusCode.should.eql(200)
        done()
      })
    })

    it("should be valid JSON", function(done){
      request('http://localhost:' + port + '/css/main-less.css.map', function (e, r, b) {
        r.headers.should.have.property("content-type", "application/json");
        var sourcemap = JSON.parse(r.body);
        sourcemap.should.have.property('version', '3');
        done()
      })
    })

    it("should contain appropriate content", function(done){
      request('http://localhost:' + port + '/css/main-less.css.map', function (e, r, b) {
        var sourcemap = JSON.parse(r.body);
        sourcemap.sources.should.be.type('object')
        sourcemap.sources[0].should.be.type('string')
        sourcemap.sources[0].should.include('_part-less.less')
        sourcemap.sources[2].should.include('main-less.less')
        done()
      })
    })
  })

  describe("SASS", function(){
    it("should be linked from harp server, not compiled", function(done){
      fs.readFile(path.join(outputPath, "css", "main-sass.css"), function(err, contents){
        contents.toString().should.not.include("/*# sourceMappingURL=main-sass.css.map */")
        request('http://localhost:' + port + '/css/main-sass.css', function (e, r, b) {
          b.should.startWith(contents.toString())
          b.should.endWith('/*# sourceMappingURL=main-sass.css.map */')
          done()
        })
      })
    })

    it("should be served from harp server, not compiled", function(done){
      var rsp = fs.existsSync(path.join(outputPath, "css", "main-sass.css.map"))
      rsp.should.be.false
      request('http://localhost:' + port + '/css/main-sass.css.map', function (e, r, b) {
        r.statusCode.should.eql(200)
        done()
      })
    })

    it("should be valid JSON", function(done){
      request('http://localhost:' + port + '/css/main-sass.css.map', function (e, r, b) {
        r.headers.should.have.property("content-type", "application/json");
        var sourcemap = JSON.parse(r.body);
        sourcemap.should.have.property('version', '3');
        done()
      })
    })

    it("should contain appropriate content", function(done){
      request('http://localhost:' + port + '/css/main-sass.css.map', function (e, r, b) {
        var sourcemap = JSON.parse(r.body);
        sourcemap.sources.should.be.type('object')
        sourcemap.sources[0].should.be.type('string')
        sourcemap.sources[0].should.include('_part-sass.sass')
        sourcemap.sources[1].should.include('main-sass.sass')
        done()
      })
    })
  })

  describe("SCSS", function(){
    it("should be linked from harp server, not compiled", function(done){
      fs.readFile(path.join(outputPath, "css", "main-scss.css"), function(err, contents){
        contents.toString().should.not.include("/*# sourceMappingURL=main-scss.css.map */")
        request('http://localhost:' + port + '/css/main-scss.css', function (e, r, b) {
          b.should.startWith(contents.toString())
          b.should.endWith('/*# sourceMappingURL=main-scss.css.map */')
          done()
        })
      })
    })

    it("should be served from harp server, not compiled", function(done){
      var rsp = fs.existsSync(path.join(outputPath, "css", "main-scss.css.map"))
      rsp.should.be.false
      request('http://localhost:' + port + '/css/main-scss.css.map', function (e, r, b) {
        r.statusCode.should.eql(200)
        done()
      })
    })

    it("should be valid JSON", function(done){
      request('http://localhost:' + port + '/css/main-scss.css.map', function (e, r, b) {
        r.headers.should.have.property("content-type", "application/json");
        var sourcemap = JSON.parse(r.body);
        sourcemap.should.have.property('version', '3');
        done()
      })
    })

    it("should contain appropriate content", function(done){
      request('http://localhost:' + port + '/css/main-scss.css.map', function (e, r, b) {
        var sourcemap = JSON.parse(r.body);
        sourcemap.sources.should.be.type('object')
        sourcemap.sources[0].should.be.type('string')
        sourcemap.sources[0].should.include('_part-scss.scss')
        sourcemap.sources[1].should.include('main-scss.scss')
        done()
      })
    })
  })

  describe("STYL", function(){
    it("should be linked from harp server, not compiled", function(done){
      fs.readFile(path.join(outputPath, "css", "main-styl.css"), function(err, contents){
        contents.toString().should.not.include("/*# sourceMappingURL=main-styl.css.map */")
        request('http://localhost:' + port + '/css/main-styl.css', function (e, r, b) {
          b.should.startWith(contents.toString())
          b.should.endWith('/*# sourceMappingURL=main-styl.css.map */')
          done()
        })
      })
    })

    it("should be served from harp server, not compiled", function(done){
      var rsp = fs.existsSync(path.join(outputPath, "css", "main-styl.css.map"))
      rsp.should.be.false
      request('http://localhost:' + port + '/css/main-styl.css.map', function (e, r, b) {
        r.statusCode.should.eql(200)
        done()
      })
    })

    it("should be valid JSON", function(done){
      request('http://localhost:' + port + '/css/main-styl.css.map', function (e, r, b) {
        r.headers.should.have.property("content-type", "application/json");
        var sourcemap = JSON.parse(r.body);
        sourcemap.should.have.property('version', '3');
        done()
      })
    })

    it("should contain appropriate content", function(done){
      request('http://localhost:' + port + '/css/main-styl.css.map', function (e, r, b) {
        var sourcemap = JSON.parse(r.body);
        sourcemap.sources.should.be.type('object')
        sourcemap.sources[0].should.be.type('string')
        sourcemap.sources[0].should.include('_part-styl.styl')
        sourcemap.sources[1].should.include('main-styl.styl')
        done()
      })
    })
  })

  after(function(done){
    exec("rm -rf " + outputPath, function(){
      done()
    })
  })

})
