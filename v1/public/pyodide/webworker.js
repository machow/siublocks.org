//self.languagePluginUrl = 'https://pyodide.cdn.iodide.io/'
self.languagePluginUrl = './'

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
      languagePluginLoader.then(() => dispatcher.dispatch(action, data, id))
  }
}
