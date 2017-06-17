export default class Listener
{
    private rancherUrl: string;
    private authenticationToken: string;

    private websocket: any;

    constructor(websocket: any, rancherUrl: string, authenticationToken: string = null)
    {
        this.rancherUrl = rancherUrl;
        this.authenticationToken = authenticationToken;
        this.websocket = websocket;
    }

    watch(projectId: string, events: string[], callback: Function)
    {
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
            } else {
                console.log("Event received " + message.name);
                callback(message);
            }
        });
    }
}
