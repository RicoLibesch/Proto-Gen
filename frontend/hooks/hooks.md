# `useNotifyUnsavedChanges` Hook Documentation

The `useNotifyUnsavedChanges` hook is a custom React hook designed to notify the user when they attempt to leave a page with unsaved changes. It utilizes the `window.onbeforeunload` event and Next.js router events to trigger notifications and prevent route changes if there are unsaved changes. Below is the documentation for this hook:

## Parameters

- **`saved` (boolean):** A boolean parameter indicating whether there are any unsaved changes (`true` if changes are saved, `false` if changes are unsaved).

## Usage

```jsx
import { useNotifyUnsavedChanges } from "@/hooks/your-path-to-hooks-folder";

function YourComponent() {
  const unsavedChanges = true; // Set to true if there are unsaved changes, otherwise false
  useNotifyUnsavedChanges(unsavedChanges);

  // Your component logic...
}
```

## Description

### `useNotifyUnsavedChanges(saved: boolean)`

This hook takes a boolean parameter `saved` and sets up event listeners to notify the user if they attempt to leave the page with unsaved changes. It works by utilizing the `window.onbeforeunload` event to prevent the default behavior of the browser's unload process when there are unsaved changes. Additionally, it leverages Next.js router events to detect when the user is trying to navigate to a new route and confirms the navigation only if there are no unsaved changes.

## Implementation Details

- **`window.onbeforeunload`:**
  - The hook sets up a callback for the `window.onbeforeunload` event. This callback will be triggered when the user tries to leave the page.
  - If there are unsaved changes (`!saved`), the callback prevents the default behavior, triggering a confirmation dialog to inform the user about the unsaved changes.

- **`cleanUp` Function:**
  - The `cleanUp` function is called when the Next.js router tries to push a new route.
  - If there are unsaved changes, it prompts the user with a confirmation dialog.
  - If the user chooses to leave, the route change is allowed. If not, the route change is prevented by throwing an exception.

- **Next.js Router Events:**
  - The hook subscribes to the `routeChangeStart` event using `router.events.on`.
  - The `cleanUp` function is called when a route change is initiated.
  - This mechanism ensures that the user is warned about unsaved changes before navigating to a new route.

- **Cleanup:**
  - The hook unloads the event listeners when the component using the hook is unmounted. This prevents memory leaks and ensures proper cleanup.

## Example

```jsx
import { useNotifyUnsavedChanges } from "@/hooks/your-path-to-hooks-folder";
import { useState } from "react";

function YourComponent() {
  const [unsavedChanges, setUnsavedChanges] = useState(true);

  // Use the hook to notify the user about unsaved changes
  useNotifyUnsavedChanges(unsavedChanges);

  // Your component logic...

  return (
    // Your JSX...
  );
}
```

This example demonstrates how to use the `useNotifyUnsavedChanges` hook in a React component to handle unsaved changes notifications. The `unsavedChanges` state variable is used to determine whether there are unsaved changes.