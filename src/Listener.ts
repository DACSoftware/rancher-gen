export default class Listener
{
    private rancherUrl: string;
    private authenticationToken: string;

    private websocket: any;

    private reconnectTimeout: number = 5000;

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
        let url = this.rancherUrl.replace(/^https?:\/\//, "ws://" + authPrefix) + "/projects/" + projectId + "/subscribe?eventNames=" + eventList;
        let socket = new this.websocket(url);

        socket.on('open', () => {
            console.log('Socket opened');
        });

        socket.on('close', () => {
            console.log('Socket closed');
            this.queueReconnect(projectId, events, callback);
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

    private queueReconnect(projectId: string, events: string[], callback: Function)
    {
        console.log("Will reconnect socket in " + this.reconnectTimeout + "ms");
        setTimeout(
            () => {
                console.log("Reconnecting socket");
                this.watch(projectId, events, callback)
            },
            this.reconnectTimeout
        );
    }
}
