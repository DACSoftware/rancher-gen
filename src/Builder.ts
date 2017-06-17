import BuildTask from "./BuildTask";

export default class Builder
{
    private tasks: BuildTask[];

    constructor(tasks: BuildTask[])
    {
        this.tasks = tasks;
    }

    build(context: any)
    {
        console.log("Build start");

        for (let i = 0; i < this.tasks.length; i++) {
            console.log("Starting build task #" + (i + 1) + " of " + this.tasks.length);
            this.tasks[i].build(context);
            console.log("Finished build task #" + (i + 1) + " of " + this.tasks.length);
        }
    }
}
