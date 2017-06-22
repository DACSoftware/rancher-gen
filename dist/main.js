/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/* no static exports found */
/* all exports used */
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 1 */
/* no static exports found */
/* all exports used */
/*!*********************************!*\
  !*** ./src/BuildTaskFactory.ts ***!
  \*********************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BuildTask_1 = __webpack_require__(/*! ./BuildTask */ 9);
const Ejs_1 = __webpack_require__(/*! ./Template/Ejs */ 11);
const Callback_1 = __webpack_require__(/*! ./Template/Callback */ 10);
class BuildTaskFactory {
    taskFromDefinition(definition) {
        let template = null;
        let command = definition.command || null;
        let target = definition.target || null;
        let engine = definition.engine || 'none';
        switch (engine) {
            case 'callback':
                template = new Callback_1.default(definition);
                break;
            case 'ejs':
                template = new Ejs_1.default(definition);
                break;
            default: throw new Error("Unsupported templating engine: " + engine);
        }
        return new BuildTask_1.default(template, target, command);
    }
    tasksFromDefinitions(definitions) {
        let tasks = [];
        for (let i = 0; i < definitions.length; i++) {
            tasks.push(this.taskFromDefinition(definitions[i]));
        }
        return tasks;
    }
}
exports.default = BuildTaskFactory;


/***/ }),
/* 2 */
/* no static exports found */
/* all exports used */
/*!************************!*\
  !*** ./src/Builder.ts ***!
  \************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Builder {
    constructor(tasks) {
        this.tasks = tasks;
    }
    build(context) {
        console.log("Build start");
        for (let i = 0; i < this.tasks.length; i++) {
            console.log("Starting build task #" + (i + 1) + " of " + this.tasks.length);
            this.tasks[i].build(context);
            console.log("Finished build task #" + (i + 1) + " of " + this.tasks.length);
        }
    }
}
exports.default = Builder;


/***/ }),
/* 3 */
/* no static exports found */
/* all exports used */
/*!***********************!*\
  !*** ./src/Client.ts ***!
  \***********************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Client {
    constructor(request, rancherUrl, authenticationToken = null) {
        this.rancherUrl = rancherUrl;
        this.authenticationToken = authenticationToken;
        this.http = request;
    }
    getListContainers() {
        let url = "http://" + this.rancherUrl + "/v1/containers";
        return this.performGet(url);
    }
    getCurrentContainer() {
        let url = "http://rancher-metadata/2015-07-25/self/container";
        return this.performGet(url);
    }
    performGet(url) {
        let options = {
            url: url,
            headers: {
                'User-Agent': 'request',
                'Accept': 'application/json',
            }
        };
        if (this.authenticationToken) {
            let buf = new Buffer(this.authenticationToken);
            options.headers.Authorization = "Basic " + buf.toString("base64");
        }
        return new Promise((resolve, reject) => {
            this.http(options, function (error, response, body) {
                var code = response && response.statusCode
                    ? response.statusCode
                    : null;
                if (error || code != 200) {
                    reject({
                        "error": error,
                        "response": response,
                        "body": body
                    });
                }
                else {
                    try {
                        resolve(JSON.parse(body));
                    }
                    catch (ex) {
                        reject({
                            "error": "exception",
                            "exception": ex
                        });
                    }
                }
            });
        });
    }
}
exports.default = Client;


/***/ }),
/* 4 */
/* no static exports found */
/* all exports used */
/*!*************************!*\
  !*** ./src/Listener.ts ***!
  \*************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Listener {
    constructor(websocket, rancherUrl, authenticationToken = null) {
        this.rancherUrl = rancherUrl;
        this.authenticationToken = authenticationToken;
        this.websocket = websocket;
    }
    watch(projectId, events, callback) {
        let authPrefix = this.authenticationToken !== null
            ? this.authenticationToken + "@"
            : "";
        let eventList = events.join(",");
        let url = "ws://" + authPrefix + this.rancherUrl + "/v1/projects/" + projectId + "/subscribe?eventNames=" + eventList;
        let socket = new this.websocket(url);
        socket.on('open', () => {
            console.log('Socket opened');
        });
        socket.on('error', (error) => {
            console.log('Socket errored');
            console.error(error);
        });
        socket.on('message', (messageStr) => {
            let message = JSON.parse(messageStr);
            if (message.name == "ping") {
                console.log("Ping received");
            }
            else {
                console.log("Event received " + message.name);
                callback(message);
            }
        });
    }
}
exports.default = Listener;


/***/ }),
/* 5 */
/* no static exports found */
/* all exports used */
/*!***************************!*\
  !*** ./src/RancherGen.ts ***!
  \***************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class RancherGen {
    constructor(listener, client, builder, minInterval, projectId = null) {
        this.listener = listener;
        this.client = client;
        this.builder = builder;
        this.projectId = projectId;
        this.minInterval = minInterval;
        this.lastBuild = 0;
        this.queuedBuild = null;
    }
    start() {
        this.determineProjectId().then((projectId) => {
            this.listener.watch(projectId, ["resource.change"], () => {
                this.build();
            });
        });
    }
    build() {
        let now = (new Date()).getTime();
        let sinceLastBuild = now - this.lastBuild;
        if (this.queuedBuild === null) {
            if (sinceLastBuild < this.minInterval) {
                let delay = (this.minInterval - sinceLastBuild);
                console.log("Delaying build by " + delay + "ms");
                this.queuedBuild = setTimeout(() => {
                    this.queuedBuild = null;
                    this.doBuild();
                }, delay);
            }
            else {
                console.log("Starting build immediately");
                this.doBuild();
            }
        }
        else {
            console.log("Build already queued");
        }
    }
    doBuild() {
        this.lastBuild = (new Date()).getTime();
        this.client.getCurrentContainer()
            .then((currentContainer) => {
            this.client.getListContainers()
                .then((containers) => {
                this.builder.build({
                    "definition": null,
                    "containers": containers,
                    "current": currentContainer
                });
            })
                .catch((error) => {
                console.log(error);
                throw error;
            });
        })
            .catch((error) => {
            console.log(error);
            throw error;
        });
    }
    determineProjectId() {
        return new Promise((resolve, reject) => {
            if (this.projectId !== null) {
                resolve(this.projectId);
            }
            else {
                this.client.getCurrentContainer().then((container) => {
                    resolve(container.accountId);
                });
            }
        });
    }
}
exports.default = RancherGen;


/***/ }),
/* 6 */
/* no static exports found */
/* all exports used */
/*!*************************!*\
  !*** external "nomnom" ***!
  \*************************/
