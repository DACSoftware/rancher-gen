import * as request from "request";
import * as WebSocket from "ws";

import RancherGen from "./RancherGen";
import Listener from "./Listener";
import Client from "./Client";
import Builder from "./Builder";
import BuildTaskFactory from "./BuildTaskFactory";

var nomnom = require("nomnom");

var argv = nomnom
    .option('one-shot', {
        abbr: '1',
        flag: true,
        help: 'Build templates one time. No listen.'
    })
    .option('rancher-metadata', {
        abbr: '1',
        flag: true,
        default: true,
        help: 'Does not connect to rancher-metadata. Use when running outside Rancher container.'
    })
    .parse();

//dirty hack to expose regular require() in webpacked app
var config = eval("require")(argv._[0]);

var rancherUrl = config.rancherHost;
var rancherAuthenticationToken = config.rancherAuthenticationToken;
var minInterval = config.minInterval || 10000;
var projectId = config.projectId || null;

var client = new Client(
    request,
    rancherUrl,
    argv['rancher-metadata'],
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

rancherGen.build();

if (!argv['one-shot']) {
    rancherGen.start();
}
