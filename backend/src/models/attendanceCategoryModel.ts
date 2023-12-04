export class AttendanceCategory {
    public title: string;
    public order: number;

    constructor(title: string, order: number) {
        this.title = title;
        this.order = order;
    }
}