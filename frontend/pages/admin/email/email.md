# Email Component Documentation

The `Email` component is a React functional component designed for managing email templates and receivers in an admin interface. It interacts with backend functions from the `@/utils/API` module to handle email-related functionalities.

## Table of Contents

- [Dependencies](#dependencies)
- [Usage](#usage)
- [State](#state)
- [Effects](#effects)
- [Methods](#methods)
- [UI Structure](#ui-structure)
- [Styling](#styling)

## Dependencies

- `useEffect` and `useState` from React for managing component lifecycle and state.
- `AdminHeader` from "@/components/AdminHeader" for rendering the admin header.
- `StringList` from "@/components/StringList" for managing email receivers.
- `CodeMirror` from "@uiw/react-codemirror" for editing HTML content with syntax highlighting.
- `@codemirror/lang-html` for syntax highlighting for HTML in CodeMirror.
- `react-toastify` for displaying toast messages.
- `API` module from `"@/utils/API"` for handling backend API calls.

## Usage

The `Email` component can be used within an admin interface of a Next.js application for managing email templates and receivers.

```jsx
import Email from '@/components/Email';

const EmailAdminPage = () => {
  return <Email />;
};

export default EmailAdminPage;
```

## State

- **emails**: Holds an array of email receivers.
- **saved**: Indicates whether changes have been saved.
- **body**: Holds the HTML content of the email body.
- **subject**: Holds the text content of the email subject.
- **sendingMails**: Indicates whether emails should be sent.

## Effects

- **Initial Load Effect**: Fetches initial data including email receivers, email templates, and sending status.

- **Unload Effect**: Sets up an event listener to prompt the user if there are unsaved changes before leaving the page.

## Methods

- **save()**: Saves changes made to email receivers, email templates, and sending status.

## UI Structure

The UI structure of the `Email` component consists of a grid layout with two columns. The left column includes a list of email receivers, and the right column includes input fields for the email subject and body, along with CodeMirror for HTML editing. It also displays available variables for use in email templates.

## Styling

The component uses Tailwind CSS for styling, providing a clean and responsive design. Additional styling can be applied based on project requirements.

This documentation provides an overview of the `Email` component, its dependencies, usage, state management, effects, methods, UI structure, and styling considerations. Adjustments can be made based on specific project requirements and additional functionality.