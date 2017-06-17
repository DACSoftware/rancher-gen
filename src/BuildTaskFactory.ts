import BuildTask from "./BuildTask";
import Template from "./Template/Template";
import Ejs from "./Template/Ejs";
import Callback from "./Template/Callback";

export default class BuildTaskFactory
{
    taskFromDefinition(definition: any): BuildTask
    {
        let template: Template = null;

        let command: string = definition.command || null;
        let target: string = definition.target || null;
        let engine: string = definition.engine || 'none';

        switch (engine) {
            case 'callback' : template = new Callback(definition); break;
            case 'ejs' : template = new Ejs(definition); break;
            default: throw new Error("Unsupported templating engine: " + engine);
        }

        return new BuildTask(
            template,
            target,
            command
        );
    }

    tasksFromDefinitions(definitions: any[]): BuildTask[]
    {
        let tasks: BuildTask[] = [];
        for (let i = 0; i < definitions.length; i++) {
            tasks.push(this.taskFromDefinition(definitions[i]));
        }
        return tasks;
    }
}
