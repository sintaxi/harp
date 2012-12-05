var path    = require("path")
var fse     = require("fs-extra")
var helpers = require("./helpers")
var parsers = require("./parsers")
var mkdirp  = require("mkdirp")
var fs      = require("fs")
var async   = require("async")

module.exports = function(projectPath, outputPath, callback){
  if(!callback){
    callback   = outputPath
    outputPath = "output"
  }
  
  if(!outputPath){
    outputPath = "output"
  }
  
  outputPath = path.resolve(projectPath, outputPath)
  var publicPath = path.resolve(projectPath, "public")
  
  // scan dir
  helpers.ls(publicPath, function(err, results){
    
    // write jade
    results.forEach(function(f){
      parsers.jade(path.resolve(publicPath, f), {}, function(err, html){
        if(err){
          if(err !== "NoMatch"){
            console.log(err)
          }
        }else{
          var outputFilePath = path.resolve(outputPath, f).replace(".jade", ".html")
          var outputDirPath  = path.dirname(outputFilePath)
          mkdirp(outputDirPath, function(){
            fs.writeFile(outputFilePath, html, function(err){
              console.log("wrote", outputFilePath)
            })            
          })
        }
      })
    })
    
    // compile everything else (expept jade)
    results.forEach(function(f){
      var ext = path.extname(f)
      if([".jade"].indexOf(ext) == -1){
        var outputFilePath = path.resolve(outputPath, f)
        var outputDirPath  = path.dirname(outputFilePath)
        mkdirp(outputDirPath, function(err){
          fse.copy(path.resolve(publicPath, f), outputFilePath, function(err){})  
        })
      }
    })
    
    callback(null, results)
  })
  

  // very basic
  //
  // fse.copy(publicPath, outputPath, function(err){
  //   if(err){
  //     callback(err)
  //   }else{
  //     callback(null, outputPath)
  //   }
  // })
}