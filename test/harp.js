var nixt = require('nixt')
var path = require('path')
var fs = require('fs-extra')
var should = require('should')
var harp = require('../')
var exec = require("child_process").exec

describe("harp init", function() {

  var outputPath  = path.join(__dirname, "out/harp")

  beforeEach(function(done){
    fs.remove(outputPath, function(err){
      fs.mkdirp(outputPath, done)
    })
  })

  it("downloads the default boilerplate if it's not set", function(done) {
    this.timeout(10000);
    nixt()
      .run('node ./bin/harp init ./test/out/harp') // Tests don't work when this has a platform-specific path passed in, but it does work
      // .run('node .' + path.sep + 'bin' + path.sep + 'harp init ' + outputPath)
      // .stdout(/Downloading.*harp-boilerplates\/default/)
      // .stdout(/Initialized project at \test/out\/harp/)
      .end(function () {
        fs.existsSync(path.join(outputPath, '404.jade')).should.not.be.false
        fs.existsSync(path.join(outputPath, '_layout.jade')).should.not.be.false
        fs.existsSync(path.join(outputPath, 'index.jade')).should.not.be.false
        fs.existsSync(path.join(outputPath, 'main.less')).should.not.be.false
        done()
      })
  })

  it("defaults to the harp-boilerplates github org when given a shorthand pattern", function(done) {
    this.timeout(10000);
    nixt()
      .run('node ./bin/harp init ./test/out/harp -b hb-start')
      // .stdout(/Downloading.*harp-boilerplates\/hb-start/)
      .end(function () {
        fs.existsSync(path.join(outputPath, 'public', 'index.jade')).should.not.be.false
        fs.existsSync(path.join(outputPath, 'README.md')).should.not.be.false
        done()
      })
  })

  it("honors -b option when given a user/repo pattern", function(done) {
    this.timeout(10000);
    nixt()
      .run('node ./bin/harp init ./test/out/harp -b zeke/harp-sample')
      // .stdout(/Downloading.*zeke\/harp-sample/)
      .end(function () {
        fs.existsSync(path.join(outputPath, 'README.md')).should.not.be.false
        fs.existsSync(path.join(outputPath, 'index.jade')).should.not.be.false
        done()
      })
  })

  it("doesn't overwrite an existing directory", function(done) {
    nixt()
      .run('node ./bin/harp init ./test/out/harp')
      .end(function() {
        nixt()
          .run('node ./bin/harp harp init ./test/out/harp -b hb-default-sass')
          .end(function() {
            should.not.exist(fs.exists(path.join(outputPath, 'main.sass')))
            done()
          })
      })
  })

  after(function(done){
    exec("rm -rf " + outputPath, function() {
      done();
    })
  })

})


describe("harp server", function() {
  it("displays localhost if listening on 127.0.0.1", function(done) {
    this.timeout(10000);
    nixt()
      .stdout(/our server is listening at http:\/\/localhost:9000\//)
      .run('node ./bin/harp server -i 127.0.0.1')
      .end(done());
  })

  it('shows 0.0.0.0 by default', function(done) {
    this.timeout(10000);
    nixt()
      .stdout(/our server is listening at http:\/\/0.0.0.0:9000\//)
      .run('node ./bin/harp server')
      .end(done());
  })
})
