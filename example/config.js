module.exports = {
    "cattleUrl": process.env.CATTLE_URL || "http://10.0.2.200:8181/v1",
    "cattleAccessKey": process.env.CATTLE_ACCESS_KEY || "BF8123E661C6278ED8FE",
    "cattleSecretKey": process.env.CATTLE_SECRET_KEY || "mAq2XmZA9LkLBs14MiwzAKPEWrAgFfuoRhp6dx8d",
    "projectId": "1a5",
    "templates": [
        {
            "engine": "ejs",
            "source": __dirname + "/list.ejs.tmpl",
            "target": "/tmp/container-list.txt",
            "command": ""
        },
        {
            "engine": "callback",
            "function": function (data) {
                //console.log(data);
                return JSON.stringify(data);
            },
            "target": "/tmp/containers.json",
            "command": ""
        }
    ]
};