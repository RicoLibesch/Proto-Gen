import { AttendanceList } from './attendanceListModel';

export class Protocol {
    public id: number;
    public protocol_type: string;
    public start_timestamp: number;
    public end_timestamp: number;
    public content: string;
    public topics: string[];
    public attendanceList: AttendanceList;

    constructor(protocol_type: string, start_timestamp: number, end_timestamp: number, content: string, topics: string[], attendanceList: AttendanceList, id: number = 0) {
        this.protocol_type = protocol_type;
        this.start_timestamp = start_timestamp;
        this.end_timestamp = end_timestamp;
        this.content = content;
        this.topics = topics;
        this.attendanceList = attendanceList;
        this.id = id;
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