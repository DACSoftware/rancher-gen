import Template from "./Template";

import fs = require('fs');

export default class Ejs implements Template
{
    template: any = null;

    constructor(definition: any)
    {
        let ejs = require("ejs");
        let sourceFile = definition.source;
        let source = fs.readFileSync(sourceFile).toString("utf8");
        this.template = ejs.compile(source);
    }

    render(data: any): string
    {
        return this.template(data);
    }
}
