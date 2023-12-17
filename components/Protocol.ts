import { Attendance } from "./Attendance";

export interface ProtocolType {
  title: string;
  template: string;
}
export default interface Protocol {
  id: number;
  protocol_type: string;
  start_timestamp: number;
  end_timestamp: number;
  topics: Array<string>;
  content: string;
  attendanceList: Attendance;
}
