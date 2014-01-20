var should      = require("should")
var request     = require('request')
var path        = require("path")
var fs          = require("fs")
var exec        = require("child_process").exec
var harp        = require("../")

describe("validate", function(){

  describe("err-invalid-config", function(){
    var projectPath = path.join(__dirname, "apps/err-invalid-config")

    it("should get error message for invalid harp.json", function(done){
      harp.validate(projectPath, function(error, res){
        should.exist(error)
        error.should.have.property("source")
        error.should.have.property("dest")
        error.should.have.property("filename")
        error.should.have.property("message")
        error.should.have.property("stack")
        error.should.have.property("lineno")
        done()
      })
    })
  })

  describe("err-invalid-data", function(){
    var projectPath = path.join(__dirname, "apps/err-invalid-data")

    it("should get error message for invalid _data.json", function(done){      
      harp.validate(projectPath, function(error, res){
        should.exist(error)
        error.should.have.property("source")
        error.should.have.property("dest")
        error.should.have.property("filename")
        error.should.have.property("message")
        error.should.have.property("stack")
        error.should.have.property("lineno")
        done()
      })
    })
  })

  describe("err-missing-public", function(){
    var projectPath = path.join(__dirname, "apps/err-missing-public")

    it("should get error message for invalid _data.json", function(done){
      harp.validate(projectPath, function(error){
        should.exist(error)
        error.should.have.property("source")
        error.should.have.property("dest")
        error.should.have.property("filename")
        error.should.have.property("message")
        error.should.have.property("stack")
        error.should.have.property("lineno")
        done()
      })
    })
  })

  describe("err-missing-public", function(){
    var projectPath = path.join(__dirname, "apps/err-invalid-vars")

    it("should get error message for invalid _data.json", function(done){
      harp.validate(projectPath, function(error){
        should.exist(error)
        error.should.have.property("source")
        error.should.have.property("dest")
        error.should.have.property("filename")
        error.should.have.property("message")
        error.should.have.property("stack")
        error.should.have.property("lineno")
        done()
      })
    })
  })

  describe("no error for valid project", function(){
    var projectPath = path.join(__dirname, "apps/app-style-root")

    it("no error for valid project", function(done){
      harp.validate(projectPath, function(error){
        should.not.exist(error)
        done()
      })
    })
  })

})
