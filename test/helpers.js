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
  
  describe("outputFilename", function(){
    
    it("should return html file if given html file", function(done){
      var result = helpers.outputFilename("foo.html")
      result.should.eql("foo.html")
      done()
    })
    
    it("should return html file if given jade file", function(done){
      var result = helpers.outputFilename("foo.jade")
      result.should.eql("foo.html")
      done()
    })
    
    it("should return html file if explicitly ask for", function(done){
      var result = helpers.outputFilename("foo.html.jade")
      result.should.eql("foo.html")
      done()
    })
    
    it("should return json file if explicitly ask for", function(done){
      var result = helpers.outputFilename("foo.json.jade")
      result.should.eql("foo.json")
      done()
    })
    
    it("should return file with no extension", function(done){
      var result = helpers.outputFilename("foo")
      result.should.eql("foo")
      done()
    })
    
  })
  
})