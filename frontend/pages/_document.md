# Document Component Documentation

The `Document` component in Next.js is used to customize the HTML document that is rendered for each page. This component allows you to add custom markup to the `<head>` and `<body>` of the HTML document.

## Table of Contents

- [Usage](#usage)
- [Props](#props)

## Usage

The `Document` component is typically found in the `pages/_document.tsx` or `pages/_document.js` file. This file is used to customize the HTML document's structure for the entire application.

```jsx
// pages/_document.tsx or pages/_document.js

import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

## Props

### Html Component

The `Html` component is a wrapper for the entire HTML document. It includes the `lang` attribute, which specifies the language of the document.

- `lang`: Specifies the primary language for the content of the HTML document.

### Head Component

The `Head` component is used to modify the `<head>` of the HTML document. It is where you can include custom metadata, stylesheets, scripts, and other elements that belong in the document head.

### Main Component

The `Main` component is a placeholder for the main content of your application. The actual content of the page will be rendered here.

### NextScript Component

The `NextScript` component is used to render the necessary scripts for client-side navigation and other features provided by Next.js.

## Customization

This component is a simple example, and it doesn't include any customizations. Depending on your project requirements, you might want to include additional elements in the `<head>` section, such as meta tags, stylesheets, or scripts. Additionally, you can customize the structure of the HTML document to meet specific needs.

This documentation provides an overview of the `Document` component in Next.js, its usage, and the purpose of its subcomponents (`Html`, `Head`, `Main`, and `NextScript`). Customizations can be made based on specific project requirements.