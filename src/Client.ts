export default class Client
{
    private rancherUrl: string;
    private rancherMetadataUrl: string;
    private authenticationToken: string;
    private http;

    constructor(request: any, rancherUrl: string, rancherMetadataUrl: string, authenticationToken: string = null)
    {
        this.rancherUrl = rancherUrl;
        this.rancherMetadataUrl = rancherMetadataUrl;
        this.authenticationToken = authenticationToken;
        this.http = request;
    }

    getListContainers(): Promise<any>
    {
        let url = this.rancherUrl + "/containers";
        return new Promise((resolve, reject) => {
            this.recursiveGetContainers([], url, resolve);
        })
    }

    getCurrentContainer(): Promise<any>
    {
        if (this.rancherMetadataUrl !== null) {
            let url = this.rancherMetadataUrl + "/self/container";
            return this.performGet(url)
        } else {
            return new Promise((resolve, reject) => {
                resolve(null);
            });
        }
    }

    getProjectByUuid(uuid: string): Promise<any>
    {
        let url = "http://" + this.rancherUrl + "/v1/projects?uuid=" + uuid;
        return this.performGet(url).then((projects) => {
            return projects.data[0] || null;
        });
    }

    private recursiveGetContainers(list: any[], url: string, finalResolve: Function)
    {
        this.performGet(url).then((response) => {
            list = list.concat(response.data);
            if (response.pagination.next) {
                this.recursiveGetContainers(list, response.pagination.next, finalResolve);
            } else {
                finalResolve(list);
            }
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
