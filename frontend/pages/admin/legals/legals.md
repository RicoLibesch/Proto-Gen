# Legals Component Documentation

The `Legals` component is a React functional component designed for managing legal content, specifically the "Impressum" and "Datenschutz." It utilizes the `@uiw/react-md-editor` for Markdown editing and interacts with backend functions from the `@/utils/API` module to handle legal content.

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
- `@uiw/react-md-editor/markdown-editor.css` and `@uiw/react-markdown-preview/markdown.css` for styling the Markdown editor and preview.
- `@uiw/react-md-editor` for providing a Markdown editor.
- `API` module from `"@/utils/API"` for handling backend API calls.

## Usage

The `Legals` component can be used within an admin interface of a Next.js application to manage legal content.

```jsx
import Legals from '@/components/Legals';

const LegalsAdminPage = () => {
  return <Legals />;
};

export default LegalsAdminPage;
```

## State

- **impressum**: Holds the Markdown content of the "Impressum."
- **datenschutz**: Holds the Markdown content of the "Datenschutz."

## Effects

- **Initial Load Effect**: Fetches initial data including the "Impressum" and "Datenschutz" from the backend.

## Methods

- **save()**: Saves changes made to the "Impressum" and "Datenschutz" content.

## UI Structure

The UI structure of the `Legals` component consists of a grid layout with two columns. Each column includes a Markdown editor for editing the "Impressum" and "Datenschutz" content. The component uses the `@uiw/react-md-editor` for providing a user-friendly Markdown editor.

## Styling

The component uses Tailwind CSS for styling, providing a clean and responsive design. Additionally, the `@uiw/react-md-editor/markdown-editor.css` and `@uiw/react-markdown-preview/markdown.css` are included for styling the Markdown editor and preview. Additional styling can be applied based on project requirements.

This documentation provides an overview of the `Legals` component, its dependencies, usage, state management, effects, methods, UI structure, and styling considerations. Adjustments can be made based on specific project requirements and additional functionality.