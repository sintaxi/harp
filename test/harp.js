var nixt = require('nixt')
var path = require('path')
var fs = require('fs-extra')

describe("harp init", function() {

  beforeEach(function(done){
    fs.remove(path.join("/tmp", "harp"), function(err){
      fs.mkdirp(path.join("/tmp", "harp"), done)
    })
  })

  it("downloads the default boilerplate if it's not set", function(done) {
    this.timeout(10000);
    nixt()
      .run('harp init ' +  path.join('/tmp', 'harp'))
      // .stdout(/Downloading.*harp-boilerplates\/default/)
      // .stdout(/Initialized project at \/tmp\/harp/)
      .exist(path.join('/tmp', 'harp', '404.jade'))
      .exist(path.join('/tmp', 'harp', '_layout.jade'))
      .exist(path.join('/tmp', 'harp', 'index.jade'))
      .exist(path.join('/tmp', 'harp', 'main.less'))
      .end(done)
  })

  it("defaults to the harp-boilerplates github org when given a shorthand pattern", function(done) {
    this.timeout(10000);
    nixt()
      .run('harp init ' + path.join('/tmp', 'harp') + ' -b hb-start')
      .stdout(/Downloading.*harp-boilerplates\/hb-start/)
      .exist('/tmp/harp/public')
      .end(done)
  })

  it("honors -b option when given a user/repo pattern", function(done) {
    this.timeout(10000);
    nixt()
      .run('harp init ' + path.join('/tmp', 'harp') + ' -b zeke/harp-sample')
      .stdout(/Downloading.*zeke\/harp-sample/)
      .exist(path.join('/tmp', 'harp', 'README.md'))
      .exist(path.join('/tmp', 'harp', 'index.jade'))
      .end(done)
  })

  it("doesn't overwrite an existing directory", function(done) {
    nixt()
      .run('harp init ' + path.join('/tmp', 'harp'))
      .end(function() {
        nixt()
          .run('harp init ' + path.join('/tmp', 'harp'))
          .stdout(/Sorry,.*must be empty/)
          .end(done)
      })
  })

})
