# Protocol Interface

The `Protocol` interface defines the structure of an object representing a meeting protocol. It includes various properties to capture details about the meeting, such as its ID, type, timestamps, topics, content, and attendance list.

## Properties

### `id` (number)

A unique identifier for the protocol.

### `protocol_type` (string)

The type or category of the protocol.

### `start_timestamp` (number)

The timestamp indicating when the meeting started.

### `end_timestamp` (number)

The timestamp indicating when the meeting ended.

### `topics` (Array of strings)

An array of strings representing the topics discussed during the meeting.

### `content` (string)

A string containing the content or summary of the meeting.

### `attendanceList` ([Attendance](#attendance) type)

An object representing the attendance list for the meeting. The `Attendance` type is assumed to be defined in a separate file named "Attendance."

## Usage Example

```typescript
import { Attendance } from "./Attendance";

interface ProtocolType {
  title: string;
  template: string;
}

interface Protocol {
  id: number;
  protocol_type: string;
  start_timestamp: number;
  end_timestamp: number;
  topics: Array<string>;
  content: string;
  attendanceList: Attendance;
}

export default Protocol;
```

## Note

This interface is a TypeScript definition and assumes that the `Attendance` type is defined in a separate file named "Attendance." 