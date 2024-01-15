# Error Component Documentation

The `Error` component is a React functional component used to display error messages based on the HTTP status code. This component is often used in Next.js applications to handle different types of errors.

## Table of Contents

- [Usage](#usage)
- [Props](#props)
- [getInitialProps](#getinitialprops)

## Usage

The `Error` component can be used to render different error messages based on the HTTP status code. It takes a `statusCode` prop to determine the type of error.

```jsx
import React from 'react';

function Error({ statusCode }) {
    let errorMessage = 'An error occurred';

    if (statusCode === 404) {
        errorMessage = 'Page not found.';
    } else if (statusCode === 500) {
        errorMessage = 'Internal Server Error.';
    }

    return (
        <p className="text-center text-xl">
            {`Error ${statusCode}: ${errorMessage}`}
        </p>
    );
}

export default Error;
```

## Props

### `statusCode`

- Type: `number`
- Default: `undefined`

The `statusCode` prop is used to determine the type of error to display. It represents the HTTP status code returned by the server.

## getInitialProps

The `Error` component uses the `getInitialProps` method to get the initial properties during server-side rendering or when an error occurs. It retrieves the HTTP status code from the server response or error.

```jsx
Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};
```

This method sets the `statusCode` based on the server response or error, and the value is then passed to the `Error` component as a prop.

This documentation provides an overview of the `Error` component, its usage, and the `getInitialProps` method for handling error status codes in Next.js applications. The component is customizable to display different error messages based on the HTTP status code received from the server.