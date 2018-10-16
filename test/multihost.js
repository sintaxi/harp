var should      = require("should")
var request     = require('request')
var path        = require("path")
var fs          = require("fs")
var exec        = require("child_process").exec
var harp        = require("../");
var cherio      = require("cheerio");

describe("multihost", function(){

  var projectPath = path.join(__dirname, "apps/multihost");
  var port = 8104;
  var $;

  var urls = [];

  before(function(done){
    harp.multihost(projectPath, { port: port }, function(errors){
      done();
    });
  });

  it("should return list of apps", function(done){
    request("http://localhost:" + port + "/", function(e,r,b){
      r.statusCode.should.eql(200)
      $ = cherio.load(b);
      urls = $(".projects A");
      $(".project-name").length.should.eql(4)
      done();
    });
  });

  it("harp-apps should be served on a compatible URL", function(done) {
    var sites = [];
    for (var i = 0; i < urls.length; i++) {
      sites.push($(urls[i]).attr("href"));
    }
    sites.should.containEql('http://app.lvh.me:' + port);
    done();
  });

  // This test loads the index page, then navigates to each app, checking the heading.
  // Each app has its own heading, and there should be the same number as links followed.
  // it("apps should not overlap", function(done){
  //   var len = urls.length;
  //   var titles = [];
  //   for (var i = 0; i < len; i++) {
  //     (function(i){
  //       var site = $(urls[i]).attr('href');
  //       request(site, function(e,r,b) {
  //         $ = cherio.load(b);
  //         r.statusCode.should.eql(200);
  //         titles.push($("h1").text());
  //         if (i+1 == len) {
  //           arrayUnique(titles).length.should.eql(len)
  //         }
  //       });
  //     })(i)
  //   }
  //   done();
  // });

  var arrayUnique = function(a) {
    return a.reduce(function(p, c) {
      if (p.indexOf(c) < 0) p.push(c);
      return p;
    }, []);
  };
});
