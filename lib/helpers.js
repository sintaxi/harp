var fs      = require('fs')
var path    = require('path')
var mime    = require('mime-types')
var terraform = require('terraform')
var fse     = require('fs-extra')
var envy    = require('envy-json')


exports.buildFallbackPriorityList = function(filePath){
  var list = []
  var popAndPush = function(arr){
    if (arr.length === 1) return list
    arr.pop()    
    var path200 = arr.join("/") + "/200.html"
    var path404 = arr.join("/") + "/404.html"
    var list200 = terraform.helpers.buildPriorityList(path200)
    var list404 = terraform.helpers.buildPriorityList(path404)
    list = list.concat(list200).concat(list404)
    return popAndPush(arr)
  }
  return popAndPush(filePath.split("/"))
}


/**
 *
 * Normalize Url
 *
 * - removes querystring
 * - removes extra slashes
 * - changes `/` to `/index.html`
 */

exports.normalizeUrl = function(url){

  // take off query string
  var base = unescape(url.split('?')[0])

  /**
   * Normalize Path
   *
   * Note: This converts unix paths to windows path on windows
   * (not sure if this is a good thing)
   */
  var file_path = path.normalize(base)

  // index.html support
  if (path.sep == file_path[file_path.length - 1]) file_path += 'index.html'

  return file_path
}


/**
 *
 * Mime Type
 *
 * returns type of the file
 *
 * TODO: reference ext from terraform
 */

exports.mimeType = function(source){
  var ext = path.extname(source)

  if(['.jade', '.md', '.ejs'].indexOf(ext)  !== -1){
    return mime.lookup('html')
  }else if(['.less', '.styl', '.scss', '.sass'].indexOf(ext)  !== -1){
    return mime.lookup('css')
  } else if (['.js', '.coffee'].indexOf(ext) !== -1) {
    return mime.lookup('js')
  } else {
    return mime.lookup(source)
  }

}


/**
 *
 * Walk directory for files
 *
 * recursive function that returns the directory tree
 * http://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
 *
 */

var walk = function(dir, done) {
  var results = []

  fs.readdir(dir, function(err, list) {
    if (err){
      return done(err)
    }
    var pending = list.length

    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file)
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res)
            if (!--pending) done(null, results)
          })
        } else {
          results.push(file)
          if (!--pending) done(null, results)
        }
      })
    })
  })

}


/**
 *
 * Fetch all the file paths for a directory.
 * returns and array of all the relative paths.
 *
 */

exports.ls = function(dir, callback) {
  walk(dir, function(err, results){
    var files = []
    results.map(function(file){ files.push(path.relative(dir, file)) })
    callback(null, files)
  })
}


/**
 * Setup
 *
 * This is the style and configuration of a Harp Application.
 * returns object with contents of Harp.json and application style
 *
 *   {
 *     "projectPath" : "/path/to/app",
 *     "publicPath"  : "/path/to/app/public",
 *     "config"      : { ... }
 *   }
 */

exports.setup = function(projectPath, env){
  if(!env) env = "development"

  try{
    var configPath  = path.join(projectPath, "harp.json")
    var contents    = fs.readFileSync(configPath).toString()
    var publicPath  = path.join(projectPath, "public")
  }catch(e){
    try{
      var configPath  = path.join(projectPath, "_harp.json")
      var contents    = fs.readFileSync(configPath).toString()
      var publicPath  = projectPath
    }catch(e){
      var contents    = "{}"
      var publicPath  = projectPath
    }
  }

  // not sure what this does anymore.
  if(!contents || contents.replace(/^\s\s*/, '').replace(/\s\s*$/, '') == ''){
    contents = '{}'
  }

  // attempt to parse the file
  try{
    var cfg = JSON.parse(contents)
  }catch(e){
    e.source    = "JSON"
    e.dest      = "CONFIG"
    e.message   = e.message
    e.filename  = configPath
    e.stack     = contents
    e.lineno    = -1
    throw new terraform.helpers.TerraformError(e)
  }

  if(!cfg.hasOwnProperty('globals')) cfg['globals'] = {}

  cfg.globals.environment = process.env.NODE_ENV || env

  // replace values that look like environment variables
  // e.g. '$foo' -> process.env.foo
  cfg = envy(cfg)

  return {
    cwd         : process.cwd(),
    projectPath : projectPath,
    publicPath  : publicPath,
    config      : cfg
  }

}


