import Template from "./Template";

export default class Callback implements Template
{
    private callbackFunction: Function;
    private definition: any;

    constructor(definition: any)
    {
        this.definition = definition;
        this.callbackFunction = definition.function;
    }

    render(data: any): string
    {
        data.definition = this.definition;
        return this.callbackFunction(data);
    }
}
