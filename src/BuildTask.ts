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
        if (newContent != this.lastBuiltContent) {

            this.lastBuiltContent = newContent;

            fs.writeFileSync(
                this.target,
                newContent,
                "utf8"
            );

            if (this.command !== null) {
                childProcess.execSync(this.command, {stdio:[0,1,2]});
            }

            console.log("Target file " + this.target + " written");
        } else {
            console.log("Target file " + this.target + " untouched - same content");
        }
    }
}
