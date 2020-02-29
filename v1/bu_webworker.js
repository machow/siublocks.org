self.languagePluginUrl = 'https://pyodide.cdn.iodide.io/'

const dispatcher = {
  dispatch (action, data, id) {
    console.log("webworker action:", action)
    return this[action](data)
      .then(data => self.postMessage({action, status: 'success', data, id}))
      .catch(data => self.postMessage({action, status: 'error', data, id}))
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
