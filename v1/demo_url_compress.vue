<template>
  <div class="container-editor container">
    <h1 class="title is-1">siublocks</h1>
    <div class="top-bar">
      <div class="is-pulled-right">
        <div>
          <span v-if="loading" class="top-bar-message">{{logMessage(logLast)}}</span>
          <pulse-loader :loading="loading" size="8px"></pulse-loader>
        </div>
      </div>
    </div>
    <div>
      <textarea v-model="content" @input="updateContentHash()" class="textarea textarea--code"></textarea>
    </div>
    <div class="buttons is-right">
      <button @click="run()" :disabled="loading" class ="button button-run" :class="{disabled: loading}">
        <span>run</span>
      </button>
    </div>
    <h2>result</h2>
    <pre>{{result}}</pre>
    <br>
    <h2>standard out</h2>
    <div class="output-stdout">
      <pre v-for="(entry, ii) in stdout"
           v-bind:key="ii"
           >{{entry}}</pre>
    </div>
    <br><br>
    <details>
      <summary>View log</summary>
      <div>
        <br>
        <input type="text" v-model="packageName">
        <button @click="loadPackage(packageName)">load package</button>
        <br>
        <pre v-for="(entry, ii) in log" v-bind:key="ii">{{entry}}</pre>
      </div>
    </details>
  </div>
</template>

<script>
/* eslint-disable */
const lz = require('lz-string')
window.lz = lz

const _ = require("lodash")
window._ = _

// janky store ----
const Vue = require('vue').default;
const Buefy = require('buefy').default;
require('buefy/dist/buefy.css')

Vue.use(Buefy)

var PulseLoader = require('vue-spinner/src/PulseLoader.vue').default;
window.pl = PulseLoader

//var script = document.createElement('script');
//script.src = "https://pyodide.cdn.iodide.io/pyodide.js"
//
//document.head.appendChild(script)

// vue component ----
const worker = new Worker('./pyodide/webworker.js')

const ACTION_MESSAGES = {
  "init": "initializing python",
  "runCode": "running code",
  "loadPackage": "loading package"
}

module.exports = {
  components: {PulseLoader},
  data: function() { 
    return {
      content: "for ii in range(1, 10): print(ii)",
      contentHash: "",
      stdout: [],
      result: null,
      packageName: "",
      loading: false,
      crntId: 0,
      log: [],
    }
  },
  computed: {
    logLast () {
      return this.log[this.log.length - 1]
    },
  },
  mounted () {
    this.$worker = worker

    // start pyodide
    this.dispatchWorker('init')
    this.loading = true

    worker.onerror = (e) => {
      console.log(`Error in pyodideWorker at ${e.filename}, Line: ${e.lineno}, ${e.message}`)
    }
    
    worker.onmessage = (e) => {
      const {action, status, data, id} = e.data
      console.log(e)
      this.updateLogResult(id, {status, data})

      if (action == "init" & status == "success") {
        this.loading = false
      }
      if (action == "runCode") {
        this.loading = false
        this.result = data
      }

      if (action == "stdout") {
        this.stdout.push(data)
      }

    }

  },
  methods: {
    run () {
      this.stdout = []
      this.dispatchWorker('runCode', {python: this.content})
      this.loading = true
    },
    loadPackage (name) {
      this.dispatchWorker('loadPackage', name)
    },
    dispatchWorker (action, data) {
      const id = this.log.push({action, data}) - 1
      this.$worker.postMessage({action, data, id})
    },
    updateLogResult (id, response) {
      const entry = this.log[id]
      this.log[id] = {...entry, response}
    },
    logMessage (entry) {
      const msg = ACTION_MESSAGES[entry["action"]]
      return msg || entry["action"]
    },
    updateContentHash: _.debounce(function() {
        this.contentHash = lz.compressToEncodedURIComponent(this.content) 
        window.location.hash = this.contentHash
    }, 1000)
  }
}
</script>

<style>

.top-bar {
  height: 30px;
}

.top-bar-message {
  padding-right: 8px;
}

.v-spinner {
  float: right;
}

.button-run {
  min-width: 200px;
}

.button-run {
  /*background-color: green;*/
}

.output-stdout > pre {
  padding-bottom: 0px;
}

/*
.button-run.disabled {
  background-color: lightgrey;
}
*/

.textarea--code {
  font-family: Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New, monospace;
}
</style>
