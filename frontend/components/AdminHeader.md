# AdminHeader Component

The `AdminHeader` component is a React component designed for rendering a navigation header in the adminpanel dashboard. It is intended to display a set of links with associated paths and highlight the active link based on the current path provided.

## Props

### `path` (string, required)

The `path` prop is a required string that represents the current path in the application. The component uses this information to highlight the active link in the header.

### `...props` (HTMLAttributes<HTMLDivElement>)

This component extends the HTML attributes of a `div` element. Users can pass additional attributes as needed.

## Usage

```jsx
import AdminHeader from 'path-to-AdminHeader';

//...

const MyComponent = () => {
  //...

  return (
    <AdminHeader path="/admin/logo" additionalProp="value">
      {/* Additional content or children can be placed here */}
    </AdminHeader>
  );
};

export default MyComponent;
```

## Links Configuration

The component includes a set of links, each represented by an object with the following properties:

- `name` (string): The display name of the link.
- `path` (string): The path associated with the link.

The links are defined within the component and can be customized based on the specific requirements of the application.

## Styling

The component uses Tailwind CSS classes for styling. Links are styled with the following classes:

- `text-xl`: Sets the text size to extra-large.
- `px-2`: Adds horizontal padding.
- `hover:text-primary`: Changes text color to primary when hovered.
- `transition-all`: Applies a smooth transition effect on all style changes.
- `text-mni`: Styles the active link with a specific text color.
- `text-secondary`: Styles inactive links with a different text color.

Users can customize the styling by adjusting these classes or adding their own styles.
