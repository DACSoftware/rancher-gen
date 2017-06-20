import Template from "./Template";

import fs = require('fs');

export default class Ejs implements Template
{
    template: any = null;
    definition: any;

    constructor(definition: any)
    {
        let ejs = require("ejs");
        let sourceFile = definition.source;
        let source = fs.readFileSync(sourceFile).toString("utf8");
        this.template = ejs.compile(source, {filename: definition.source});
        this.definition = definition;
    }

    render(data: any): string
    {
        data.definition = this.definition;
        return this.template(data);
    }
}
