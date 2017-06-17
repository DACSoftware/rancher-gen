import Template from "./Template";

export default class Callback implements Template
{
    private callbackFunction: Function;

    constructor(definition: any)
    {
        this.callbackFunction = definition.function;
    }

    render(data: any): string
    {
        return this.callbackFunction(data);
    }
}
