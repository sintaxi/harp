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