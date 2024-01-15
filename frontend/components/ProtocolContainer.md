# ProtocolContainer Component

The `ProtocolContainer` component is a React component designed to display and provide information about a meeting protocol. It includes details such as the protocol type, start and end timestamps, and a summary of the discussed topics. Additionally, it allows users to view the last three topics discussed in the meeting.

## Props

### `protocol` (Protocol, required)

The `protocol` prop is a required object representing the meeting protocol. It should adhere to the structure defined by the `Protocol` interface.

## Functions

### `formatProtocolDate(protocol: Protocol): String`

A utility function that formats the start and end timestamps of the protocol into a human-readable date and time format.

## Usage Example

```jsx
import ProtocolContainer from 'path-to-ProtocolContainer';

//...

const MyComponent = () => {
  const exampleProtocol = {
    id: 1,
    protocol_type: 'Meeting',
    start_timestamp: 1642348800, // Replace with actual timestamp
    end_timestamp: 1642352400, // Replace with actual timestamp
    topics: ['Agenda', 'Discussion', 'Action Items'],
    content: 'Summary of the meeting...',
    attendanceList: {/* Attendance object */},
  };

  return <ProtocolContainer protocol={exampleProtocol} />;
};

export default MyComponent;
```