#!/usr/bin/env node

import { join } from "path"
import { get, each, is } from "funkis"
import pkg from "read-package-json"
import npm from "npm"

const paths = process.argv.slice(2)

npm.load(function(err, npm) {
  exitOnError(err, "Current directory is not part of an npm project.")

  pkg(join(npm.prefix, 'package.json'), console.error, false, (err, data) => {
    exitOnError(err)

    if (paths.length === 0) {
      print(data)
    } else {
      each(paths, function(path) {
        var property = get(data, path.split('.'))

        if (is(undefined, property)) {
          exitOnError(new Error, `No such property: ${path}`)
        }

        print(property)
      })
    }
  })
})

function exitOnError(e, msg, code) {
  if (e) {
    console.error(msg || "Unexpected error:\n\n" + e.message)
    process.exit(code || 1)
  }
}

function safe(name) {
  return name.replace(/[\.\-]/g, '_')
}

function print(property) {
  if (is(Object, property)) {
    each(property, function(field) {
      console.log(`${safe(field[0])}=${quote(json(field[1]))}`)
    })
  } else if (is(Array, property)) {
    each(property, function(value) {
      console.log(value)
    })
  } else {
    console.log(property)
  }
}

function quote(s) {
  return `"${s.replace(/^"|"$/g, '').replace(/\"/g, '\\"')}"`
}

function json(val) {
  return JSON.stringify(val)
}