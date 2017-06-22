import Listener from "./Listener";
import Client from "./Client";
import Builder from "./Builder";

export default class RancherGen
{
    private listener: Listener;
    private client: Client;
    private builder: Builder;
    private projectId: string;
    private minInterval: number;

    private lastBuild: number;
    private queuedBuild: any;

    constructor(listener: Listener, client: Client, builder: Builder, minInterval: number, projectId: string = null)
    {
        this.listener = listener;
        this.client = client;
        this.builder = builder;
        this.projectId = projectId;
        this.minInterval = minInterval;

        this.lastBuild = 0;
        this.queuedBuild = null;
    }

    start()
    {
        this.determineProjectId().then((projectId) => {
            this.listener.watch(projectId, ["resource.change"], () =>
            {
                this.build();
            });
        });
    }

    build()
    {
        let now = (new Date()).getTime();
        let sinceLastBuild = now - this.lastBuild;

        if (this.queuedBuild === null) {
            if (sinceLastBuild < this.minInterval) {
                let delay: number = (this.minInterval - sinceLastBuild);
                console.log("Delaying build by " + delay + "ms");
                this.queuedBuild = setTimeout(() => {
                    this.queuedBuild = null;
                    this.doBuild()
                }, delay);
            } else {
                console.log("Starting build immediately");
                this.doBuild();
            }
        } else {
            console.log("Build already queued");
        }
    }

    private doBuild()
    {
        this.lastBuild = (new Date()).getTime();
        this.client.getCurrentContainer()
            .then((currentContainer) =>
            {
                this.client.getListContainers()
                    .then((containers) =>
                    {
                        this.builder.build({
                            "definition": null,
                            "containers": containers,
                            "current": currentContainer
                        })
                    })
                    .catch((error) =>
                    {
                        console.log(error);
                        throw error;
                    });
            })
            .catch((error) =>
            {
                console.log(error);
                throw error;
            });
    }

    private determineProjectId(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            if (this.projectId !== null) {
                resolve(this.projectId);
            } else {
                this.client.getCurrentContainer().then((container) => {
                    this.client.getProjectByUuid(container.environment_uuid).then((project) => {
                        resolve(project.id);
                    })
                })
            }
        });
    }
}
