var path        = require('path')
var fs          = require('fs-extra')
var terraform   = require('terraform')
var async       = require('async')
var connect     = require('connect')
var mime        = require('mime')
var cors        = require('cors')
var helpers     = require('./helpers')
var middleware  = require('./middleware')
var pkg         = require('../package.json')
var browserify  = require('browserify')
var watchify    = require('watchify')
var url = require("url")




/**
 * Server
 *
 * Host a single Harp application.
 *
 */

exports.server = function(dirPath, options, callback){
  var cjs = {}
  var app = connect()
  app.use(middleware.regProjectFinder(dirPath))
  app.use(middleware.setup)
  app.use(middleware.basicAuth)

  if(options.cors) {
    app.use(cors({origin: options.cors}))
  }

  app.use(middleware.underscore)
  
  app.use(function(req, rsp, next){
    var pathname = url.parse(req.url).pathname.replace(/^\/|\/$/g, '')
    if (cjs.hasOwnProperty(pathname)){
      rsp.statusCode = 200
      rsp.end(cjs[pathname])
    } else {
      return next()  
    }
  })

  app.use(middleware.mwl)
  app.use(middleware.static)
  app.use(middleware.poly)
  app.use(middleware.process)
  app.use(middleware.fallback)

  try {
    var setup = helpers.setup(dirPath)  
  } catch(e) {
    var setup = { publicPath: dirPath }
  }
  

  var b = browserify({
    entries: [setup.publicPath + "/bundle.cjs"],
    cache: {},
    packageCache: {},
    plugin: [watchify]
  })

  var update = function(info){
    //b.bundle().pipe(fs.createWriteStream(dirPath + "/bundle.js"))
    var chunks = []
    var stream = b.bundle()

    stream.on("data", function(chunk){
      chunks.push(chunk)
    })

    stream.on("end", function(){
      cjs["bundle.js"] = Buffer.concat(chunks)
    })

  }
 
  b.on('update', update)

  update()
 
  // function bundle() {
  //   console.log(dirPath + "/bundle.cjs")
  //   b.bundle()
  //   //_stdout.write(util.format.apply(this, arguments) + '\n')
  //   //b.bundle().pipe(fs.createWriteStream('output.js'));
  // }

  return app.listen(options.port || 9966, options.ip, function(){
    app.projectPath = dirPath
    callback.apply(app, arguments)
  })
}


/**
 * Multihost
 *
 * Host multiple Harp applications.
 *
 */

exports.multihost = function(dirPath, options, callback){
  var app = connect()
  app.use(middleware.notMultihostURL)
  app.use(middleware.index(dirPath))
  app.use(middleware.hostProjectFinder(dirPath))
  app.use(middleware.setup)
  app.use(middleware.basicAuth)
  app.use(middleware.underscore)
  app.use(middleware.mwl)
  app.use(middleware.static)
  app.use(middleware.poly)
  app.use(middleware.process)
  app.use(middleware.fallback)
  app.listen(options.port || 9000, callback)
}

/**
 * Mount
 *
 * Offer the asset pipeline as connect middleware
 *
 */

exports.mount = function(mountPoint, root){

  if(!root){
    root = mountPoint
    mountPoint = null
  }else{
    var rx = new RegExp("^" + mountPoint)
  }

  var finder = middleware.regProjectFinder(root)

  return function(req, rsp, next){

    if(rx){
      if(!req.url.match(rx)) return next()
      var originalUrl = req.url
      req.url         = req.url.replace(rx, "/")
    }

    finder(req, rsp, function(){
      middleware.setup(req, rsp, function(){
        middleware.static(req, rsp, function(){
          middleware.poly(req, rsp, function(){
            middleware.process(req, rsp, function(){
              if(originalUrl) req.url = originalUrl
              next()
            })
          })
        })
      })
    })
  }
}


/**
 * Pipeline
 *
 * Offer the asset pipeline as connect middleware
 *
 */

