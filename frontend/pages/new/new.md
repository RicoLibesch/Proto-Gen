# ProtocolCreate Component Documentation

The `ProtocolCreate` component is a React component used to create and upload protocols. It includes a Markdown editor for entering protocol content, a QR code for session identification, and functionality for selecting and uploading different protocol types. Below is the documentation for this component:

## Dependencies
- **React**: A JavaScript library for building user interfaces.
- **Next.js**: A React framework for building server-rendered React applications.
- **@uiw/react-md-editor**: A Markdown editor component for React.
- **@uiw/react-markdown-preview**: A Markdown preview component for React.
- **@mui/material**: Material-UI components for React.
- **next/image**: Next.js image component for optimizing images.
- **@/components/Protocol**: Custom React components for handling protocols.
- **@/components/Attendance**: Custom React components for handling attendance lists.
- **@/utils/API**: Utility functions for interacting with an API.
- **@/components/Skeleton**: A loading skeleton component.

## Component Structure

- **Dependencies Import:**
  - Import required libraries, styles, and dynamic components.

- **Dynamic Component:**
  - Load the Markdown editor dynamically using `dynamic` from Next.js to ensure proper SSR support.

- **Component Definition:**
  - Define the `ProtocolCreate` functional component.

- **State Initialization:**
  - Initialize state variables using the `useState` hook.
  - States include `content`, `start`, `protocolType`, `protocolTypes`, `index`, `attendanceList`, and `sending`.

- **Cleanup Function:**
  - Define a cleanup function that is triggered when the user tries to leave the page.

- **Component Lifecycle:**
  - Use the `useEffect` hook to perform initial setup when the component mounts.
  - Set up event listeners for route changes to trigger the cleanup function.
  - Clean up when the component unmounts.

- **Initial Load:**
  - Check if a session is running and start a new one if not.
  - Fetch and set protocol types, content templates, and attendance categories.
  - Set initial state values.

- **Upload Protocol Function:**
  - Define the `uploadProtocol` function to handle protocol uploading.
  - Check if the protocol content is empty.
  - Confirm protocol saving with the user.
  - Parse topics from the content and create a protocol object.
  - Call the `createProtocol` API function and redirect to the home page.

- **Render JSX:**
  - Render the component UI using JSX.
  - Include a dropdown for selecting protocol types, a QR code and attendance list section, and the Markdown editor.
  - Use Material-UI components for styling.
  - Include a "Fertigstellen" button to trigger the protocol upload.

## Usage

```jsx
import ProtocolCreate from "@/components/ProtocolCreate";

function YourPage() {
  return (
    <div>
      <ProtocolCreate />
    </div>
  );
}

export default YourPage;
```

This component can be used in any Next.js page where protocol creation functionality is needed.