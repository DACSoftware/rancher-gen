export default class Client
{
    private rancherUrl: string;
    private authenticationToken: string;
    private http;

    constructor(request: any, rancherUrl: string, authenticationToken: string = null)
    {
        this.rancherUrl = rancherUrl;
        this.authenticationToken = authenticationToken;
        this.http = request;
    }

    getListContainers(): Promise<any>
    {
        let url = "http://" + this.rancherUrl + "/v1/containers?limit=1000";
        return this.performGet(url)
    }

    getCurrentContainer(): Promise<any>
    {
        let url = "http://rancher-metadata/2015-07-25/self/container";
        return this.performGet(url)
    }

    getProjectByUuid(uuid: string): Promise<any>
    {
        let url = "http://" + this.rancherUrl + "/v1/projects?uuid=" + uuid;
        return this.performGet(url).then((projects) => {
            return projects.data[0] || null;
        });
    }

    private performGet(url: string): Promise<any>
    {
        let options: any = {
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
                } else {
                    try {
                        resolve(JSON.parse(body));
                    } catch(ex) {
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
