/*
 * Simple Cache, it's just Object, it's simple and fast.
 *
 */
var _ = require('underscore')

// _files are simple {file_path: { body: ''; headers: '';}, ...} maps for
//  build http response
var _files = {}

// _relationship [{deps: ['r.coffee'], results: ['r.js']}, {} ...]
var _relationship = []

exports.setCache = function(results, deps){
  _.each(results, function(value, key, list){
    _files[key] = value
  })
  _relationship.push({ 
      'deps': deps,
      'results': _.map(results, function(v, k, l){
        return k
      })
  })
  // debug
  //console.log('_relationships:', _relationship)
  //console.log('_files:', _files)
}

// when deps changes, delete the compiled cache
exports.clearCache = function(dep){
  for(var _i in _relationship){
    var item = _relationship[_i]
    if(_.indexOf(item.deps, dep) >= 0){
      _.each(item.results, function(filepath){
          delete _files[filepath]
      })
      delete _relationship[_i]
    }
  }
  // debug
  //console.log('_relationships:', _relationship)
  //console.log('_files:', _files)
}

exports.getFile = function(filePath){
    return _files[filePath]
}

