//self.languagePluginUrl = 'https://pyodide.cdn.iodide.io/'
//self.languagePluginUrl = './'
//self.languagePluginUrl = "https://siublocks.s3.amazonaws.com/pyodide/"
self.languagePluginUrl = "https://d1m5kcnvnah531.cloudfront.net/pyodide/"

// hack console.log
const consoleTee = {
  buffer: [],
  log: null,
  activate (cb) {
    const self = this
    this.log = console.log;
    console.log = function () {
      // TODO: join all args
      const msg = arguments[0]
      self.buffer.push(msg)
      if (cb) cb(msg)
      self.log.apply(this, Array.prototype.slice.call(arguments));
    }
  },
  deactivate () {
    console.log = this.log
  },
  reset () {
    this.buffer = []
  },
  flush () {
    var oldBuffer = this.buffer
    this.buffer = []
    return oldBuffer
  }
}

consoleTee.activate((msg) => {
  self.postMessage({action: "stdout", status: "success", data: msg})
})


// dispatcher ----
const dispatcher = {
  dispatch (action, data, id) {
    return this[action](data)
      .then(data => {
        const stdout = consoleTee.flush()
        self.postMessage({action, status: 'success', data: self.pyodide.globals.repr(data), id})
      })
      .catch(data => {
        const stdout = consoleTee.flush()
        self.postMessage({action, status: 'error', data, id})
      })
  },
  init () {
    importScripts('./pyodide.js')
    return languagePluginLoader.then(() => "python loaded")
  },
  runCode (data) {
    const keys = Object.keys(data);
    for (let key of keys) {
      if (key !== 'python') {
        // Keys other than python must be arguments for the python script.
        // Set them on self, so that `from js import key` works.
        self[key] = data[key];
      }
    }

    return self.pyodide.runPythonAsync(data.python, () => {})
  },
  loadPackage (data) {
    return self.pyodide.loadPackage(data)
  },
  echo (data) {
    return new Promise(() => data)
  }
}


var onmessage = function(e) { // eslint-disable-line no-unused-vars
  const {action, data, id} = e.data
  if (action == 'init') {
      dispatcher.dispatch('init', data, id)
  } else {
      // TODO: note that the catch here captures python SyntaxErrors, while the
      //       catch inside the dispatcher would capture errors encountered while
      //       executing code (here it's e.g. a runPythonAsync error)
      languagePluginLoader
        .then(() => dispatcher.dispatch(action, data, id))
        .catch((msg) =>self.postMessage({action, status: "error", data: msg, id}))
  }
}
