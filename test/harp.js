var nixt = require('nixt')

describe("harp init", function() {

  beforeEach(function(done){
    nixt()
      .run("rm -rf /tmp/harp && mkdir /tmp/harp")
      .exist("/tmp/harp")
      .end(done)
  })

  it("downloads the default boilerplate if it's not set", function(done) {
    this.timeout(10000);
    nixt()
      .run('./bin/harp init /tmp/harp')
      .stdout(/Downloading.*harp-boilerplates\/default/)
      .stdout(/Initialized project at \/tmp\/harp/)
      .exist('/tmp/harp/404.jade')
      .exist('/tmp/harp/_layout.jade')
      .exist('/tmp/harp/index.jade')
      .exist('/tmp/harp/main.less')
      .end(done)
  })

  it("defaults to the harp-boilerplates github org when given a shorthand pattern", function(done) {
    this.timeout(10000);
    nixt()
      .run('./bin/harp init /tmp/harp -b hb-start')
      .stdout(/Downloading.*harp-boilerplates\/hb-start/)
      .exist('/tmp/harp/public')
      .end(done)
  })

  it("honors -b option when given a user/repo pattern", function(done) {
    this.timeout(10000);
    nixt()
      .run('./bin/harp init /tmp/harp -b zeke/harp-sample')
      .stdout(/Downloading.*zeke\/harp-sample/)
      .exist('/tmp/harp/README.md')
      .exist('/tmp/harp/index.jade')
      .end(done)
  })

  it("doesn't overwrite an existing directory", function(done) {
    nixt()
      .run('./bin/harp init /tmp/harp')
      .end(function() {
        nixt()
          .run('./bin/harp init /tmp/harp')
          .stdout(/Sorry,.*must be empty/)
          .end(done)
      })
  })

})