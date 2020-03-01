import es from 'event-stream'
import fs from 'fs'
import path from 'path'
import _ from 'lodash'
import vfs from 'vinyl-fs'
import fancyLog from 'fancy-log'
import pluginError from 'plugin-error'
import difference from 'array-difference'
import PugInheritance from 'pug-inheritance'
import PugDependencies from 'pug-dependencies'

const PLUGIN_NAME = 'gulp-pug-inheritance'

var GulpPugInheritance = (function() {
  'use strict'

  function GulpPugInheritance(options) {

    this.options = _.merge(this.DEFAULTS, options)
    this.stream = undefined
    this.errors = {}
    this.files = []
    this.filesPaths = []
    this.firstRun = false

    if (this.options.saveInTempFile === true) {
      this.tempFile = path.join(process.cwd(), this.options.tempFile)
      this.tempInheritance = this.getTempFile()
    }
  }

  GulpPugInheritance.prototype.DEFAULTS = {
    basedir: process.cwd(),
    extension: '.pug',
    skip: 'node_modules',
    saveInTempFile: false,
    tempFile: 'temp.pugInheritance.json',
    debug: false
  }

  GulpPugInheritance.prototype.getInheritance = function(path) {
    let inheritance = null
    try {
      inheritance = new PugInheritance(path, this.options.basedir, this.options)
    } catch (error) {
      this.throwError(error)
      return
    }
    return inheritance
  }

  GulpPugInheritance.prototype.throwError = function(error) {
    let alreadyShown

    if (this.errors[error.message]) {
      alreadyShown = true
    }

    clearTimeout(this.errors[error.message])
    this.errors[error.message] = setTimeout(() => {
      delete this.errors[error.message]
    }, 500) //debounce

    if (alreadyShown) { return }

    const err = new pluginError(PLUGIN_NAME, error)
    this.stream.emit("error", err)
  }

  GulpPugInheritance.prototype.getTempFile = function() {
    if (!fs.existsSync(this.tempFile)) {
      fs.writeFileSync(this.tempFile, JSON.stringify({}, null, 2), 'utf-8')
      this.firstRun = true
    }

    return require(this.tempFile)
  }

  GulpPugInheritance.prototype.setTempKey = function(path) {
    return path.replace(/\/|\\|\\\\|\-|\.|\:/g, '_')
  }

  GulpPugInheritance.prototype.getDependencies = function (file, pathToFile) {
    const filePath = (typeof file === 'object') ? file.path : pathToFile
    const pugDependencies = PugDependencies(path.relative(process.cwd(), filePath))
    const dependencies = []
    const fileRelative = path.join(process.cwd(), this.options.basedir)

    _.forEach(pugDependencies, (dependency) => {
      dependencies.push(path.relative(fileRelative, dependency))
    })
    return dependencies
  }

  GulpPugInheritance.prototype.updateTempInheritance = function( dependency ) {
    const cacheKey = this.setTempKey(dependency)
    const pathToFile = path.join(process.cwd(), this.options.basedir, path.normalize(dependency))
    if (this.tempInheritance[cacheKey]) {
      if (this.options.debug) {
        fancyLog(`[${PLUGIN_NAME}][Update] Get new inheritance of: "${dependency}"`)
      }

      this.tempInheritance[cacheKey] = {}
      this.tempInheritance[cacheKey] = this.getInheritance(pathToFile)
      this.tempInheritance[cacheKey].dependencies = this.getDependencies(dependency, pathToFile)
      this.tempInheritance[cacheKey].file = dependency
    }
  }

  GulpPugInheritance.prototype.updateDependencies = function(dependencies) {
    if (dependencies.length > 0) {
      _.forEach(dependencies, (dependency) => {
        this.updateTempInheritance(dependency)
      })
    }
  }

  GulpPugInheritance.prototype.setTempInheritance = function(file) {
    const cacheKey = this.setTempKey(file.relative)
    const inheritance = this.getInheritance(file.path)

    this.tempInheritance[cacheKey] = {}
    this.tempInheritance[cacheKey] = inheritance
    this.tempInheritance[cacheKey].dependencies = this.getDependencies(file)
    this.tempInheritance[cacheKey].file = file.relative

    if (this.firstRun === false) {
      this.updateDependencies(this.tempInheritance[cacheKey].dependencies)
    }

    return inheritance
  }

  GulpPugInheritance.prototype.resolveInheritance = function(file) {
    const cacheKey = this.setTempKey( file.relative )
    const date = Date.now()
    let inheritance = null
    let state = null

    if (this.options.saveInTempFile === false) {
      if (this.options.debug) { state = 'DEFAULT' }
      inheritance = this.getInheritance(file.path)
    } else {
      if (this.tempInheritance[cacheKey]  === undefined) {
        if (this.options.debug) { state = 'NEW' }
        inheritance = this.setTempInheritance(file)
      } else {
        const newDependencies = this.getDependencies(file)
        const oldDependencies = this.tempInheritance[cacheKey].dependencies
        const diff = difference(newDependencies, oldDependencies)

        if (newDependencies.length === oldDependencies.length) {
          if (this.options.debug) { state = 'CACHED' }
          inheritance = this.tempInheritance[cacheKey]
        } else {
          if (this.options.debug) { state = 'RECACHE' }
          this.tempInheritance[cacheKey].dependencies = undefined
          this.tempInheritance[cacheKey].dependencies = newDependencies
          inheritance = this.tempInheritance[cacheKey]
          this.updateDependencies(diff)
        }
      }
    }
    if (this.options.debug) {
      const timeElapsed = (Date.now() - date)
      fancyLog(`[${PLUGIN_NAME}][${state}] Get inheritance of: "${file.relative}" - ${timeElapsed}ms`)
    }

    return inheritance
  }

  GulpPugInheritance.prototype.writeStream = function(file) {
    if (file && file.contents.length) {
      this.files.push(file)
    }
  }

  GulpPugInheritance.prototype.endStream = function() {
    var _this = this
    if (this.files.length) {
      if (this.options.debug) {
        if (this.options.saveInTempFile === true) {
          if (this.firstRun === true) {
            fancyLog(`[${PLUGIN_NAME}] Plugin started for the first time. Save inheritances to a tempfile`)
          } else {
            fancyLog(`[${PLUGIN_NAME}] Plugin already started once. Get inheritances from a tempfile`)
          }
        }
      }

      _.forEach(this.files, (file) => {
        const inheritance = this.resolveInheritance(file)

        const fullpaths = _.map(inheritance.files, (file) => {
          return path.join(this.options.basedir, file)
        })

        this.filesPaths = _.union(this.filesPaths, fullpaths)
      })

      if (this.filesPaths.length) {
          vfs.src(this.filesPaths, {
            'base': this.options.basedir
          }).pipe(es.through(
            function(f) {
              _this.stream.emit('data', f)
            },
            function() {
              _this.stream.emit('end')
            }
          ))
      } else {
        this.stream.emit('end')
      }
    } else {
      this.stream.emit('end')
    }

    if (this.options.saveInTempFile === true) {
      if (_.size(this.tempInheritance) > 0) {
        _.forEach(this.tempInheritance, (tempInheritance) => {
          if (tempInheritance !== undefined) {
            const cacheKey = this.setTempKey(tempInheritance.file)
            const baseDir = path.join(process.cwd(), this.options.basedir, tempInheritance.file)
            if (!fs.existsSync(baseDir)) {
              if (this.options.debug) {
                fancyLog(`[${PLUGIN_NAME}][DELETE] Delete inheritance of: "${tempInheritance.file}"`)
              }
              this.updateDependencies(tempInheritance.dependencies)
              this.tempInheritance[cacheKey] = undefined
            }
          }
        })
      }

      fs.writeFileSync(this.tempFile, JSON.stringify(this.tempInheritance, null, 2), 'utf-8')
    }
  }

  GulpPugInheritance.prototype.pipeStream = function() {
    const _this = this
    function writeStream (file) {
      _this.writeStream(file)
    }
    function endStream () {
      _this.endStream()
    }
    this.stream = es.through(writeStream, endStream)
    return this.stream
  }

  return GulpPugInheritance
})()

module.exports = function(options) {
  var gulpPugInheritance = new GulpPugInheritance(options)
  return gulpPugInheritance.pipeStream()
}
