# StringList Component

The `StringList` component is a React component designed to display and allow the manipulation of a list of strings. It provides functionalities for adding, deleting, and selecting items in the list. The component supports drag-and-drop reordering if the `draggable` prop is set to `true`.

## Props

### `list` (string[], required)

The `list` prop is a required array of strings representing the items in the list.

### `title` (string, required)

The `title` prop is a required string representing the title or label of the list.

### `placeholder` (string, optional)

The `placeholder` prop is an optional string representing the placeholder text for the input field when adding a new item.

### `update` (function, required)

The `update` prop is a required function that is called to update the `list` prop when changes occur. It is crucial for keeping the parent component's state in sync with the internal state of the `StringList` component.

### `selected` (function, optional)

The `selected` prop is an optional function that is called when an item in the list is selected. It receives the index of the selected item as a parameter.

### `deleteCallback` (function, optional)

The `deleteCallback` prop is an optional function that is called when attempting to delete an item. It receives the index of the item to be deleted and returns a boolean indicating whether the deletion should proceed.

### `add` (function, optional)

The `add` prop is an optional function that is called when adding a new item to the list. It receives the new item as a parameter and returns a boolean indicating whether the addition should proceed.

### `flex` (boolean, optional)

The `flex` prop is an optional boolean that determines whether the list items should be displayed in a flex container.

### `draggable` (boolean, optional)

The `draggable` prop is an optional boolean that determines whether the items in the list should be draggable for reordering.

### `height` (number, optional)

The `height` prop is an optional number representing the height of the component.

## Usage Example

```jsx
import StringList from 'path-to-StringList';

//...

const MyComponent = () => {
  const exampleList = ['Item 1', 'Item 2', 'Item 3'];

  const handleUpdate = (updatedList) => {
    // Handle the updated list
    console.log('Updated List:', updatedList);
  };

  const handleSelected = (index) => {
    // Handle the selection of an item
    console.log('Selected Index:', index);
  };

  return (
    <StringList
      list={exampleList}
      title="My List"
      placeholder="Add Item..."
      update={handleUpdate}
      selected={handleSelected}
      draggable={true}
      height={200}
    />
  );
};

export default MyComponent;
```