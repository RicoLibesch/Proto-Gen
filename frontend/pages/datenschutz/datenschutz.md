# Datenschutz Component Documentation

The `Datenschutz` component is a React functional component designed for displaying data privacy information. It utilizes functions from the `@/utils/API` module to fetch legal content and renders the content using the `react-markdown` library.

## Table of Contents

- [Dependencies](#dependencies)
- [Usage](#usage)
- [State](#state)
- [Effect](#effect)
- [UI Structure](#ui-structure)
- [Styling](#styling)

## Dependencies

- `useEffect` and `useState` from React for managing component lifecycle and state.
- `API` module from `"@/utils/API"` for fetching legal content.
- `react-markdown` for rendering Markdown content.
- `@uiw/react-markdown-preview/markdown.css` for styling the Markdown content.

## Usage

The `Datenschutz` component can be used within a Next.js application to display data privacy information.

```jsx
import Datenschutz from '@/components/Datenschutz';

const DatenschutzPage = () => {
  return <Datenschutz />;
};

export default DatenschutzPage;
```

## State

- **legalContent**: Holds the legal content retrieved from the backend API.

## Effect

The `useEffect` hook is used to fetch legal content from the backend API when the component mounts. It updates the `legalContent` state with the fetched data.

```jsx
useEffect(() => {
  const loadData = async () => {
    const data = await API.getLegals();
    setLegalContent(data[1].value);
  };
  loadData();
}, []);
```

## UI Structure

The UI structure of the `Datenschutz` component consists of a title ("Datenschutz") and a horizontal rule for visual separation. The legal content is rendered using the `Markdown` component, which parses and renders the content in Markdown format.

```jsx
<div className="m-5">
  <h1 className="text-primary">Datenschutz</h1>
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

This documentation provides an overview of the `Datenschutz` component, its dependencies, usage, state management, effect, UI structure, and styling considerations. Adjustments can be made based on specific project requirements and additional functionality.