# SocialLinks Component

The `SocialLinks` component is a React component designed to display and allow the editing of a list of social media links. It provides a user interface for entering social media titles and corresponding values, supporting various social media icons.

## Props

### `socials` (Social[], required)

The `socials` prop is a required array of objects, each representing a social media link. Each object has an `id`, `title`, and `value`. The `title` represents the type of social media (e.g., "facebook"), and the `value` represents the corresponding link.

### `height` (number, optional)

The `height` prop is an optional number representing the height of the component.

### `update` (function, required)

The `update` prop is a required function that is called to update the `socials` prop when changes occur. It is crucial for keeping the parent component's state in sync with the internal state of the `SocialLinks` component.

## Functions

### `getIcon(title: string): JSX.Element`

A utility function that returns the corresponding MUI icon based on the provided social media `title`.

## Usage Example

```jsx
import SocialLinks from 'path-to-SocialLinks';

//...

const MyComponent = () => {
  const exampleSocials = [
    { id: 1, title: 'facebook', value: 'https://www.facebook.com/example' },
    { id: 2, title: 'twitter', value: 'https://www.twitter.com/example' },
    // ... more social media links
  ];

  const handleUpdate = (updatedSocials) => {
    // Handle the updated social media links
    console.log('Updated Socials:', updatedSocials);
  };

  return <SocialLinks socials={exampleSocials} height={200} update={handleUpdate} />;
};

export default MyComponent;
```