exports.pipeline = function(root){
  console.log("Deprecated, please use MOUNT instead, this will be removed in a future version.");
  var publicPath = path.resolve(root)
  var terra = terraform.root(publicPath)

  return function(req, rsp, next){
    var normalizedPath  = helpers.normalizeUrl(req.url)
    var priorityList    = terraform.helpers.buildPriorityList(normalizedPath)
    var sourceFile      = terraform.helpers.findFirstFile(publicPath, priorityList)

    if(!sourceFile) return next()

    terra.render(sourceFile, function(error, body){
      if(error) return next(error)
      if(!body) return next() // 404

      var outputType = terraform.helpers.outputType(sourceFile)
      var mimeType   = helpers.mimeType(outputType)
      var charset    = mime.charsets.lookup(mimeType)
      rsp.statusCode = 200
      rsp.setHeader('Content-Type', mimeType + (charset ? '; charset=' + charset : ''))
      rsp.setHeader('Content-Length', Buffer.byteLength(body, charset));
      rsp.end(body)
    })

  }

}

exports.pkg = pkg

/**
 * Export middleware
 *
 * Make sure middleware is accessible
 * when using harp as a library
 *
 */
exports.middleware = middleware;

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

  if(!callback && typeof outputPath === "function"){
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
    outputPath = path.resolve(projectPath, outputPath)
    var setup  = helpers.setup(projectPath, "production")
    var terra   = terraform.root(setup.publicPath, setup.config.globals)
  }catch(err){
    return callback(err)
  }


  /**
   * Protect the user (as much as possible) from compiling up the tree
   * resulting in the project deleting its own source code.
   */

  if(!helpers.willAllow(projectPath, outputPath)){
    return callback({
      type: "Invalid Output Path",
      message: "Output path cannot be greater then one level up from project path and must be in directory starting with `_` (underscore).",
      projectPath: projectPath,
      outputPath: outputPath
    })
  }


  /**
   * Compile and save file
   */

  var compileFile = function(file, done){
    process.nextTick(function () {
      terra.render(file, function(error, body){
        if(error){
          done(error)
        }else{
          if(body){
            var dest = path.resolve(outputPath, terraform.helpers.outputPath(file))
            fs.mkdirp(path.dirname(dest), function(err){
              fs.writeFile(dest, body, done)
            })
          }else{
            if (file === "bundle.cjs"){

              var b = browserify({
                entries: [path.resolve(setup.publicPath, "bundle.cjs")],
                cache: {},
                packageCache: {},
                plugin: []
              })

              var dest   = path.resolve(outputPath, "bundle.js")
              var chunks = []
              var stream = b.bundle()

              stream.on("data", function(chunk){
                chunks.push(chunk)
              })

              stream.on("end", function(){
                fs.writeFile(dest, Buffer.concat(chunks), done)
              })

            } else {
              done()  
            }
          }
        }
      })
    })
  }


  /**
   * Copy File
   *
   * TODO: reference ignore extensions from a terraform helper.
   */
  var copyFile = function(file, done){
    var ext = path.extname(file)
    if(!terraform.helpers.shouldIgnore(file) && [".jade", ".ejs", ".md", ".styl", ".less", ".scss", ".sass", ".coffee", ".cjs"].indexOf(ext) === -1){
      var localPath = path.resolve(outputPath, file)
      fs.mkdirp(path.dirname(localPath), function(err){
        fs.copy(path.resolve(setup.publicPath, file), localPath, done)
      })
    }else{
      done()
    }
  }

  /**
   * Scan dir, Compile Less and Jade, Copy the others
   */

  helpers.prime(outputPath, { ignore: projectPath }, function(err){
    if(err) console.log(err)

    helpers.ls(setup.publicPath, function(err, results){
      async.each(results, compileFile, function(err){
        if(err){
          callback(err)
        }else{
          async.each(results, copyFile, function(err){
            setup.config['harp_version'] = pkg.version
            delete setup.config.globals
            callback(null, setup.config)
          })
        }
      })
    })
  })

}
