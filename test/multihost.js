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

  before(function(done){
    harp.multihost(projectPath, { port: port }, function(errors){
      done();
    });
  });

  it("should return list of apps", function(done){
    request("http://localhost:" + port + "/", function(e,r,b){
      r.statusCode.should.eql(200)
      $ = cherio.load(b);
      
      $(".project-name").length.should.eql(2)
      done();
    });
  });

});