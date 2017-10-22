module.exports = {
    "cattleUrl": process.env.RANCHER_URL,
    "cattleAccessKey": process.env.RANCHER_ACCESS_KEY,
    "cattleSecretKey": process.env.RANCHER_SECRET_KEY,
    "projectId": process.env.RANCHER_ENV_ID || null,
    "templates": [
        {
            "engine": "ejs",
            "source": __dirname + "/templates/nginx.ejs",
            "target": "/etc/nginx/conf.d/default.conf",
            "command": "nginx -s reload"
        }
    ]
};
