export class AttendanceList {
    public roles: { 
        [role: string]: string[] 
    };

    constructor(roles: { [role: string]: string[] }) {
        this.roles = roles;
    }
}