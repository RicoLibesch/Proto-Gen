export class User {
    public id: string;
    public firstName: string;
    public lastName: string;
    public mail:string 

    constructor(id: string, firstName: string, lastName: string, mail: string) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.mail = mail;
    }
}