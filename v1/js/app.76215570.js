(function(t){function e(e){for(var o,i,s=e[0],c=e[1],u=e[2],d=0,p=[];d<s.length;d++)i=s[d],Object.prototype.hasOwnProperty.call(a,i)&&a[i]&&p.push(a[i][0]),a[i]=0;for(o in c)Object.prototype.hasOwnProperty.call(c,o)&&(t[o]=c[o]);l&&l(e);while(p.length)p.shift()();return r.push.apply(r,u||[]),n()}function n(){for(var t,e=0;e<r.length;e++){for(var n=r[e],o=!0,s=1;s<n.length;s++){var c=n[s];0!==a[c]&&(o=!1)}o&&(r.splice(e--,1),t=i(i.s=n[0]))}return t}var o={},a={app:0},r=[];function i(e){if(o[e])return o[e].exports;var n=o[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=t,i.c=o,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)i.d(n,o,function(e){return t[e]}.bind(null,o));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],c=s.push.bind(s);s.push=e,s=s.slice();for(var u=0;u<s.length;u++)e(s[u]);var l=c;r.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("63f4")},"57c3":function(t,e,n){"use strict";var o=n("ae14"),a=n.n(o);a.a},"58a9":function(t,e,n){"use strict";var o=n("70d8"),a=n.n(o);e["default"]=a.a},"70d8":function(t,e,n){n("a19a"),n("479a"),n("ae0a"),n("c9bd"),n("9ae1"),n("8faf"),n("a099"),n("26c2"),n("b085");var o=n("e46a");function a(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);e&&(o=o.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,o)}return n}function r(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?a(Object(n),!0).forEach((function(e){o(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var i=n("eb11");window.lz=i;var s=n("2ef0");window._=s;var c=n("2b0e").default,u=n("289d").default;n("5abe"),c.use(u);var l=n("8a5d").default;window.pl=l;var d=new Worker("./pyodide/webworker.js"),p={init:"initializing python",runCode:"running code",loadPackage:"loading package"};t.exports={components:{PulseLoader:l},data:function(){return{content:"for ii in range(1, 10): print(ii)\n\nii",contentHash:"",stdout:[],result:null,packageName:"",loading:!1,crntId:0,log:[]}},computed:{logLast:function(){return this.log[this.log.length-1]}},mounted:function(){var t=this;window.onfocus=function(e){window.location.hash.length&&(t.content=t.hashToContent())},window.location.hash.length&&(this.content=this.hashToContent()),this.$worker=d,this.dispatchWorker("init"),this.loading=!0,d.onerror=function(t){console.log("Error in pyodideWorker at ".concat(t.filename,", Line: ").concat(t.lineno,", ").concat(t.message))},d.onmessage=function(e){var n=e.data,o=n.action,a=n.status,r=n.data,i=n.id;t.updateLogResult(i,{status:a,data:r}),"init"==o&"success"==a&&(t.loading=!1),"runCode"==o&&(t.loading=!1,t.result=r),"stdout"==o&&t.stdout.push(r)}},methods:{run:function(){this.stdout=[],this.dispatchWorker("runCode",{python:this.content}),this.loading=!0},loadPackage:function(t){this.dispatchWorker("loadPackage",t)},dispatchWorker:function(t,e){var n=this.log.push({action:t,data:e})-1;this.$worker.postMessage({action:t,data:e,id:n})},updateLogResult:function(t,e){var n=this.log[t];this.log[t]=r({},n,{response:e})},logMessage:function(t){var e=p[t["action"]];return e||t["action"]},hashToContent:function(){var t=decodeURIComponent(window.location.hash.slice(1));return i.decompressFromEncodedURIComponent(t)},updateContentHash:s.debounce((function(){this.contentHash=i.compressToEncodedURIComponent(this.content),window.location.hash=this.contentHash}),1e3)}}},ae14:function(t,e,n){},b120:function(t,e,n){"use strict";var o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"container-editor container"},[n("h1",{staticClass:"title is-1"},[t._v("siublocks")]),n("div",{staticClass:"top-bar"},[n("div",{staticClass:"is-pulled-right"},[n("div",[t.loading?n("span",{staticClass:"top-bar-message"},[t._v(t._s(t.logMessage(t.logLast)))]):t._e(),n("pulse-loader",{attrs:{loading:t.loading,size:"8px"}})],1)])]),n("div",[n("textarea",{directives:[{name:"model",rawName:"v-model",value:t.content,expression:"content"}],staticClass:"textarea textarea--code",domProps:{value:t.content},on:{input:[function(e){e.target.composing||(t.content=e.target.value)},function(e){return t.updateContentHash()}]}})]),n("div",{staticClass:"buttons is-right"},[n("button",{staticClass:"button button-run",class:{disabled:t.loading},attrs:{disabled:t.loading},on:{click:function(e){return t.run()}}},[n("span",[t._v("run")])])]),n("h2",[t._v("result")]),n("pre",[t._v(t._s(t.result))]),n("br"),n("h2",[t._v("standard out")]),n("div",{staticClass:"output-stdout"},t._l(t.stdout,(function(e,o){return n("pre",{key:o},[t._v(t._s(e))])})),0),n("br"),n("br"),n("details",[n("summary",[t._v("View log")]),n("div",[n("br"),n("input",{directives:[{name:"model",rawName:"v-model",value:t.packageName,expression:"packageName"}],attrs:{type:"text"},domProps:{value:t.packageName},on:{input:function(e){e.target.composing||(t.packageName=e.target.value)}}}),n("button",{on:{click:function(e){return t.loadPackage(t.packageName)}}},[t._v("load package")]),n("br"),t._l(t.log,(function(e,o){return n("pre",{key:o},[t._v(t._s(e))])}))],2)])])},a=[];n.d(e,"a",(function(){return o})),n.d(e,"b",(function(){return a}))},ccc9:function(t,e,n){"use strict";var o=n("b120"),a=n("58a9"),r=(n("57c3"),n("3c13")),i=Object(r["a"])(a["default"],o["a"],o["b"],!1,null,null,null);e["default"]=i.exports}});
//# sourceMappingURL=app.76215570.js.map