
var path        = require("path")
var fs          = require("fs")
var pkg         = require('../package.json')
var fse         = require("fs-extra")
var polymer     = require('polymer')
var mkdirp      = require("mkdirp")
var helpers     = require("./helpers")
var async       = require("async")
var connect     = require("connect")
var middleware  = require("./middleware")


/**
 * Server
 *
 * Host a single Harp Application.
 *
 */

exports.server = function(dirPath, options, callback){
  connect.createServer(
    middleware.regProjectFinder(dirPath),
    middleware.static,
    middleware.parseHarpConfig,
    middleware.poly,
    middleware.process,
    middleware.customNotFound,
    middleware.devFallbackNotFound
  ).listen(options.port || 9966, callback)
}


/**
 * Multihost
 *
 * Host a single Harp Application.
 *
 */

exports.multihost = function(dirPath, options, callback){
  connect.createServer(
    middleware.notMultihostURL,
    middleware.index(dirPath),
    middleware.hostProjectFinder(dirPath),
    middleware.static,
    middleware.parseHarpConfig,
    middleware.poly,
    middleware.process,
    middleware.customNotFound,
    middleware.devFallbackNotFound
  ).listen(options.port || 9966, callback)
}


/**
 * Compile
 *
 * Compiles Single Harp Application.
 *
 */

exports.compile = function(projectPath, outputPath, callback){


  /**
   * Both projectPath and outputPath are optional
   */

  if(!callback){
    callback   = outputPath
    outputPath = "www"
  }

  if(!outputPath){
    outputPath = "www"
  }


  /**
   * Setup all the paths and collect all the data
   */

  try{
    outputPath      = path.resolve(projectPath, outputPath)
    var publicPath  = path.resolve(projectPath, "public")
    var config      = helpers.config(projectPath, "production")
  }catch(err){
    return callback({ status: 400, message: "Invalid harp.json File", dump: err })
  }

  var poly = polymer.root(path.join(projectPath, 'public'), config.globals)

  /**
   * Compile and save file
   */

  var compileFile = function(file, done){
    // TODO: ignore underscore
    //
    poly.render(file, function(error, body){
      if(error){
        done({ status: 400, message: "Template Render Error", dump: error })
      }else{
        if(body){
          var dest = path.resolve(outputPath, polymer.helpers.outputPath(file))
          mkdirp(path.dirname(dest), function(err){
            fs.writeFile(dest, body, done)
          })
        }else{
          done()
        }
      }
    })

  }


  /**
   * Copy File
   */
  // TODO: ignore underscore
  var copyFile = function(file, done){
    var ext = path.extname(file)
    if(!polymer.helpers.shouldIgnore(file) && [".jade", ".less", ".md"].indexOf(ext) === -1){
      var localPath = path.resolve(outputPath, file)
      mkdirp(path.dirname(localPath), function(err){
        fse.copy(path.resolve(publicPath, file), localPath, done)
      })
    }else{
      done()
    }
  }


  /**
   * Scan dir, Compile Less and Jade, Copy the others
   */

  fse.remove(outputPath, function(err){
    helpers.ls(publicPath, function(err, results){
      async.forEach(results, compileFile, function(err){
        if(err){
          callback(err)
        }else{
          async.forEach(results, copyFile, function(err){
            config['harp_version'] = pkg.version
            delete config.globals
            callback(null, config)
          })
        }
      })
    })
  })

}