/**
 *
 * Template for outputing Less errors.
 *
 */

exports.cssError = function(error){
  var body = '' +

  'body{' +
    'margin:0;' +
  '}' +

  'body:before {' +
    'display: block;'+
    'white-space: pre;' +
    'content: "'+ error.error.source +' -> ' + error.error.dest + ' (' + error.error.message + ') ' + error.error.filename + '";'+
    'color: #444;'+
    'background-color: #fefe96;' +
    'padding: 40px 40px;'+
    'margin: 0;'+
    'font-family: monospace;'+
    'font-size: 14px;'+
  '}'

  return body
}


/**
 *
 * Will Collide
 *
 * Returns true if first path is in the line of fire of the second path.
 * ie: if we delete the second path will the first path be affected?
 */

var willCollide = exports.willCollide = function(projectPath, outputPath){
  var projectPath   = path.resolve(projectPath)
  var outputPath    = path.resolve(outputPath)
  var relativePath  = path.relative(projectPath, outputPath)
  var arr           = relativePath.split(path.sep)
  var result        = true;

  arr.forEach(function(i){
    if(i !== "..") result = false
  })

  /**
   * for @kennethormandy ;)
   */
  if ([path.sep, "C:\\"].indexOf(outputPath) !== -1) result = true

  /**
   * For #400
   */
  if (projectPath === outputPath) result = true

  return result
}


/**
 *
 * Will Allow
 *
 * Returns `true` if we feel projectPath is safe from the output path.
 * For this to be the case. The outputPath must live only one directory
 * back from the projectPath and the projectPath must live in a directory
 * starting with an underscore.
 */

exports.willAllow = function(projectPath, outputPath){
  var projectPath   = path.resolve(projectPath)
  var outputPath    = path.resolve(outputPath)
  var relativePath  = path.relative(projectPath, outputPath)
  var arr           = relativePath.split(path.sep)

  if(willCollide(projectPath, outputPath)){
    if(relativePath === ".."){
      if(projectPath.split(path.sep)[projectPath.split(path.sep).length - 1][0] == "_"){
        return true
      }else{
        return false
      }
    }else{
      return false
    }
  }else{
    return true
  }
}


/**
 * Prime
 * (Disk I/O)
 *
 * Cleans out a directory but ignores one (optionally).
 *
 * primePath: Absolute Path
 * options: Object
 *    ignore: Absolute Path || Relative (to delete)
 *
 * This is a powerful Function so take it seriously.
 *
 */

exports.prime = function(primePath, options, callback){

  if(!callback){
    callback = options
    options = {}
  }

  /**
   * Options (only one)
   */
  var ignorePath = options.ignore
    ? path.resolve(primePath, options.ignore)
    : null

  // Absolute paths are predictable.
  var primePath = path.resolve(primePath)

  fse.mkdirp(primePath, function(){
    fse.readdir(primePath, function(error, contents){

      /**
       * Delete each item in the directory in parallel. Thanks Ry!
       */

      if(contents.length == 0) return callback()

      var total = contents.length
      var count = 0


      contents.forEach(function(i){
        var filePath  = path.resolve(primePath, i)
        var gitRegExp = new RegExp(/^.git/)

        /**
         * We leave `.git`, `.gitignore`, and project path.
         */
        if(filePath === ignorePath || i.match(gitRegExp)){
          count++
          if(count == total) callback()
        }else{
          fse.remove(filePath, function(err){
            count++
            if(count == total) callback()
          })
        }
      })

    })
  })

}


/**
 * Stacktrace
 *
 * Formats a stactrace
 *
 *
 * This is a powerful Function so take it seriously.
 *
 */

exports.stacktrace = function(str, options){
  var lineno  = options.lineno  || -1
  var context = options.context || 8
  var context = context = context / 2
  var lines   = ('\n' + str).split('\n')
  var start   = Math.max(lineno - context, 1)
  var end     = Math.min(lines.length, lineno + context)

  if(lineno === -1) end = lines.length

  var pad     = end.toString().length

  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start
    return (curr == lineno ? ' > ' : '   ')
      + Array(pad - curr.toString().length + 1).join(' ')
      + curr
      + '| '
      + line
  }).join('\n')

  return context
}
