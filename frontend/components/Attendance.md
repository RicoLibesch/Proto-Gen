# AttendanceList Component

The `AttendanceList` component is a React component designed to display and manage an attendance list, allowing users to categorize and manipulate attendee names. It supports drag-and-drop functionality for reordering and categorizing attendees.

## Props

### `list` (Attendance, required)

The `list` prop is a required object representing the attendance data. It is a record where each key represents a category, and the corresponding value is an array of attendee names in that category.

### `editable` (boolean, optional, default: `true`)

The `editable` prop is an optional boolean that determines whether the component is in editable mode. When set to `true`, users can perform actions like dragging, dropping, and deleting attendees. When set to `false` the attendance list may no longer be changed after the minutes have been completed.

### `update` (function, required)

The `update` prop is a required function that is called to update the `list` prop when changes occur. It is essential for keeping the parent component's state in sync with the internal state of the `AttendanceList`.

## Usage

```jsx
import AttendanceList from 'path-to-AttendanceList';

//...

const MyComponent = () => {
  const initialList = {
    category1: ['Attendee1', 'Attendee2'],
    category2: ['Attendee3', 'Attendee4'],
  };

  const handleUpdate = (updatedList) => {
    // Handle the updated attendance list
    console.log('Updated List:', updatedList);
  };

  return (
    <AttendanceList list={initialList} editable={true} update={handleUpdate} />
  );
};

export default MyComponent;
```

## Internal State and Functions

- `state`: Internal state used to trigger component re-renders when the attendance list is updated.
- `refresh()`: Function to trigger a re-render of the component.
- `adding`: Internal state to manage whether a new attendee is being added.
- `name`: Internal state to store the name of the attendee being added.
- `deleted`: Ref object to keep track of names that have been deleted.
- `pending`: Ref object to keep track of names that are pending addition.
- `running`: Internal state to track whether a session is currently running.

## Lifecyle and Polling

The component utilizes the `useEffect` hook to periodically poll for changes in the attendance list. It checks for new attendees and updates the internal state accordingly.

## Drag-and-Drop

The component supports drag-and-drop functionality for both attendees within categories and from a pending list. The `onDrop`, `onDrag`, and `onDragPending` functions handle the drag-and-drop logic.

## Styling

The component uses Tailwind CSS classes for styling. It provides a visually appealing and user-friendly representation of the attendance list.



