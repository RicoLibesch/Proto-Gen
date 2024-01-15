# Layout Component Documentation

The `Layout` component is a higher-order component that wraps the main content of the application. It includes a header, a toast container for displaying notifications, the main content area, and a footer.

## Table of Contents

- [Usage](#usage)
- [Props](#props)

## Usage

The `Layout` component is used to structure the overall layout of the application. It includes a header, main content area, toast container for notifications, and a footer. The `children` prop represents the main content of the application and is injected into the layout.

```jsx
import { ToastContainer } from "react-toastify";
import Footer from "./Footer";
import Header from "./Header";
import 'react-toastify/dist/ReactToastify.css';

export default function Layout({ children }: { children: any }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Footer />
    </>
  );
}
```

## Props

### `children`

- Type: `React.ReactNode`

The `children` prop represents the main content of the application that will be injected into the layout. This can include various components and content specific to different pages.

This documentation provides an overview of the `Layout` component, its usage, and the available props for customization. The component is designed to create a consistent structure for the application, including a header, main content area, toast notifications, and a footer.