# Logo Component Documentation

The `Logo` component is a React functional component designed for editing and uploading the logo of a website. It provides a user interface to choose a logo image, preview it, and upload it to the backend. The component utilizes functions from the `@/utils/API` module to handle logo-related functionalities.

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
- `setLogo` function from "@/utils/API" for handling backend API calls.
- `@mui/icons-material` for the `UploadFile` icon.
- `next/router` for handling navigation in Next.js.
- `react-toastify` for displaying toast messages.

## Usage

The `Logo` component can be used within an admin interface of a Next.js application for managing and uploading the website logo.

```jsx
import Logo from '@/components/Logo';

const LogoAdminPage = () => {
  return <Logo />;
};

export default LogoAdminPage;
```

## State

- **data**: Holds the base64-encoded data of the selected logo image or `null` if no logo is selected.

## Effects

- **Unload Effect**: Sets up an event listener to prompt the user if there are unsaved changes (unsaved logo data) before leaving the page.

## Methods

- **openFile()**: Opens a file explorer to select a logo image file. Converts the selected image file into base64-encoded data and sets it to the `data` state.

- **uploadLogo()**: Uploads the selected logo data to the backend using the `setLogo` function.

## UI Structure

The UI structure of the `Logo` component consists of a layout with a title, a horizontal rule, and a logo selection/upload section. The logo section includes a draggable box for selecting a logo file, a preview of the selected logo, and a button to upload the logo.

## Styling

The component uses Tailwind CSS for styling, providing a clean and responsive design. Additional styling can be applied based on project requirements.

This documentation provides an overview of the `Logo` component, its dependencies, usage, state management, effects, methods, UI structure, and styling considerations. Adjustments can be made based on specific project requirements and additional functionality.