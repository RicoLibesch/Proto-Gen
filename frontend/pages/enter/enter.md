# Enter Component Documentation

The `Enter` component is a React functional component designed for registering attendees to a session. It utilizes functions from the `@/utils/API` module to interact with the backend, and it integrates with Next.js for routing. The component handles user input, checks for an active session, and allows users to join the session by entering their names.

## Table of Contents

- [Dependencies](#dependencies)
- [Usage](#usage)
- [State](#state)
- [Methods](#methods)
- [Effect](#effect)
- [UI Structure](#ui-structure)
- [Styling](#styling)

## Dependencies

- `addAttendees`, `sessionRunning`, and `store` functions from `"@/utils/API"` for backend interactions and global state management.
- `useRouter` from Next.js for handling navigation.
- `useEffect` and `useState` from React for managing component lifecycle and state.
- `react-toastify` for displaying toast messages.

## Usage

The `Enter` component can be used within a Next.js application to allow users to join a session by entering their names.

```jsx
import Enter from '@/components/Enter';

const EnterPage = () => {
  return <Enter />;
};

export default EnterPage;
```

## State

- **username**: Holds the value of the entered username.

## Methods

- **register()**: Performs the registration action when the "Beitreten" button is clicked. It validates the entered name, calls the `addAttendees` function to register the user, and navigates to the home page.

## Effect

The `useEffect` hook is used to check for an active session and handle user redirection based on the session status. If there is no active session, the user is directed back. If a user is already authenticated (stored in the global state), their name is automatically registered, and they are redirected to the home page.

```jsx
useEffect(() => {
  const load = async () => {
    const session = await sessionRunning();
    if (!session) {
      router.back();
      return;
    }
    if (user) {
      await addAttendees(user.displayName);
      router.push("/");
      return;
    }
  };
  load();
}, [user]);
```

## UI Structure

The UI structure of the `Enter` component consists of a form with an input field for entering the name. It includes buttons for navigation and registration.

```jsx
<div className="flex grow justify-center items-center" style={{ height: "75vh" }}>
  <div className="rounded-xl border border-outline p-6 shadow hover:shadow-lg transition-all">
    {/* ... */}
    <input
      type="text"
      placeholder="Name"
      className="focus:outline-none border border-secondary rounded-md p-2"
      onChange={(x) => setUsername(x.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") register();
      }}
    ></input>
    {/* ... */}
    <button
      className="rounded-full bg-mni text-white py-1 px-5 m-2 transition-all hover:bg-mni_hover"
      onClick={register}
    >
      Beitreten
    </button>
    {/* ... */}
  </div>
</div>
```

## Styling

The component uses default styling provided by Tailwind CSS for layout and positioning. Additional styling can be applied based on project requirements.

This documentation provides an overview of the `Enter` component, its dependencies, usage, state management, methods, effect, UI structure, and styling considerations. Adjustments can be made based on specific project requirements and additional functionality.