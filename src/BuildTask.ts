import Template from "./Template/Template";

import fs = require('fs');
import childProcess = require( 'child_process' );

export default class BuildTask
{
    private template: Template;
    private target: string;
    private command: string;

    private lastBuiltContent: string;

    constructor(template: Template, target: string, command: string)
    {
        this.template = template;
        this.target = target;
        this.command = command;

        this.lastBuiltContent = null;
    }

    build(data: any)
    {
        let newContent = this.template.render(data);
        if (newContent === null) {
            console.log("Target file " + this.target + " untouched - no new content");
        } else if (newContent == this.lastBuiltContent) {
            console.log("Target file " + this.target + " untouched - same content");
        } else {
            this.lastBuiltContent = newContent;

            fs.writeFileSync(
                this.target,
                newContent,
                "utf8"
            );

            if (this.command !== null) {
                console.log("Running command: " + this.command);
                childProcess.execSync(this.command, {stdio:[0,1,2]});
                console.log("Finished command: " + this.command);
            }

            console.log("Target file " + this.target + " written");
        }
    }
}
