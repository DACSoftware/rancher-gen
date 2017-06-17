module.exports = {
    "rancherHost": process.env.RANCHER_HOST || "10.0.2.200:8181",
    "rancherAuthenticationToken": process.env.RANCHER_TOKEN || "54748DD885D041D8D457:w3T8mr1U1txkvHXLiWqb3Bkd8F4BcnvEEb3gvpU4",
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