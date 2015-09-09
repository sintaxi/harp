var nixt = require('nixt')
var path = require('path')
var fs = require('fs-extra')
var should = require('should')
var harp = require('../')

describe("harp init", function() {

  beforeEach(function(done){
    fs.remove(path.join('test', 'out', 'harp'), function(err){
      fs.mkdirp(path.join('test', 'out', 'harp'), done)
    })
  })

  afterEach(function(done) {
    fs.remove(path.join('test', 'out', 'harp'), done)
  })

  it("downloads the default boilerplate if it's not set", function(done) {
    this.timeout(10000);
    nixt()
      .run('node ./bin/harp init ' +  path.join('test', 'out', 'harp'))
      // .stdout(/Downloading.*harp-boilerplates\/default/)
      // .stdout(/Initialized project at \test/out\/harp/)
      .end(function () {
        fs.existsSync(path.join('test', 'out', 'harp', '404.jade')).should.not.be.false
        fs.existsSync(path.join('test', 'out', 'harp', '_layout.jade')).should.not.be.false
        fs.existsSync(path.join('test', 'out', 'harp', 'index.jade')).should.not.be.false
        fs.existsSync(path.join('test', 'out', 'harp', 'main.less')).should.not.be.false
        done()
      })
  })

  it("defaults to the harp-boilerplates github org when given a shorthand pattern", function(done) {
    this.timeout(10000);
    nixt()
      .run('node ./bin/harp init ' + path.join('test', 'out', 'harp') + ' -b hb-start')
      // .stdout(/Downloading.*harp-boilerplates\/hb-start/)
    should.exist('test/out/harp/public')
    done()
  })

  it("honors -b option when given a user/repo pattern", function(done) {
    this.timeout(10000);
    nixt()
      .run('./bin/harp init ' + path.join('test', 'out', 'harp') + ' -b zeke/harp-sample')
      // .stdout(/Downloading.*zeke\/harp-sample/)
    should.exist(path.join('test', 'out', 'harp', 'README.md'))
    should.exist(path.join('test', 'out', 'harp', 'index.jade'))
    done()
  })

  it("doesn't overwrite an existing directory", function(done) {
    nixt()
      .run('./bin/harp init ' + path.join('test', 'out', 'harp'))
      .end(function() {
        nixt()
          .run('harp init ' + path.join('test', 'out', 'harp') + ' -b hb-default-sass')
          .end(function() {
            should.not.exist(fs.exists(path.join('test', 'out', 'harp', 'main.sass')))
            done()
          })
      })
  })

})
