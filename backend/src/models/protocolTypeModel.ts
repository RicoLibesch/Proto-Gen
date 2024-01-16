export class ProtocolType {
    public id: number;
    public title: string;
    public template: string;

    constructor(title: string, template: string) {
        this.title = title;
        this.template = template;
    }
}