/***/ (function(module, exports) {

module.exports = require("nomnom");

/***/ }),
/* 7 */
/* no static exports found */
/* all exports used */
/*!**************************!*\
  !*** external "request" ***!
  \**************************/
/***/ (function(module, exports) {

module.exports = require("request");

/***/ }),
/* 8 */
/* no static exports found */
/* all exports used */
/*!*********************!*\
  !*** external "ws" ***!
  \*********************/
/***/ (function(module, exports) {

module.exports = require("ws");

/***/ }),
/* 9 */
/* no static exports found */
/* all exports used */
/*!**************************!*\
  !*** ./src/BuildTask.ts ***!
  \**************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(/*! fs */ 0);
const childProcess = __webpack_require__(/*! child_process */ 13);
class BuildTask {
    constructor(template, target, command) {
        this.template = template;
        this.target = target;
        this.command = command;
        this.lastBuiltContent = null;
    }
    build(data) {
        let newContent = this.template.render(data);
        if (newContent != this.lastBuiltContent) {
            this.lastBuiltContent = newContent;
            fs.writeFileSync(this.target, newContent, "utf8");
            if (this.command !== null) {
                console.log("Running command: " + this.command);
                childProcess.execSync(this.command, { stdio: [0, 1, 2] });
                console.log("Finished command: " + this.command);
            }
            console.log("Target file " + this.target + " written");
        }
        else {
            console.log("Target file " + this.target + " untouched - same content");
        }
    }
}
exports.default = BuildTask;


/***/ }),
/* 10 */
/* no static exports found */
/* all exports used */
/*!**********************************!*\
  !*** ./src/Template/Callback.ts ***!
  \**********************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Callback {
    constructor(definition) {
        this.definition = definition;
        this.callbackFunction = definition.function;
    }
    render(data) {
        data.definition = this.definition;
        return this.callbackFunction(data);
    }
}
exports.default = Callback;


/***/ }),
/* 11 */
/* no static exports found */
/* all exports used */
/*!*****************************!*\
  !*** ./src/Template/Ejs.ts ***!
  \*****************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(/*! fs */ 0);
class Ejs {
    constructor(definition) {
        this.template = null;
        let ejs = __webpack_require__(/*! ejs */ 14);
        let sourceFile = definition.source;
        let source = fs.readFileSync(sourceFile).toString("utf8");
        this.template = ejs.compile(source, { filename: definition.source });
        this.definition = definition;
    }
    render(data) {
        data.definition = this.definition;
        return this.template(data);
    }
}
exports.default = Ejs;


/***/ }),
/* 12 */
/* no static exports found */
/* all exports used */
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const request = __webpack_require__(/*! request */ 7);
const WebSocket = __webpack_require__(/*! ws */ 8);
const RancherGen_1 = __webpack_require__(/*! ./RancherGen */ 5);
const Listener_1 = __webpack_require__(/*! ./Listener */ 4);
const Client_1 = __webpack_require__(/*! ./Client */ 3);
const Builder_1 = __webpack_require__(/*! ./Builder */ 2);
const BuildTaskFactory_1 = __webpack_require__(/*! ./BuildTaskFactory */ 1);
var nomnom = __webpack_require__(/*! nomnom */ 6);
var argv = nomnom
    .option('one-shot', {
    abbr: '1',
    flag: true,
    help: 'Build templates one time. No listen.'
})
    .parse();
//dirty hack to expose regular require() in webpacked app
var config = eval("require")(argv._[0]);
var rancherUrl = config.rancherHost;
var rancherAuthenticationToken = config.rancherAuthenticationToken;
var minInterval = config.minInterval || 10000;
var projectId = config.projectId || null;
var client = new Client_1.default(request, rancherUrl, rancherAuthenticationToken);
var listener = new Listener_1.default(WebSocket, rancherUrl, rancherAuthenticationToken);
var factory = new BuildTaskFactory_1.default();
var tasks = factory.tasksFromDefinitions(config.templates);
var builder = new Builder_1.default(tasks);
var rancherGen = new RancherGen_1.default(listener, client, builder, minInterval, projectId);
rancherGen.build();
if (!argv['one-shot']) {
    rancherGen.start();
}


/***/ }),
/* 13 */
/* no static exports found */
/* all exports used */
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),
/* 14 */
/* no static exports found */
/* all exports used */
/*!**********************!*\
  !*** external "ejs" ***!
  \**********************/
/***/ (function(module, exports) {

module.exports = require("ejs");

/***/ })
/******/ ]);