# Impressum Component Documentation

The `Impressum` component is a React functional component responsible for displaying legal content, specifically the "Impressum." It retrieves the legal information from a backend API using the `API.getLegals()` function, and then renders the content using the `react-markdown` library.

## Table of Contents

- [Dependencies](#dependencies)
- [Usage](#usage)
- [State](#state)
- [Effect](#effect)
- [UI Structure](#ui-structure)
- [Styling](#styling)

## Dependencies

- `API` module from `"@/utils/API"` for fetching legal content.
- `useEffect` and `useState` from React for managing component lifecycle and state.
- `react-markdown` for rendering Markdown content.
- `@uiw/react-markdown-preview/markdown.css` for styling the Markdown content.

## Usage

The `Impressum` component can be used within a Next.js application to display legal information.

```jsx
import Impressum from '@/components/Impressum';

const ImpressumPage = () => {
  return <Impressum />;
};

export default ImpressumPage;
```

## State

- **legalContent**: Holds the legal content retrieved from the backend API.

## Effect

The `useEffect` hook is used to fetch legal content from the backend API when the component mounts. It updates the `legalContent` state with the fetched data.

```jsx
useEffect(() => {
  const loadData = async () => {
    const data = await API.getLegals();
    setLegalContent(data[0].value);
  };
  loadData();
}, []);
```

## UI Structure

The UI structure of the `Impressum` component consists of a title ("Impressum") and a horizontal rule for visual separation. The legal content is rendered using the `Markdown` component, which parses and renders the content in Markdown format.

```jsx
<div className="m-5">
  <h1 className="text-primary">Impressum</h1>
  <hr />
  <div className="flex flex-wrap m-2 justify-center" data-color-mode="light">
    <Markdown skipHtml className="wmde-markdown">
      {legalContent}
    </Markdown>
  </div>
</div>
```

## Styling

The component uses default styling provided by Tailwind CSS for layout and positioning. The `@uiw/react-markdown-preview/markdown.css` is included to style the rendered Markdown content. Additional styling can be applied based on project requirements.

This documentation provides an overview of the `Impressum` component, its dependencies, usage, state management, effect, UI structure, and styling considerations. Adjustments can be made based on specific project requirements and additional functionality.