import * as request from "request";
import * as WebSocket from "ws";

import RancherGen from "./RancherGen";
import Listener from "./Listener";
import Client from "./Client";
import Builder from "./Builder";
import BuildTaskFactory from "./BuildTaskFactory";

//dirty hack to expose regular require() in webpacked app
var config = eval("require")(process.argv[2]);

var rancherUrl = config.rancherHost;
var rancherAuthenticationToken = config.rancherAuthenticationToken;
var minInterval = config.minInterval || 10000;
var projectId = config.projectId || null;

var client = new Client(
    request,
    rancherUrl,
    rancherAuthenticationToken
);

var listener = new Listener(
    WebSocket,
    rancherUrl,
    rancherAuthenticationToken
);

var factory = new BuildTaskFactory();

var tasks = factory.tasksFromDefinitions(
    config.templates
);

var builder = new Builder(tasks);

var rancherGen = new RancherGen(
    listener,
    client,
    builder,
    minInterval,
    projectId
);

rancherGen.start();
