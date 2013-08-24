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
  _relationship.push({ 'deps': deps, 'results': _.map(results, function(v, k, l){
      return k
    })
  })
  console.log('successfully set cache for ', deps)
}

// when deps changes, delete the compiled cache
exports.clearCache = function(dep){
  console.log('try clear cache for ', dep)
  for(var _i in _relationship ){
    var item = _relationship[_i]
    if(_.indexOf(item.deps, dep) >= 0){
      console.log('Debug: item = ', item)
      _.each(item.results, function(result, key){
          delete _files[key]
      })
      delete _relationship[_i]
      console.log('successfully delete cache for ', dep)
    }
  }
}

exports.getFile = function(filePath){
    return _files[filePath]
}

