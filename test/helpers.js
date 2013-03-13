var should = require("should")
var helpers = require("../lib/helpers")

describe("helpers", function(){
  
  describe("walkData", function(){
    var globals = {
      "public": {
        "articles": {
          "data": {
            "hello-world": "You Found Me!"
          }
        }
      }
    }
    
    // var g = { contents:
    //    [ '404.html',
    //      'about.html',
    //      'feed.html',
    //      'foo.atom',
    //      'index.html',
    //      'profile.html' ],
    //   data: { '404': { layout: false } },
    //   articles:
    //    { contents: [ 'hello-world.html', 'you-half-assed-it.html' ],
    //      data: { 'hello-world': "found me", 'you-half-assed-it': "stuff" } },
    //   css: { contents: [ 'main.css' ] } }
    // 
    // var p = [ 'articles', 'hello-world' ]
    // 
    // it("should return local data", function(done){
    //   var result = helpers.walkData(p, g)
    //   result.should.eql("found me")
    //   done()
    // })

    it("should return null if no locals exist", function(done){
      var result = helpers.walkData(["public", "articles", "hello-brazil"], globals)
      should.not.exist(null)
      done()
    })

    it("should find the locals in large tree", function(done){
      var result = helpers.walkData(["public", "articles", "hello-world"], globals)
      result.should.eql("You Found Me!")
      done()
    })

    it("should find in shallow tree", function(done){
      var result = helpers.walkData(["hello-world"], globals.public.articles)
      result.should.eql("You Found Me!")
      done()
    })
  })
  
})