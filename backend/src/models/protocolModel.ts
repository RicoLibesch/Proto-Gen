const {AttendanceList} = require("./attendanceListModel");

class Protocol {
    public id: number;
    public protocol_type: string;
    public start_timestamp: string;
    public end_timestamp: string;
    public content: string;
    public topics: string[];
    public attendanceList: typeof AttendanceList;

    constructor(protocol_type: string, start_timestamp: string, end_timestamp: string, content: string, topics: string[], attendanceList: typeof AttendanceList) {
        this.protocol_type = protocol_type;
        this.start_timestamp = start_timestamp;
        this.end_timestamp = end_timestamp;
        this.content = content;
        this.topics = topics;
        this.attendanceList = attendanceList;
    }

    isValidPayload(): boolean {
        return (
            this.protocol_type !== undefined &&
            this.start_timestamp !== undefined &&
            this.end_timestamp !== undefined &&
            this.content !== undefined &&
            this.topics !== undefined &&
            this.attendanceList !== undefined
          );
    }
}

module.exports = {Protocol};