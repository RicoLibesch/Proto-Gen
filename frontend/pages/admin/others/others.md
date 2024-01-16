# Others Component Documentation

The `Others` component is a React functional component designed for managing miscellaneous settings in an admin interface. It includes functionalities for downloading all protocols as JSON, updating social links in the website's footer, and managing attendance categories. The component utilizes functions from the `@/utils/API` module to handle backend API calls.

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
- `SocialLinks` from "@/components/SocialLinks" for managing social links.
- `StringList` from "@/components/StringList" for managing attendance categories.
- `getEmails`, `getSocials`, `getAttendanceCategories`, `setSocials`, and `setAttendanceCategories` functions from `@/utils/API` for handling backend API calls.
- `react-toastify` for displaying toast messages.

## Usage

The `Others` component can be used within an admin interface of a Next.js application for managing miscellaneous settings.

```jsx
import Others from '@/components/Others';

const OthersAdminPage = () => {
  return <Others />;
};

export default OthersAdminPage;
```

## State

- **attendance**: Holds an array of attendance categories.
- **saved**: Indicates whether changes have been saved.
- **socials**: Holds an array of social links.

## Effects

- **Unload Effect**: Sets up an event listener to prompt the user if there are unsaved changes before leaving the page.

## Methods

- **uploadSocials()**: Saves changes made to the social links.
- **uploadAttendance()**: Saves changes made to the attendance categories.
- **downloadJson()**: Initiates the download of all protocols as JSON.

## UI Structure

The UI structure of the `Others` component consists of a grid layout with three columns. Each column includes a specific functionality:
1. **Downloading Protocols as JSON**: Allows users to download all protocols as JSON.
2. **Footer Social Links**: Allows users to manage social links in the website's footer.
3. **Attendance Categories**: Allows users to manage attendance categories.

## Styling

The component uses Tailwind CSS for styling, providing a clean and responsive design. Additional styling can be applied based on project requirements.

This documentation provides an overview of the `Others` component, its dependencies, usage, state management, effects, methods, UI structure, and styling considerations. Adjustments can be made based on specific project requirements and additional functionality.