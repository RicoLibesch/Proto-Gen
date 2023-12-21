export class User {
    public id: string;
    public firstName: string;
    public lastName: string;
    public displayName: string;
    public mail:string;
    public isAdmin: boolean;
    public isRecorder: boolean;

    constructor(id: string, firstName: string, lastName: string, displayName: string, mail: string) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.displayName = displayName;
        this.mail = mail;
        this.isAdmin = false;
        this.isRecorder = false;
    }
}